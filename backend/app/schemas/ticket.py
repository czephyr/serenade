from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TicketCreate(BaseModel):
    status: str
    install_num: int
    ticket_open_time: datetime

class TicketUpdate(TicketCreate):
    pass

class Ticket(TicketCreate):
    ticket_id: int
    ticket_close_time: datetime

    class Config:
        orm_mode = True
