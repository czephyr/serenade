from pydantic import BaseModel, ConfigDict

from .patient_base import PatientBase


class ContactBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    patient_id: int
    alias: str
    phone_no: str

    patient: PatientBase


class ContactEntry(BaseModel):
    alias: str
    phone_no: str


class ContactCreate(BaseModel):
    patient_id: int
    alias: str
    phone_no: str
