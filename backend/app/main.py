from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os
from fastapi import Request

# Import OpenTelemetry libraries
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor
from prometheus_fastapi_instrumentator import Instrumentator

from api.api import api_router
from db.session import engine
from db.base_class import Base
from core.config import settings

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

# Instrument FastAPI app and SQLAlchemy
FastAPIInstrumentor.instrument_app(app)
SQLAlchemyInstrumentor().instrument(engine=engine)
# Instrumentator().instrument(app).expose(app)

# Dependency
def get_db() -> Session:
    db = Session(autocommit=False, autoflush=False, bind=engine)
    try:
        yield db
    finally:
        db.close()

# debug purposes
# @app.middleware("http")
# async def check_trace_context(request: Request, call_next):
#     traceparent_header = request.headers.get("traceparent")
#     print(request.headers)
#     if traceparent_header:
#         print(f"Traceparent: {traceparent_header}")
#     else:
#         print("Traceparent header missing.")
    
#     response = await call_next(request)
#     return response


# Include routers
app.include_router(api_router, prefix=settings.API_V1_STR)

if __name__ == "__main__":
    for route in app.routes:
        if hasattr(route, "methods"):
            methods = ", ".join(route.methods)
            print(f"Path: {route.path}, Methods: {methods}")
        else:
            print(f"Path: {route.path}")
    print(os.getenv("KEYCLOAK_REALM"))
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
