import keycloak.exceptions
from fastapi import Depends, HTTPException, Security, status

from ..core.keycloak_config import keycloak_openid, oauth2_scheme
from ..dbsession import SessionLocal


def get_db():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


def get_current_user(token: str = Security(oauth2_scheme)):
    try:
        credentials = keycloak_openid.introspect(token)
    except keycloak.exceptions.KeycloakAuthenticationError as inst:
        raise HTTPException(
            status_code=401,
            detail=f'{{"error": "Invalid credentials", "message": "{inst.error_message}", "body": "{inst.response_body}"}}',
        ) from inst
    if not credentials["active"]:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Inactive credentials")
    return credentials


def require_role(required_roles: list[str]):
    """
    Dependency to enforce role requirements.
    Accepts a list of required roles and returns a dependency function.
    """

    def role_checker(current_user: dict = Depends(get_current_user)):
        user_roles = current_user.get("realm_access", {}).get("roles", [])
        if not any(role in user_roles for role in required_roles):
            raise HTTPException(status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
        return current_user

    return role_checker


def get_roles(current_user: dict = Depends(get_current_user)):
    user_roles = current_user.get("realm_access", {}).get("roles", [])
    return user_roles

def check_role(role, current_user: dict = Depends(get_current_user)):
    if role not in get_roles():
        raise HTTPException(status.HTTP_403_FORBIDDEN, f"user `{current_user["username"]}` is not in `{role}` group")
