import os
from keycloak import KeycloakOpenID
from fastapi.security import OAuth2PasswordBearer

keycloak_openid = KeycloakOpenID(
    server_url=os.getenv("KEYCLOAK_URL"),
    client_id=os.getenv("CLIENT_ID"),
    realm_name=os.getenv("REALM_NAME"),
    client_secret_key=os.getenv("CLIENT_SECRET"),
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")