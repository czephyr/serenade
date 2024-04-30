from datetime import date, datetime

from pydantic import BaseModel

from .contact import ContactCreate, ContactEntry


class PatientCreate(BaseModel):
    first_name: str
    last_name: str
    codice_fiscale: str

    neuro_diag: str | None = None
    age_class: str | None = None

    home_address: str | None = None
    contacts: list[ContactCreate] | None = None

    medical_notes: str | None = None

    date_join: datetime | None = None
    date_exit: datetime | None = None


class PatientUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None

    neuro_diag: str | None = None
    age_class: str | None = None

    home_address: str | None = None

    medical_notes: str | None = None

    date_join: datetime | None = None
    date_exit: datetime | None = None


class PatientStatus(BaseModel):
    first_name: str
    last_name: str
    neuro_diag: str | None
    patient_id: int
    status: str
    hue: str | None

    date_join: datetime | None
    date_exit: datetime | None


class PatientRead(BaseModel):
    patient_id: int
    first_name: str
    last_name: str
    codice_fiscale: str
    gender: str
    date_of_birth: date
    place_of_birth: str
    gender: str
    age: int

    date_join: datetime | None = None
    date_exit: datetime | None = None

    neuro_diag: str | None
    age_class: str | None

    home_address: str | None
    contacts: list[ContactEntry]

    medical_notes: str | None = None


class PatientScreeningCreate(BaseModel):
    neuro_diag: str | None = None
    age_class: str | None = None


class PatientInfo(BaseModel):
    first_name: str
    last_name: str
    home_address: str | None

    contacts: list[ContactEntry]
