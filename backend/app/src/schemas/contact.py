from pydantic import BaseModel, ConfigDict

from .patient_base import PatientBase


class ContactBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    patient_id: int
    alias: str
    phone_no: str | None
    email: str | None

    patient: PatientBase


class ContactEntry(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    alias: str
    phone_no: str | None
    email: str | None


class ContactCreate(BaseModel):
    alias: str
    phone_no: str | None = None
    email: str | None = None


class ContactUpdate(BaseModel):
    alias: str | None = None
    phone_no: str | None = None
    email: str | None = None
