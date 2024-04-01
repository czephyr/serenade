from pydantic import BaseModel
from datetime import datetime

class TicketMessageBase(BaseModel):
    message_time: datetime
    sender: str

class TicketMessageCreate(TicketMessageBase):
    ticket_id: int

class TicketMessageUpdate(TicketMessageBase):
    pass

class TicketMessage(TicketMessageBase):
    message_id: int
    ticket_id: int

    class Config:
        orm_mode = True
