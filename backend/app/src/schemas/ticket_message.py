from datetime import datetime

from pydantic import BaseModel, ConfigDict


class TicketMessageBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    ts: datetime
    sender: str
    body: str
    # ticket_id: int


class TicketMessageCreate(BaseModel):
    body: str
    sender: str
