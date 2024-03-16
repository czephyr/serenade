from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from .ticket import Ticket

class BaseInstallation(BaseModel):
    creation_time: datetime
    install_num: int
    medical_notes: Optional[str] = None
    installation_notes: str
    tickets_list: List[Ticket]

class IMTInstallation(BaseInstallation):
    patient_id: int

class IITInstallation(BaseInstallation):
    first_name: str
    last_name: str
    age: int
    address: Optional[str] = None
    contact: Optional[str] = None

class ListInstallation(BaseModel):
    creation_time: datetime
    install_num: int
    status: str

class Installation(IMTInstallation,IITInstallation):
    class Config:
        orm_mode = True
