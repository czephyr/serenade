from datetime import datetime

from pydantic import BaseModel, ConfigDict

from .ticket_message import TicketMessageCreate


class TicketBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    ts: datetime
    ticket_id: int

    patient_id: int
    date_closed: datetime | None


class TicketCreate(BaseModel):
    patient_id: int
    message: TicketMessageCreate


class TicketUpdate(BaseModel):
    date_closed: datetime


class TicketStatus(BaseModel):
    ticket_id: int
    date_delta: str
    status: str
    last_sender: str | None
    hue: str | None
