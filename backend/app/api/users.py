from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from app.auth import AdminUser, DbSession
from app.models import Role, User
from app.schemas import ErrorRead, UserCreate, UserRead
from app.security import hash_password

router = APIRouter(
    prefix="/api/users",
    tags=["users"],
    responses={401: {"model": ErrorRead}, 403: {"model": ErrorRead}},
)


@router.get("")
async def list_users(_: AdminUser, db: DbSession, role: Role | None = None) -> list[UserRead]:
    """All accounts, newest first (admins only)."""
    query = select(User).order_by(User.created_at.desc(), User.id.desc())
    if role:
        query = query.where(User.role == role)
    return [UserRead.model_validate(user) for user in await db.scalars(query)]


@router.post("", status_code=status.HTTP_201_CREATED, responses={409: {"model": ErrorRead}})
async def create_user(body: UserCreate, _: AdminUser, db: DbSession) -> UserRead:
    """Create an account with any role, e.g. a courier (admins only)."""
    user = User(
        email=body.email,
        full_name=body.full_name,
        password_hash=await hash_password(body.password),
        role=body.role,
        country_code=body.country_code,
        language=body.language,
    )
    db.add(user)
    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status.HTTP_409_CONFLICT, "email_taken") from None
    return UserRead.model_validate(user)
