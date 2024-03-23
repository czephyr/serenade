from datetime import datetime

from pydantic import BaseModel, ConfigDict


class TicketMessageBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    message_id: int
    ticket_id: int
    message_time: datetime
    sender: str


class TicketMessageCreate(BaseModel):
    message_id: int
    ticket_id: int
    sender: str
