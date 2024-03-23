from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from .ticket_message import TicketMessageBase


class TicketBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    status: str
    install_num: int
    ticket_open_time: datetime
    ticket_id: int
    ticket_close_time: Optional[datetime]


class TicketCreate(BaseModel):
    install_num: int


class TicketUpdate(BaseModel):
    status: str
    ticket_close_time: Optional[datetime]


class TicketDetails(TicketBase):
    messages_list: list[TicketMessageBase]
    # messages: list[TicketBase] # TODO will it be valdate from ORM to pydantic?
