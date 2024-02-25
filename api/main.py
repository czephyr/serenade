import os
from typing import List, Optional
from datetime import datetime
import keycloak
from fastapi import Depends, FastAPI, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from keycloak import KeycloakOpenID
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Body


# class Patient(BaseModel):
#     PID: str
#     DataNick: str

class Patient(BaseModel):
    id: Optional[int] = None
    first_name: str
    last_name: str
    age: int
    gender: str
    ssn: str
    address: str
    phone_number: str

class Ticket(BaseModel):
    id: Optional[int] = None
    datetime: datetime
    notes: List[str]
    status: str

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
tickets_db = []

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
        # Assign an ID based on the current length of the patients_db
        patient_id = len(patients_db)
        patient.id = patient_id

        # Create a corresponding ticket
        ticket = Ticket(
            id=patient_id,
            datetime=datetime.now(),
            notes=[],
            status="unready",  # Assuming default status is 'unready'
        )
        tickets_db.append(ticket)

        # Add the patient with the assigned ID
        patients_db.append(patient)
        print(f"Added patient {patient} with ticket {ticket}")
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

###################

@app.get("/tickets", response_model=List[Ticket])
async def read_tickets(current_user: dict = Depends(get_current_user)):
    # Adjust the role check as per your requirement, for example 'iit' or 'iim'
    if "iit" in current_user["realm_access"]["roles"] or "imt" in current_user["realm_access"]["roles"]:
        print(f"Returning {tickets_db}")
        return tickets_db
    else:
        raise HTTPException(status_code=403, detail="Unauthorized")


@app.get("/tickets/{ticket_id}", response_model=Ticket)
async def get_ticket(
    ticket_id: int,
    current_user: dict = Depends(get_current_user),
):
    # Assuming ticket_id is a valid index in the tickets_db list for simplicity
    # In a real application, you would query a database
    ticket = next((ticket for ticket in tickets_db if ticket.id == ticket_id), None)
    if ticket is None:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    # Here you might want to check if the current user is authorized to view the ticket
    # For simplicity, this example assumes all authenticated users can view any ticket
    return ticket

@app.post("/tickets/{ticket_id}/add_message")
async def add_message_to_ticket(ticket_id: int, message: str = Body(...), current_user: dict = Depends(get_current_user)):
    if ticket_id < 0 or ticket_id >= len(tickets_db):
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    # Append the message to the ticket's notes
    tickets_db[ticket_id].notes.append(message)
    return {"message": "Message added successfully", "ticket": tickets_db[ticket_id]}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
