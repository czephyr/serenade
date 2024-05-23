from pydantic import BaseModel, ConfigDict

from .patient_base import PatientBase


class ContactBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    patient_id: str
    alias: str | None
    phone_no: str | None
    email: str | None

    patient: PatientBase


class ContactEntry(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    alias: str | None
    phone_no: str | None
    email: str | None


class ContactCreate(BaseModel):
    alias: str | None = None
    phone_no: str | None = None
    email: str | None = None


class ContactUpdate(ContactCreate):
    pass
