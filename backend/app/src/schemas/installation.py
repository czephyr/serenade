from datetime import datetime

from pydantic import BaseModel, ConfigDict


class InstallationDetailBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    ts: datetime
    patient_id: int

    apartment_type: str | None
    internet_type: str | None
    flatmates: str | None
    pets: str | None
    visitors: str | None
    smartphone_model: str | None
    house_map: str | None
    appliances: str | None
    issues_notes: str | None
    habits_notes: str | None
    other_notes: str | None


class InstallationDetailCreate(BaseModel):
    apartment_type: str | None = None
    internet_type: str | None = None
    flatmates: str | None = None
    pets: str | None = None
    visitors: str | None = None
    smartphone_model: str | None = None
    house_map: str | None = None
    appliances: str | None = None
    issues_notes: str | None = None
    habits_notes: str | None = None
    other_notes: str | None = None


class InstallationStatus(BaseModel):
    patient_id: int
    status: str
    date_delta: str
