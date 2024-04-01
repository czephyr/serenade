from typing import Dict, Generator, List

import keycloak.exceptions
from core.keycloak_config import keycloak_openid, oauth2_scheme
from db.session import SessionLocal
from fastapi import Depends, HTTPException, Security, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session


def get_db() -> Generator:
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
            status_code=inst.response_code,
            detail=f'{{"error": "Invalid credentials", "message": "{inst.error_message}", "body": "{inst.response_body}"}}',
        ) from inst
    if not credentials["active"]:
        raise HTTPException(status_code=401, detail="Inactive credentials")
    return credentials

def require_role(required_roles: List[str]):
    """
    Dependency to enforce role requirements.
    Accepts a list of required roles and returns a dependency function.
    """

    def role_checker(current_user: Dict = Depends(get_current_user)):
        user_roles = current_user.get("realm_access", {}).get("roles", [])
        if not any(role in user_roles for role in required_roles):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions"
            )
        return current_user

    return role_checker

def is_imt_or_iit(current_user: Dict = Depends(get_current_user)):
    user_roles = current_user.get("realm_access", {}).get("roles", [])
    for role in ["imt", "iit"]:
        if role in user_roles:
            return role