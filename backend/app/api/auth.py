from fastapi import APIRouter, HTTPException, Request, Response, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from app.auth import AppSettings, CurrentUser, DbSession, end_session, start_session
from app.demo import demo_email
from app.models import Role, User
from app.schemas import (
    DemoAccountRead,
    DemoLoginCreate,
    ErrorRead,
    LoginCreate,
    SignupCreate,
    UserRead,
)
from app.security import hash_password, verify_password

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post(
    "/signup",
    status_code=status.HTTP_201_CREATED,
    responses={409: {"model": ErrorRead}},
)
async def signup(
    body: SignupCreate, db: DbSession, response: Response, settings: AppSettings
) -> UserRead:
    """Create a customer account and log it in."""
    user = User(
        email=body.email,
        full_name=body.full_name,
        password_hash=await hash_password(body.password),
        role=Role.CUSTOMER,
        country_code=body.country_code,
        language=body.language,
    )
    db.add(user)
    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status.HTTP_409_CONFLICT, "email_taken") from None
    await start_session(db, response, settings, user)
    return UserRead.model_validate(user)


@router.post("/login", responses={401: {"model": ErrorRead}})
async def login(
    body: LoginCreate, db: DbSession, response: Response, settings: AppSettings
) -> UserRead:
    user = await db.scalar(select(User).where(User.email == body.email))
    # Always verify (against a dummy hash when there's no user), so timing reveals nothing.
    valid = await verify_password(body.password, user.password_hash if user else None)
    if not user or not valid or not user.is_active:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "invalid_credentials")
    await start_session(db, response, settings, user)
    return UserRead.model_validate(user)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    request: Request, db: DbSession, response: Response, settings: AppSettings
) -> None:
    await end_session(db, request, response, settings)


@router.get("/me", responses={401: {"model": ErrorRead}})
async def me(user: CurrentUser) -> UserRead:
    return UserRead.model_validate(user)


@router.get("/demo-accounts")
async def demo_accounts(db: DbSession, settings: AppSettings) -> list[DemoAccountRead]:
    """The accounts the demo login offers; empty when the demo mode is off."""
    if not settings.demo_mode:
        return []
    users = await db.scalars(
        select(User).where(User.is_demo, User.is_active).order_by(User.country_code, User.id)
    )
    return [DemoAccountRead.model_validate(user) for user in users]


@router.post("/demo-login", responses={404: {"model": ErrorRead}})
async def demo_login(
    body: DemoLoginCreate, db: DbSession, response: Response, settings: AppSettings
) -> UserRead:
    """Log in as a demo account without a password (demo mode only)."""
    if not settings.demo_mode:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "demo_disabled")
    user = await db.scalar(
        select(User).where(
            User.email == demo_email(body.role, body.country_code), User.is_demo, User.is_active
        )
    )
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "demo_account_missing")
    await start_session(db, response, settings, user)
    return UserRead.model_validate(user)
