from datetime import datetime
from typing import Annotated, Literal

from pydantic import AfterValidator, BaseModel, ConfigDict, EmailStr, Field, StringConstraints

from app.countries import CountryCode, Language
from app.models import Role

# Error codes in `detail`: the frontend shows a translated message for each.
ErrorCode = Literal[
    "invalid_credentials",
    "email_taken",
    "not_authenticated",
    "forbidden",
    "demo_disabled",
    "demo_account_missing",
]


class HealthRead(BaseModel):
    status: Literal["ok"]


def _lowercase(value: str) -> str:
    return value.lower()


Email = Annotated[EmailStr, AfterValidator(_lowercase)]
FullName = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=120)]
# Length is what matters (NIST SP 800-63B): no composition rules.
Password = Annotated[str, Field(min_length=10, max_length=128)]


class SignupCreate(BaseModel):
    """Self sign-up: always creates a customer."""

    email: Email
    full_name: FullName
    password: Password
    country_code: CountryCode
    language: Language


class LoginCreate(BaseModel):
    email: Email
    # Not length-checked: a wrong password must get the same answer as any other.
    password: str = Field(max_length=128)


class DemoLoginCreate(BaseModel):
    role: Role
    country_code: CountryCode


class UserCreate(SignupCreate):
    """An admin creates an account with any role (couriers and admins can't sign up)."""

    role: Role


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    full_name: str
    role: Role
    country_code: CountryCode
    language: Language
    is_active: bool
    is_demo: bool
    created_at: datetime


class DemoAccountRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    role: Role
    country_code: CountryCode
    full_name: str


class ErrorRead(BaseModel):
    detail: ErrorCode
