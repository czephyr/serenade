from collections.abc import Callable
import os

from fastapi import Depends, HTTPException, Security, status
from fastapi.security import OAuth2PasswordBearer
from keycloak import KeycloakOpenID
from keycloak.exceptions import KeycloakAuthenticationError


from ..dbsession import SessionLocal

keycloak_openid = KeycloakOpenID(
    server_url=os.getenv("KEYCLOAK_SERVER_URL"),
    client_id=os.getenv("KEYCLOAK_CLIENT_ID"),
    realm_name=os.getenv("KEYCLOAK_REALM_NAME"),
    client_secret_key=os.getenv("KEYCLOAK_CLIENT_SECRET_KEY"),
)

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="{server_url}/realms/{realm_name}/protocol/openid-connect/token".format(
        server_url=os.getenv("KEYCLOAK_SERVER_URL"),
        realm_name=os.getenv("KEYCLOAK_REALM_NAME"),
    )
)


def get_db():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


def user_info(token: str = Security(oauth2_scheme)) -> dict:
    try:
        token_info = keycloak_openid.introspect(token)
    except KeycloakAuthenticationError as inst:
        raise HTTPException(
            status_code=401,
            detail=f'{{"error": "Invalid credentials", "message": "{inst.error_message}", "body": "{inst.response_body}"}}',
        ) from inst
    if not token_info.get("active"):
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            detail="token is correct but not active, it cannot be used to authenticate",
        )
    return token_info


def require_role(admitted_roles: list[str]) -> Callable[[dict], str]:
    """
    Dependency to enforce role requirements.
    Accepts a list of required roles and returns a dependency function.
    """

    def role_checker(current_user: dict = Depends(user_info)) -> str:
        try:
            user_roles = current_user["realm_access"]["roles"]
        except KeyError:
            raise HTTPException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Malformed JWT",
            )

        for role in admitted_roles:
            if role in user_roles:
                return role

        raise HTTPException(
            status.HTTP_403_FORBIDDEN, detail="Insufficient permissions"
        )

    return role_checker
