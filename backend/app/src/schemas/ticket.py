from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from .ticket_message import TicketMessage


class TicketBase(BaseModel):
    status: str
    install_num: int
    ticket_open_time: datetime
    ticket_id: int
    ticket_close_time: Optional[datetime]


class Ticket(TicketBase):
    ticketmessage_list: List[TicketMessage]

    class Config:
        orm_mode = True
