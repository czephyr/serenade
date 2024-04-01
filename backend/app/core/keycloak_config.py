import os
from keycloak import KeycloakOpenID
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv
from .config import settings
# load_dotenv("../../.env")
# print(os.getenv("KEYCLOAK_REALM"))

keycloak_openid = KeycloakOpenID(
    server_url=settings.KEYCLOAK_URL,
    client_id=settings.KEYCLOAK_CLIENT_ID,
    realm_name=settings.KEYCLOAK_REALM,
    client_secret_key=settings.KEYCLOAK_CLIENT_SECRET,
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")