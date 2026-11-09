from collections.abc import AsyncIterator, Iterator
from pathlib import Path

import pytest
from alembic import command
from alembic.config import Config
from httpx import ASGITransport, AsyncClient
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncEngine
from testcontainers.community.postgres import PostgresContainer

from app.config import Settings
from app.db import Base, create_engine
from app.main import create_app

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


@pytest.fixture
async def client(database_url: str, clean_tables: None) -> AsyncIterator[AsyncClient]:
    app = create_app(Settings(database_url=database_url))
    async with (
        app.router.lifespan_context(app),
        AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as http_client,
    ):
        yield http_client
