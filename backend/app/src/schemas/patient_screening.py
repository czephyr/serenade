from datetime import datetime

from pydantic import BaseModel, ConfigDict


class PatientScreeningRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    neuro_diag: str | None = None
    age_class: str | None = None
