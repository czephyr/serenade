import os
from typing import List

import keycloak
from fastapi import Depends, FastAPI, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from keycloak import KeycloakOpenID
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware


# class Patient(BaseModel):
#     PID: str
#     DataNick: str

class Patient(BaseModel):
    first_name: str
    last_name: str
    age: int
    gender: str
    ssn: str
    address: str
    phone_number: str


app = FastAPI(
    debug=True,
    title="serenade",
)

origins = [
    "*",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

patients_db = []


# Configure Keycloak client
keycloak_openid = KeycloakOpenID(
    server_url=os.getenv(
        "KEYCLOAK_URL",
    ),
    client_id=os.getenv("CLIENT_ID"),
    realm_name=os.getenv("REALM_NAME"),
    client_secret_key=os.getenv("CLIENT_SECRET"),
)


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login",scopes={"scope":'openid'})


@app.post("/login")
async def gen_token_to_login(input_data: OAuth2PasswordRequestForm = Depends()):
    token = keycloak_openid.token(
        username=input_data.username,
        password=input_data.password,
    )
    return {"access_token": token["access_token"], "token_type": "bearer"}


# Dependency to validate the access token
async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        print(f"token from get_current_user: {token}")
        credentials = keycloak_openid.introspect(token)
        print(f"output of introspect api {credentials}")
    except keycloak.exceptions.KeycloakAuthenticationError as inst:
        raise HTTPException(
            status_code=inst.response_code,
            detail=f'{{"error": "Invalid credentials", "message": "{inst.error_message}", "body": "{inst.response_body}"}}',
        )
    if not credentials["active"]:
        raise HTTPException(
            status_code=401, detail="Empty response for this credentials"
        )
    return credentials


# Route that requires authentication
@app.get("/hello", response_model=dict)
@app.post("/hello", response_model=dict)
async def read_hello(current_user: str = Depends(get_current_user)):
    return {"message": f"Hello, {current_user}!"}


# Sample in-memory patient database
patients_db = []

@app.get("/patients", response_model=List[Patient])
async def read_patients(current_user: dict = Depends(get_current_user)):
    if "dottore" in current_user["realm_access"]["roles"]:
        print(f"returning {patients_db}")
        return patients_db
    else:
        raise HTTPException(status_code=403, detail="Unauthorized")

@app.get("/patients/{patient_id}", response_model=Patient)
async def get_patient(
    patient_id: int,
    current_user: dict = Depends(get_current_user),
):
    if patient_id < 0 or patient_id >= len(patients_db):
        raise HTTPException(status_code=404, detail="Patient not found")
    return patients_db[patient_id]


@app.post("/patients", response_model=Patient)
async def create_patient(
    patient: Patient,
    current_user: dict = Depends(get_current_user),
):
    if "dottore" in current_user["realm_access"]["roles"]:
        print(f"adding patient {patient}")
        patients_db.append(patient)
        return patient
    else:
        raise HTTPException(status_code=403, detail="Unauthorized")


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


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
