"""Demo accounts for the public portfolio demo (only when DEMO_MODE is on)."""

from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from app.countries import COUNTRIES, CountryCode
from app.models import Role, User

DEMO_NAMES: dict[CountryCode, dict[Role, str]] = {
    CountryCode.AR: {
        Role.CUSTOMER: "Lucía Fernández",
        Role.COURIER: "Martín Gómez",
        Role.ADMIN: "Sofía Pereyra",
    },
    CountryCode.US: {
        Role.CUSTOMER: "Emily Johnson",
        Role.COURIER: "Michael Brown",
        Role.ADMIN: "Sarah Davis",
    },
    CountryCode.ES: {
        Role.CUSTOMER: "Carmen García",
        Role.COURIER: "Javier López",
        Role.ADMIN: "Laura Martínez",
    },
}


def demo_email(role: Role, country: CountryCode) -> str:
    # .test is reserved (RFC 2606): these addresses can never reach a real inbox.
    return f"{role.value}.{country.value.lower()}@demo.parcelflow.test"


async def seed_demo_accounts(session_factory: async_sessionmaker[AsyncSession]) -> None:
    """Create the missing demo accounts; existing ones are left as they are."""
    rows = [
        {
            "email": demo_email(role, code),
            "full_name": name,
            # No password: demo accounts are reachable only through the demo login.
            "password_hash": None,
            "role": role,
            "country_code": code,
            "language": COUNTRIES[code].default_language,
            "is_demo": True,
        }
        for code, names in DEMO_NAMES.items()
        for role, name in names.items()
    ]
    async with session_factory() as session:
        await session.execute(
            insert(User).values(rows).on_conflict_do_nothing(index_elements=["email"])
        )
        await session.commit()
