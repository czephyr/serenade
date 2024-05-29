from datetime import datetime

from pydantic import BaseModel, ConfigDict


class PatientScreeningRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    ts: datetime | None = None
    neuro_diag: str | None = None
    age_class: str | None = None


class PatientScreeningCreate(BaseModel):
    neuro_diag: str | None = None
