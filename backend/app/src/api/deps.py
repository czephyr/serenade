import keycloak.exceptions
from fastapi import Depends, HTTPException, Security, status

from ..core.keycloak_config import keycloak_openid, oauth2_scheme
from ..dbsession import SessionLocal
from ..core.roles import IIT, IMT


def get_db():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


async def get_current_user(token: str = Security(oauth2_scheme)):
    try:
        credentials = keycloak_openid.introspect(token)
    except keycloak.exceptions.KeycloakAuthenticationError as inst:
        raise HTTPException(
            # TODO invece 403?
            status_code=401,
            detail=f'{{"error": "Invalid credentials", "message": "{inst.error_message}", "body": "{inst.response_body}"}}',
        ) from inst
    if not credentials["active"]:
        raise HTTPException(status_code=401, detail="Inactive credentials")
    return credentials


def require_role(required_roles: list[str]):
    """
    Dependency to enforce role requirements.
    Accepts a list of required roles and returns a dependency function.
    """

    def role_checker(current_user: dict = Depends(get_current_user)):
        user_roles = current_user.get("realm_access", {}).get("roles", [])
        if not any(role in user_roles for role in required_roles):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions"
            )
        return current_user

    return role_checker


def is_imt_or_iit(current_user: dict = Depends(get_current_user)):
    user_roles = current_user.get("realm_access", {}).get("roles", [])
    for role in [IMT, IIT]:
        if role in user_roles:
            return role
    else:
        raise ValueError(
            "current_user was supposed to match at least one valid role, but it failed"
        )
