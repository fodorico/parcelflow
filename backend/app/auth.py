"""Sessions and the dependencies that protect endpoints."""

from collections.abc import Awaitable, Callable
from datetime import UTC, datetime, timedelta
from typing import Annotated

from fastapi import Depends, HTTPException, Request, Response, status
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import Settings
from app.db import get_session
from app.models import Role, User, UserSession
from app.security import hash_token, new_session_token

DbSession = Annotated[AsyncSession, Depends(get_session)]


def get_settings_from_app(request: Request) -> Settings:
    settings: Settings = request.app.state.settings
    return settings


AppSettings = Annotated[Settings, Depends(get_settings_from_app)]


async def start_session(
    db: AsyncSession, response: Response, settings: Settings, user: User
) -> None:
    """Store a new session for `user` and send its token in an httpOnly cookie."""
    token = new_session_token()
    ttl = timedelta(hours=settings.session_ttl_hours)
    db.add(
        UserSession(
            user_id=user.id, token_hash=hash_token(token), expires_at=datetime.now(UTC) + ttl
        )
    )
    await db.commit()
    response.set_cookie(
        settings.session_cookie_name,
        token,
        max_age=int(ttl.total_seconds()),
        httponly=True,
        secure=settings.cookie_secure,
        # Not sent on cross-site POSTs, which together with JSON-only endpoints blocks CSRF.
        samesite="lax",
        path="/",
    )


async def end_session(
    db: AsyncSession, request: Request, response: Response, settings: Settings
) -> None:
    token = request.cookies.get(settings.session_cookie_name)
    if token:
        await db.execute(delete(UserSession).where(UserSession.token_hash == hash_token(token)))
        await db.commit()
    response.delete_cookie(
        settings.session_cookie_name,
        httponly=True,
        secure=settings.cookie_secure,
        samesite="lax",
        path="/",
    )


async def get_current_user(request: Request, db: DbSession, settings: AppSettings) -> User:
    token = request.cookies.get(settings.session_cookie_name)
    if token:
        user = await db.scalar(
            select(User)
            .join(UserSession, UserSession.user_id == User.id)
            .where(
                UserSession.token_hash == hash_token(token),
                UserSession.expires_at > datetime.now(UTC),
                User.is_active,
            )
        )
        if user:
            return user
    raise HTTPException(status.HTTP_401_UNAUTHORIZED, "not_authenticated")


CurrentUser = Annotated[User, Depends(get_current_user)]


def require_roles(*roles: Role) -> Callable[[User], Awaitable[User]]:
    """Dependency that lets through only logged-in users with one of `roles`."""

    async def dependency(user: CurrentUser) -> User:
        if user.role not in roles:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "forbidden")
        return user

    return dependency


AdminUser = Annotated[User, Depends(require_roles(Role.ADMIN))]
