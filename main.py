from fastapi import FastAPI, HTTPException, Depends, Request
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from jose import jwt
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from typing import List, Optional
import hashlib
import os

app = FastAPI()

DATABASE_URL = "postgresql://user:password@localhost/mydatabase"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class UserData(BaseModel):
    first_name: str
    last_name: str
    age: int
    gender: str
    ssn: str
    address: str
    phone_number: str


PEPPER = "your_pepper_here"

HOSPITAL_TOKEN = "fake_hospital_token"

IMT_TOKEN = "fake_imt_token"

IIT_TOKEN = "fake_iit_token"

AES_KEY = os.urandom(32)  # Replace with your hardcoded key


Base = declarative_base()

class Patient(Base):
    __tablename__ = 'patients'
    id = Column(Integer, primary_key=True)
    first_name = Column(String(255))
    last_name = Column(String(255))
    age = Column(Integer)
    gender = Column(String(50))
    ssn = Column(String(255))
    address = Column(String)
    phone_number = Column(String(255))

class PatientPID(Base):
    __tablename__ = 'patient_PID'
    patient_id = Column(Integer, ForeignKey('patients.id'), primary_key=True)
    PID_sha_identifier = Column(String(255))

class PatientINSTNUM(Base):
    __tablename__ = 'patient_INSTNUM'
    patient_id = Column(Integer, ForeignKey('patients.id'), primary_key=True)
    INSTNUM_aes_indentifier = Column(String(255))

class PatientStatus(Base):
    __tablename__ = 'patient_status'
    patient_id = Column(Integer, ForeignKey('patients.id'), primary_key=True)
    imt_installation = Column(Boolean, default=False)
    iim_validation = Column(Boolean, default=False)


# Create tables
Base.metadata.create_all(bind=engine)

def verify_token(request: Request):
    token = request.query_params.get("token")
    if token != HOSPITAL_TOKEN:
        raise HTTPException(status_code=403, detail="Invalid token")
    
def verify_get_install_nums_token(request: Request):
    token = request.query_params.get("token")
    if token != IMT_TOKEN:
        raise HTTPException(status_code=403, detail="Invalid token for get_install_nums")

def verify_iit_token(request: Request):
    token = request.query_params.get("token")
    if token != IIT_TOKEN:
        raise HTTPException(status_code=403, detail="Invalid token for get_install_nums")


# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def encrypt_patient_id(patient_id: int) -> str:
    cipher = Cipher(algorithms.AES(AES_KEY), modes.ECB(), backend=default_backend())
    encryptor = cipher.encryptor()
    # Convert patient_id to 16 bytes (128 bits)
    padded_patient_id = str(patient_id).rjust(16)
    encrypted = encryptor.update(padded_patient_id.encode()) + encryptor.finalize()
    return encrypted.hex()[:6] # QUESTO TRONCAMENTO DELL'HEX E' PER AUMENTARE LA LEGGIBILITA' DEL CODICE DI INSTALLAZIONE, 
                               # MA AUMENTA LA POSSIBILITA' DI COLLISIONE
                               # IL TRADE OFF DIPENDE DAL NUMERO DI PAZIENTI, SE SONO TANTISSIMI NON VA BENE

# Endpoint to add a patient
@app.post("/add_patient/")
def add_patient(
    user_data: UserData,
    token: Optional[str] = Depends(verify_token),
    db: Session = Depends(get_db),
):
    try:
        # Add patient to the database
        new_patient = Patient(**user_data.dict())
        db.add(new_patient)
        db.commit()
        db.refresh(new_patient)

        # Salt and pepper the SSN
        salt = os.urandom(32)
        salted_peppered_ssn = salt + user_data.ssn.encode() + PEPPER.encode()

        # Hash the salted and peppered SSN
        hash_obj = hashlib.sha256(salted_peppered_ssn)
        ssn_hash = hash_obj.hexdigest()

        # Add SSN hash to the database
        pid_identifier = PatientPID(
            patient_id=new_patient.id, PID_sha_identifier=ssn_hash
        )
        db.add(pid_identifier)

        # Encrypt patient_id and add to the database
        instnum_identifier = PatientINSTNUM(
            patient_id=new_patient.id, INSTNUM_aes_indentifier=encrypt_patient_id(new_patient.id)
        )
        db.add(instnum_identifier)

        db.commit()

        return {"patient_id": new_patient.id, "sha_hash": ssn_hash, "aes_encrypted_id": instnum_identifier.INSTNUM_aes_indentifier}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# Endpoint to get a list of patients with their SHA and AES identifiers
@app.get("/patients/", response_model=List[UserData])
def get_patients(token: str = Depends(verify_token), db: Session = Depends(get_db)):
    # Joining patients, patient_PID, and patient_INSTNUM tables
    results = db.query(
        Patient,
        PatientPID.PID_sha_identifier,
        PatientINSTNUM.INSTNUM_aes_indentifier
    ).join(PatientPID, Patient.id == PatientPID.patient_id
    ).join(PatientINSTNUM, Patient.id == PatientINSTNUM.patient_id
    ).all()
    
    # Constructing the response
    patient_data = [{
        "first_name": patient.first_name,
        "last_name": patient.last_name,
        "age": patient.age,
        "gender": patient.gender,
        "ssn": patient.ssn,
        "address": patient.address,
        "phone_number": patient.phone_number,
        "PID_sha_identifier": PID_sha_identifier,
        "INSTNUM_aes_indentifier": INSTNUM_aes_indentifier
    } for patient, PID_sha_identifier, INSTNUM_aes_indentifier in results]

    return patient_data



# New endpoint to get installation numbers, status, and SHA identifier
@app.get("/get_install_nums/")
def get_install_nums(token: str = Depends(verify_get_install_nums_token), db: Session = Depends(get_db)):
    # Joining patient_INSTNUM, patient_PID, and patient_status tables
    results = db.query(
        PatientINSTNUM.INSTNUM_aes_indentifier,
        PatientPID.PID_sha_identifier,
        PatientStatus.imt_installation,
        PatientStatus.iim_validation
    ).join(PatientPID, PatientINSTNUM.patient_id == PatientPID.patient_id
    ).join(PatientStatus, PatientINSTNUM.patient_id == PatientStatus.patient_id
    ).all()
    
    # Constructing the response
    install_nums_data = [{
        "INSTNUM_aes_indentifier": INSTNUM_aes_indentifier,
        "PID_sha_identifier": PID_sha_identifier,
        "imt_installation": imt_installation,
        "iim_validation": iim_validation
    } for INSTNUM_aes_indentifier, PID_sha_identifier, imt_installation, iim_validation in results]

    return install_nums_data  

# New endpoint to get patient details with AES identifier
@app.get("/patient_details/")
def get_patient_details(token: str = Depends(verify_iit_token), db: Session = Depends(get_db)):
    # Joining patients and patient_INSTNUM tables
    results = db.query(
        Patient,
        PatientINSTNUM.INSTNUM_aes_indentifier
    ).join(PatientINSTNUM, Patient.id == PatientINSTNUM.patient_id
    ).all()
    
    # Constructing the response with patient details (excluding ID) and AES identifier
    patient_details = [{
        "INSTNUM_aes_indentifier": INSTNUM_aes_indentifier,
        "first_name": patient.first_name,
        "last_name": patient.last_name,
        "age": patient.age,
        "gender": patient.gender,
        "ssn": patient.ssn,
        "address": patient.address,
        "phone_number": patient.phone_number
    } for patient, INSTNUM_aes_indentifier in results]
    
    return patient_details


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
