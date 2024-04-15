from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm

from ...core.keycloak_config import keycloak_openid
from ...schemas.auth import BearerToken

router = APIRouter()


@router.post("/login", response_model=BearerToken)
def login(form_data: OAuth2PasswordRequestForm = Depends()) -> BearerToken:
    token = keycloak_openid.token(
        username=form_data.username,
        password=form_data.password,
    )
    result = BearerToken(access_token=token["access_token"])
    return result
