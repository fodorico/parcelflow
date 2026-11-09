from app.security import hash_password, hash_token, new_session_token, verify_password


async def test_a_password_verifies_only_against_its_own_hash() -> None:
    password_hash = await hash_password("correct horse battery")

    assert password_hash.startswith("$argon2id$")
    assert await verify_password("correct horse battery", password_hash)
    assert not await verify_password("wrong horse battery", password_hash)


async def test_no_password_never_verifies() -> None:
    assert not await verify_password("parcelflow-dummy-password", None)
    assert not await verify_password("", None)


async def test_a_malformed_hash_does_not_verify() -> None:
    assert not await verify_password("anything", "not-a-hash")


def test_session_tokens_are_random_and_stored_hashed() -> None:
    first, second = new_session_token(), new_session_token()

    assert first != second
    assert len(first) >= 43
    assert hash_token(first) == hash_token(first)
    assert len(hash_token(first)) == 64
    assert hash_token(first) != first
