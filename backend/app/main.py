from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .src.api import api_router
from .src.core.config import settings
from .src.dbsession import engine

# Create all tables in the database.
# Comment this out if you're using Alembic migrations.
from .src.ormodels import Base

Base.metadata.create_all(bind=engine)

app = FastAPI(
    debug=True,
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(
    api_router,
    prefix=settings.API_V1_STR,
)
# You might want to add more endpoints or configurations here

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
