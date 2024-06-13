from datetime import datetime

from pydantic import BaseModel, ConfigDict


class PatientBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    ts: datetime | None
    patient_id: str

    date_join: datetime | None
    date_exit: datetime | None


class PatientDetailBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    patient_id: str

    first_name: str
    last_name: str
    home_address: str | None

    patient: PatientBase


class PatientScreeningBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    patient_id: str
    neuro_diag: str
    age_class: str

    patient: PatientBase


class PatientNoteBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    patient_id: str

    codice_fiscale: str
    medical_notes: str

    patient: PatientBase
