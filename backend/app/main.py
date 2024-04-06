from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os
from fastapi import Request
import logging

# Import OpenTelemetry libraries
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor
from prometheus_fastapi_instrumentator import Instrumentator

from opentelemetry.exporter.otlp.proto.grpc._log_exporter import OTLPLogExporter
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler 
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor, SimpleLogRecordProcessor, ConsoleLogExporter
from opentelemetry.instrumentation.logging import LoggingInstrumentor
from opentelemetry.sdk.resources import Resource
from opentelemetry._logs import (
    SeverityNumber,
    get_logger,
    get_logger_provider,
    std_to_otel,
    set_logger_provider
)

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
Instrumentator().instrument(app).expose(app)

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
class FormattedLoggingHandler(LoggingHandler):
    def emit(self, record: logging.LogRecord) -> None:
        msg = self.format(record)
        record.msg = msg
        record.args = None
        self._logger.emit(self._translate(record))

# Include routers
app.include_router(api_router, prefix=settings.API_V1_STR)

if __name__ == "__main__":
        # Set up logging
    logger = logging.getLogger("mannaggia")
    logger.setLevel(logging.DEBUG)


    logger_provider = LoggerProvider(
        resource=Resource.create({})
    )
    set_logger_provider(logger_provider)

    otlp_log_exporter = OTLPLogExporter(endpoint='http://localhost:4317',insecure=True)
    logger_provider.add_log_record_processor(BatchLogRecordProcessor(otlp_log_exporter))

    otel_log_handler = FormattedLoggingHandler(logger_provider=logger_provider)

# This has to be called first before logger.getLogger().addHandler() so that it can call logging.basicConfig first to set the logging format
    # based on the environment variable OTEL_PYTHON_LOG_FORMAT
    LoggingInstrumentor().instrument()
    logFormatter = logging.Formatter()
    otel_log_handler.setFormatter(logFormatter)
    

    formatter = logging.Formatter('%(asctime)s | %(filename)s | %(levelname)s - %(message)s')

    ch = logging.StreamHandler()
    ch.setLevel(logging.DEBUG)
    ch.setFormatter(formatter)

    logger.addHandler(ch)
    logger.addHandler(otel_log_handler)

    logger.info("-"*300)

    for route in app.routes:
        if hasattr(route, "methods"):
            methods = ", ".join(route.methods)
            print(f"Path: {route.path}, Methods: {methods}")
        else:
            print(f"Path: {route.path}")
    print(os.getenv("KEYCLOAK_REALM"))
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
