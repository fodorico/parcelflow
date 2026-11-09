import logging
from collections.abc import AsyncIterator
from contextlib import AsyncExitStack, asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRoute

from app.api import health
from app.config import Settings, get_settings
from app.db import create_engine, create_session_factory


def _operation_id(route: APIRoute) -> str:
    return route.name


def create_app(settings: Settings | None = None) -> FastAPI:
    settings = settings or get_settings()

    @asynccontextmanager
    async def lifespan(app: FastAPI) -> AsyncIterator[None]:
        async with AsyncExitStack() as stack:
            engine = create_engine(settings.database_url)
            stack.push_async_callback(engine.dispose)
            app.state.settings = settings
            app.state.session_factory = create_session_factory(engine)
            yield

    app = FastAPI(
        title="ParcelFlow API",
        version="0.1.0",
        lifespan=lifespan,
        # Operation IDs become the generated frontend function names (e.g. getHealth).
        generate_unique_id_function=_operation_id,
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_methods=["GET", "POST", "PATCH", "DELETE"],
        allow_headers=["Content-Type"],
    )
    app.include_router(health.router)
    return app


logging.basicConfig(level=logging.INFO)
app = create_app()
