from datetime import date

from pydantic import BaseModel

from .contact import ContactCreate, ContactEntry


class PatientCreate(BaseModel):
    first_name: str
    last_name: str
    codice_fiscale: str

    neuro_diag: str | None
    age_class: str | None

    home_address: str | None
    contacts: list[ContactCreate]

    medical_notes: str | None = None


class PatientUpdate(BaseModel):
    neuro_diag: str | None
    age_class: str | None

    home_address: str | None
    contacts: list[ContactCreate]

    medical_notes: str | None = None


class PatientStatus(BaseModel):
    first_name: str
    last_name: str
    age: int
    patient_id: int
    status: str


class PatientRead(BaseModel):
    patient_id: int
    first_name: str
    last_name: str
    codice_fiscale: str
    gender: str
    date_of_birth: date
    place_of_birth: str

    neuro_diag: str | None
    age_class: str | None

    home_address: str | None
    contacts: list[ContactEntry]

    medical_notes: str | None = None


class PatientScreeningCreate(BaseModel):
    neuro_diag: str | None
    age_class: str | None
