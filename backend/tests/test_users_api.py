from collections.abc import Awaitable, Callable

from httpx import AsyncClient

from app.models import Role, User
from tests.conftest import log_in

CreateUser = Callable[..., Awaitable[User]]

COURIER = {
    "email": "new.courier@example.com",
    "full_name": "New Courier",
    "password": "temporary password",
    "country_code": "US",
    "language": "en",
    "role": "courier",
}


async def test_an_admin_creates_a_courier_who_can_log_in(
    client: AsyncClient, create_user: CreateUser
) -> None:
    await create_user("admin@example.com", Role.ADMIN)
    await log_in(client, "admin@example.com")

    response = await client.post("/api/users", json=COURIER)

    assert response.status_code == 201
    assert response.json()["role"] == "courier"
    await client.post("/api/auth/logout")
    await log_in(client, "new.courier@example.com", "temporary password")


async def test_an_admin_lists_users_filtered_by_role(
    client: AsyncClient, create_user: CreateUser
) -> None:
    await create_user("admin@example.com", Role.ADMIN)
    await create_user("c1@example.com", Role.COURIER)
    await create_user("c2@example.com", Role.COURIER)
    await create_user("customer@example.com", Role.CUSTOMER)
    await log_in(client, "admin@example.com")

    everyone = (await client.get("/api/users")).json()
    couriers = (await client.get("/api/users", params={"role": "courier"})).json()

    assert len(everyone) == 4
    assert [user["email"] for user in couriers] == ["c2@example.com", "c1@example.com"]


async def test_an_admin_cannot_reuse_an_email(client: AsyncClient, create_user: CreateUser) -> None:
    await create_user("admin@example.com", Role.ADMIN)
    await log_in(client, "admin@example.com")

    response = await client.post("/api/users", json={**COURIER, "email": "ADMIN@example.com"})

    assert response.status_code == 409


async def test_only_admins_manage_users(client: AsyncClient, create_user: CreateUser) -> None:
    assert (await client.get("/api/users")).status_code == 401

    for email, role in [("courier@example.com", Role.COURIER), ("cust@example.com", Role.CUSTOMER)]:
        await create_user(email, role)
        await log_in(client, email)
        assert (await client.get("/api/users")).status_code == 403
        response = await client.post("/api/users", json=COURIER)
        assert response.status_code == 403
        assert response.json() == {"detail": "forbidden"}
