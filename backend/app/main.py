from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os

from api.api import api_router
from db.session import engine
from db.base_class import Base
from core.config import settings

# Create all tables in the database.
# Comment this out if you're using Alembic migrations.
Base.metadata.create_all(bind=engine)

app = FastAPI(
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

# Dependency
def get_db() -> Session:
    db = Session(autocommit=False, autoflush=False, bind=engine)
    try:
        yield db
    finally:
        db.close()

# Include routers
app.include_router(api_router, prefix=settings.API_V1_STR)

# You might want to add more endpoints or configurations here

if __name__ == "__main__":
    for route in app.routes:
        if hasattr(route, "methods"):  # Filter out routes that support HTTP methods
            methods = ", ".join(route.methods)
            print(f"Path: {route.path}, Methods: {methods}")
        else:
            print(f"Path: {route.path}")
    print(os.getenv("KEYCLOAK_REALM"))
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
