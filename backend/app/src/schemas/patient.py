from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class PatientBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    first_name: str
    last_name: str
    cf: str
    patient_id: int
    address: Optional[str] = None
    contact: Optional[str] = None
    medical_notes: Optional[str] = None
    install_num: int
    creation_time: Optional[datetime] = None


class PatientCreate(BaseModel):
    """Schema for creating a patient, without IDs"""

    first_name: str
    last_name: str
    cf: str
    address: Optional[str] = None
    contact: Optional[str] = None
    medical_notes: Optional[str] = None


class PatientUpdate(BaseModel):
    """Schema for updating a patient"""

    address: Optional[str] = None
    contact: Optional[str] = None
    medical_notes: Optional[str] = None


class PatientStatus(BaseModel):
    first_name: str
    last_name: str
    age: int
    patient_id: int
    status: str
