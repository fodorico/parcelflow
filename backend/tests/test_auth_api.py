from collections.abc import Awaitable, Callable

from httpx import AsyncClient

from app.models import Role, User
from tests.conftest import PASSWORD, log_in

SIGNUP = {
    "email": "Ana@Example.com",
    "full_name": "  Ana Ruiz ",
    "password": "long enough password",
    "country_code": "AR",
    "language": "es-419",
}

CreateUser = Callable[..., Awaitable[User]]


async def test_signup_creates_a_logged_in_customer(client: AsyncClient) -> None:
    response = await client.post("/api/auth/signup", json=SIGNUP)

    assert response.status_code == 201
    user = response.json()
    assert user["email"] == "ana@example.com"
    assert user["full_name"] == "Ana Ruiz"
    assert user["role"] == "customer"
    cookie = response.headers["set-cookie"]
    assert "parcelflow_session=" in cookie
    assert "HttpOnly" in cookie
    assert "samesite=lax" in cookie.lower()
    me = await client.get("/api/auth/me")
    assert me.json()["email"] == "ana@example.com"


async def test_signup_ignores_a_requested_role(client: AsyncClient) -> None:
    response = await client.post("/api/auth/signup", json={**SIGNUP, "role": "admin"})

    assert response.json()["role"] == "customer"


async def test_signup_rejects_a_taken_email_in_any_case(client: AsyncClient) -> None:
    await client.post("/api/auth/signup", json=SIGNUP)

    response = await client.post("/api/auth/signup", json={**SIGNUP, "email": "ANA@example.com"})

    assert response.status_code == 409
    assert response.json() == {"detail": "email_taken"}


async def test_signup_validates_the_input(client: AsyncClient) -> None:
    for invalid in [
        {"password": "short"},
        {"email": "not-an-email"},
        {"full_name": "   "},
        {"country_code": "BR"},
        {"language": "fr"},
    ]:
        response = await client.post("/api/auth/signup", json={**SIGNUP, **invalid})
        assert response.status_code == 422, invalid


async def test_login_and_logout(client: AsyncClient, create_user: CreateUser) -> None:
    await create_user("courier@example.com", Role.COURIER)

    response = await client.post(
        "/api/auth/login", json={"email": "COURIER@example.com", "password": PASSWORD}
    )

    assert response.status_code == 200
    assert response.json()["role"] == "courier"
    assert (await client.get("/api/auth/me")).status_code == 200

    logout = await client.post("/api/auth/logout")

    assert logout.status_code == 204
    me = await client.get("/api/auth/me")
    assert me.status_code == 401
    assert me.json() == {"detail": "not_authenticated"}


async def test_logout_revokes_the_session_even_if_the_cookie_is_kept(
    client: AsyncClient, create_user: CreateUser
) -> None:
    await create_user("courier@example.com", Role.COURIER)
    await log_in(client, "courier@example.com")
    token = client.cookies["parcelflow_session"]

    await client.post("/api/auth/logout")
    client.cookies.set("parcelflow_session", token)

    assert (await client.get("/api/auth/me")).status_code == 401


async def test_login_gives_the_same_answer_for_any_failure(
    client: AsyncClient, create_user: CreateUser
) -> None:
    await create_user("active@example.com", Role.CUSTOMER)
    await create_user("blocked@example.com", Role.CUSTOMER, is_active=False)

    for email, password in [
        ("active@example.com", "wrong password"),
        ("nobody@example.com", PASSWORD),
        ("blocked@example.com", PASSWORD),
    ]:
        response = await client.post("/api/auth/login", json={"email": email, "password": password})
        assert response.status_code == 401, email
        assert response.json() == {"detail": "invalid_credentials"}
        assert "set-cookie" not in response.headers


async def test_me_rejects_an_unknown_session(client: AsyncClient) -> None:
    client.cookies.set("parcelflow_session", "made-up-token")

    assert (await client.get("/api/auth/me")).status_code == 401


async def test_demo_login_is_off_by_default(client: AsyncClient) -> None:
    assert (await client.get("/api/auth/demo-accounts")).json() == []
    response = await client.post(
        "/api/auth/demo-login", json={"role": "admin", "country_code": "AR"}
    )
    assert response.status_code == 404
    assert response.json() == {"detail": "demo_disabled"}


async def test_demo_mode_offers_every_role_in_every_country(demo_client: AsyncClient) -> None:
    accounts = (await demo_client.get("/api/auth/demo-accounts")).json()

    assert {(account["country_code"], account["role"]) for account in accounts} == {
        (country, role)
        for country in ["AR", "US", "ES"]
        for role in ["customer", "courier", "admin"]
    }


async def test_demo_login_logs_in_as_the_demo_account(demo_client: AsyncClient) -> None:
    response = await demo_client.post(
        "/api/auth/demo-login", json={"role": "courier", "country_code": "ES"}
    )

    assert response.status_code == 200
    user = response.json()
    assert (user["role"], user["country_code"], user["is_demo"]) == ("courier", "ES", True)
    assert (await demo_client.get("/api/auth/me")).json()["id"] == user["id"]


async def test_an_account_without_password_cannot_log_in_with_one(
    client: AsyncClient, create_user: CreateUser
) -> None:
    # Like the demo accounts, which are reachable only through the demo login.
    await create_user("nopass@example.com", Role.CUSTOMER, password_hash=None)

    for password in ["", "parcelflow-dummy-password", PASSWORD]:
        response = await client.post(
            "/api/auth/login", json={"email": "nopass@example.com", "password": password}
        )
        assert response.status_code == 401, password
