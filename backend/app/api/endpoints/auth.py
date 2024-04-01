from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from core.keycloak_config import keycloak_openid

router = APIRouter()

@router.post("/login")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    token = keycloak_openid.token(username=form_data.username, password=form_data.password)
    return {"access_token": token["access_token"], "token_type": "bearer"}
