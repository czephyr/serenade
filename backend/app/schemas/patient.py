from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

# Base schema for common attributes
class PatientBase(BaseModel):
    first_name: str
    last_name: str
    cf: str
    address: Optional[str] = None
    contact: Optional[str] = None
    medical_notes: Optional[str] = None
    install_num: Optional[int] = None
    creation_time: Optional[datetime] = None

# Schema for creating a patient (without ID, which is auto-generated)
class PatientCreate(BaseModel):
    first_name: str
    last_name: str
    cf: str
    address: Optional[str] = None
    contact: Optional[str] = None
    medical_notes: Optional[str] = None

# Schema for creating a patient (without ID, which is auto-generated)
class ListPatient(BaseModel):
    first_name: str
    last_name: str
    patient_id: int
    status: str


# Schema for response model including the ID and any other attributes not present in PatientBase
class Patient(PatientBase):
    patient_id: int
    
    class Config:
        orm_mode = True
