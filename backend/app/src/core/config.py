from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "serenade"
    API_V1_STR: str = "/api/v1"
    CORS_ORIGINS: list = [
        "*",
    ]
    # Define other settings as needed
    # DATABASE_URL: str = "sqlite:///./test.db"
    # SECRET_KEY: str = "your-secret-key"

    KEYCLOAK_URL: str
    KEYCLOAK_REALM: str
    KEYCLOAK_CLIENT_ID: str
    KEYCLOAK_CLIENT_SECRET: str
    OTEL_COLLECTOR_URL: str

    class Config:
        # This is where you can put Pydantic's configuration settings
        # For example, to load the environment variables from a .env file:
        env_file = "../.env"
        env_file_encoding = "utf-8"


# Instantiate the Settings class
settings = Settings()
