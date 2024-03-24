from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from .ticket import TicketBase


class InstallationBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    creation_time: datetime
    install_num: int


class InstallationIMT(InstallationBase):
    patient_id: int


class InstallationIIT(InstallationBase):
    first_name: str
    last_name: str
    address: Optional[str] = None
    contact: Optional[str] = None


class InstallationStatus(InstallationBase):
    status: str
    tickets_list: list[TicketBase]
    # tickets: list[TicketBase] # TODO will it be validate from ORM to pydantic?
