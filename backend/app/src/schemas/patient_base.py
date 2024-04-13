from datetime import datetime

from pydantic import BaseModel, ConfigDict


class PatientBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    ts: datetime | None
    patient_id: int

    date_start: datetime | None
    date_end: datetime | None


class PatientDetailBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    patient_id: int

    first_name: str
    last_name: str
    home_address: str | None

    patient: PatientBase


class PatientScreeningBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    ts: datetime
    patient_id: int
    neuro_diag: str
    age_class: str

    patient: PatientBase


class PatientNoteBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    patient_id: int

    codice_fiscale: str
    medical_notes: str

    patient: PatientBase
