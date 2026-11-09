from collections.abc import AsyncIterator, Awaitable, Callable, Iterator
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any

import pytest
from alembic import command
from alembic.config import Config
from httpx import ASGITransport, AsyncClient
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession
from testcontainers.community.postgres import PostgresContainer

from app.config import Settings
from app.countries import CountryCode, Language
from app.db import Base, create_engine
from app.main import create_app
from app.models import Role, User
from app.security import hash_password

BACKEND_DIR = Path(__file__).resolve().parent.parent


@pytest.fixture(scope="session")
def database_url() -> Iterator[str]:
    with PostgresContainer("postgres:18", driver="asyncpg") as postgres:
        url = postgres.get_connection_url()
        config = Config(str(BACKEND_DIR / "alembic.ini"))
        config.set_main_option("script_location", str(BACKEND_DIR / "alembic"))
        config.set_main_option("sqlalchemy.url", url)
        command.upgrade(config, "head")
        yield url


@pytest.fixture(scope="session")
async def engine(database_url: str) -> AsyncIterator[AsyncEngine]:
    engine = create_engine(database_url)
    yield engine
    await engine.dispose()


# Only tests that use the database (through `client`) pay for PostgreSQL: the container starts
# once per run, on first use, and tables are emptied before each of those tests. Unit tests
# don't touch it, so running them alone takes well under a second.
@pytest.fixture
async def clean_tables(engine: AsyncEngine) -> None:
    tables = ", ".join(table.name for table in Base.metadata.sorted_tables)
    if not tables:
        return
    async with engine.begin() as connection:
        await connection.execute(text(f"TRUNCATE {tables} RESTART IDENTITY CASCADE"))


def settings_for(database_url: str, **overrides: Any) -> Settings:
    # The test client talks plain http://test, so the session cookie can't be Secure.
    return Settings(_env_file=None, database_url=database_url, cookie_secure=False, **overrides)


@asynccontextmanager
async def make_client(settings: Settings) -> AsyncIterator[AsyncClient]:
    app = create_app(settings)
    async with (
        app.router.lifespan_context(app),
        AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as http_client,
    ):
        yield http_client


@pytest.fixture
async def client(database_url: str, clean_tables: None) -> AsyncIterator[AsyncClient]:
    async with make_client(settings_for(database_url)) as http_client:
        yield http_client


@pytest.fixture
async def demo_client(database_url: str, clean_tables: None) -> AsyncIterator[AsyncClient]:
    """Demo mode on: the demo accounts are seeded on start."""
    async with make_client(settings_for(database_url, demo_mode=True)) as http_client:
        yield http_client


PASSWORD = "correct horse battery"


@pytest.fixture
def create_user(engine: AsyncEngine) -> Callable[..., Awaitable[User]]:
    """Insert an account directly (e.g. an admin, who can't sign up), with password PASSWORD."""

    async def create(
        email: str = "admin@example.com", role: Role = Role.ADMIN, **fields: Any
    ) -> User:
        user = User(
            email=email,
            full_name=fields.pop("full_name", "Test User"),
            password_hash=fields.pop("password_hash")
            if "password_hash" in fields
            else await hash_password(PASSWORD),
            role=role,
            country_code=fields.pop("country_code", CountryCode.AR),
            language=fields.pop("language", Language.ES_419),
            **fields,
        )
        async with AsyncSession(engine, expire_on_commit=False) as session:
            session.add(user)
            await session.commit()
        return user

    return create


async def log_in(client: AsyncClient, email: str, password: str = PASSWORD) -> None:
    response = await client.post("/api/auth/login", json={"email": email, "password": password})
    assert response.status_code == 200, response.text
