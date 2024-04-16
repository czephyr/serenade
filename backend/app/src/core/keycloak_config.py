import os
from keycloak import KeycloakOpenID
from fastapi.security import OAuth2PasswordBearer

keycloak_openid = KeycloakOpenID(
    server_url=os.getenv("KEYCLOAK_HOST"),
    client_id=os.getenv("KEYCLOAK_CLIENT_ID"),
    realm_name=os.getenv("KEYCLOAK_REALM"),
    client_secret_key=os.getenv("KEYCLOAK_CLIENT_SECRET"),
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
