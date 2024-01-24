from typing import List

from fastapi import Depends, FastAPI, HTTPException
from fastapi.security import OAuth2AuthorizationCodeBearer
from keycloak import KeycloakOpenID
from pydantic import BaseModel


class Patient(BaseModel):
    PID: str
    DataNick: str


app = FastAPI(
    debug=True,
    title="serenade",
)

patients_db = []

# Keycloak configuration
keycloak_url = "http://localhost:8080"
client_id = "cli-dottori"
client_secret = "dFVs0dyOq8okog72gsn5z7h8qCzp6PW9"
realm_name = "serenade"

# Configure Keycloak client
keycloak_openid = KeycloakOpenID(
    server_url=keycloak_url,
    client_id=client_id,
    realm_name=realm_name,
    client_secret_key=client_secret,
)

# OAuth2 configuration
oauth2_scheme = OAuth2AuthorizationCodeBearer(
    tokenUrl="token",
    # flows=OAuthFlowsModel(
    #     authorizationCode=OAuthFlowAuthorizationCode(
    #         tokenUrl="token",
    #         refreshUrl="token",
    #     )
    # ),
)


# Dependency to validate the access token
async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials = keycloak_openid.userinfo(token)
    if not credentials:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return credentials


# Route that requires authentication
@app.get("/hello", response_model=dict)
@app.post("/hello", response_model=dict)
async def read_hello(current_user: str = Depends(get_current_user)):
    return {"message": f"Hello, {current_user}!"}


# Sample in-memory patient database
patients_db = []


@app.get("/patients", response_model=List[Patient])
async def read_patients():
    return patients_db


@app.post("/patients", response_model=Patient)
async def create_patient(
    patient: Patient,
    current_user: dict = Depends(get_current_user),
):
    patients_db.append(patient)
    return patient


@app.put("/patients/{patient_id}", response_model=Patient)
async def update_patient(
    patient_id: int,
    updated_patient: Patient,
    current_user: dict = Depends(get_current_user),
):
    if patient_id < 0 or patient_id >= len(patients_db):
        raise HTTPException(status_code=404, detail="Patient not found")
    patients_db[patient_id] = updated_patient
    return updated_patient


@app.delete("/patients/{patient_id}", response_model=Patient)
async def delete_patient(
    patient_id: int,
    current_user: dict = Depends(get_current_user),
):
    if patient_id < 0 or patient_id >= len(patients_db):
        raise HTTPException(status_code=404, detail="Patient not found")
    deleted_patient = patients_db.pop(patient_id)
    return deleted_patient
