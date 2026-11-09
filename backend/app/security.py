"""Password hashing and session tokens."""

import asyncio
import hashlib
import secrets

from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerificationError

_hasher = PasswordHasher()

# Verified against when the user doesn't exist (or has no password), so a login takes the same
# time either way and doesn't reveal which emails have an account.
_DUMMY_HASH = _hasher.hash("parcelflow-dummy-password")


async def hash_password(password: str) -> str:
    # Argon2 is deliberately slow: run it off the event loop.
    return await asyncio.to_thread(_hasher.hash, password)


async def verify_password(password: str, password_hash: str | None) -> bool:
    def verify() -> bool:
        try:
            return _hasher.verify(password_hash or _DUMMY_HASH, password) and bool(password_hash)
        except VerificationError, InvalidHashError:
            return False

    return await asyncio.to_thread(verify)


def new_session_token() -> str:
    return secrets.token_urlsafe(32)


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()
