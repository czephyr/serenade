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
    install_time: Optional[datetime] = None

# Schema for creating a patient (without ID, which is auto-generated)
class PatientCreate(PatientBase):
    first_name: str
    last_name: str
    cf: str
    address: Optional[str] = None
    contact: Optional[str] = None
    medical_notes: Optional[str] = None
    install_num: Optional[int] = None
    install_time: Optional[datetime] = None

# Schema for updating a patient
class PatientUpdate(PatientBase):
    pass

# Schema for response model including the ID and any other attributes not present in PatientBase
class Patient(PatientBase):
    patient_id: int
    
    class Config:
        orm_mode = True
