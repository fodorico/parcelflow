import pytest

from app.config import Settings


def test_empty_variables_fall_back_to_defaults(monkeypatch: pytest.MonkeyPatch) -> None:
    for name in ["DATABASE_URL", "CORS_ORIGINS"]:
        monkeypatch.setenv(name, "")

    settings = Settings(_env_file=None)

    assert settings.database_url == Settings.model_fields["database_url"].default
    assert settings.cors_origins == ["http://localhost:5173"]
