from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings, read from environment variables or a local `.env` file."""

    # Empty variables (as copied from .env.example) mean "use the default".
    model_config = SettingsConfigDict(env_file=".env", extra="ignore", env_ignore_empty=True)

    database_url: str = "postgresql+asyncpg://app:app@localhost:5432/app"

    cors_origins: list[str] = ["http://localhost:5173"]

    session_cookie_name: str = "parcelflow_session"
    session_ttl_hours: int = Field(default=24 * 7, gt=0)
    # Browsers accept Secure cookies on http://localhost, so this only needs turning off for
    # clients that don't (e.g. the test client on http://test).
    cookie_secure: bool = True

    # Seeds one customer, courier and admin per country, and lets anyone log in as them with one
    # click. For the public demo only: never enable it with real users.
    demo_mode: bool = False


@lru_cache
def get_settings() -> Settings:
    return Settings()
