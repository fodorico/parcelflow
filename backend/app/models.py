"""Database tables. Every model must be importable from here so Alembic can see it."""

from app.db import Base

__all__ = ["Base"]
