from pydantic import BaseModel
from datetime import datetime


class VisitCreate(BaseModel):
    date: datetime
    comment: str
    patient_id: int

class Visit(VisitCreate):
    visit_num: int

    class Config:
        orm_mode = True
