"""Database tables. Every model must be importable from here so Alembic can see it."""

from datetime import datetime
from enum import StrEnum

from sqlalchemy import DateTime, Enum, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.countries import CountryCode, Language
from app.db import Base


class Role(StrEnum):
    CUSTOMER = "customer"
    COURIER = "courier"
    ADMIN = "admin"


def _enum(enum: type[StrEnum], length: int) -> Enum:
    """Stored as its value in a VARCHAR with a CHECK constraint, so adding a member needs no
    PostgreSQL enum migration."""
    return Enum(
        enum,
        native_enum=False,
        create_constraint=True,
        length=length,
        values_callable=lambda members: [member.value for member in members],
        validate_strings=True,
    )


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    # Always stored lowercase, so lookups and the unique index ignore case.
    email: Mapped[str] = mapped_column(String(320), unique=True)
    full_name: Mapped[str] = mapped_column(String(120))
    # None: the account can't log in with a password (demo accounts; later, social logins).
    password_hash: Mapped[str | None] = mapped_column(String(255))
    role: Mapped[Role] = mapped_column(_enum(Role, 16), index=True)
    country_code: Mapped[CountryCode] = mapped_column(_enum(CountryCode, 2))
    language: Mapped[Language] = mapped_column(_enum(Language, 8))
    is_active: Mapped[bool] = mapped_column(default=True)
    is_demo: Mapped[bool] = mapped_column(default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class UserSession(Base):
    """A logged-in browser. The cookie holds a random token; only its SHA-256 is stored, so a
    leaked database can't be used to log in."""

    __tablename__ = "user_sessions"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    token_hash: Mapped[str] = mapped_column(String(64), unique=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
