from sqlalchemy.orm import Session
from typing import Optional

from models.tickets import Ticket
from schemas.ticket import TicketBase

def create_ticket(db: Session, ticket_create: TicketBase):
    db_ticket = Ticket(
        install_num=ticket_create.install_num,
        ticket_open_time=ticket_create.ticket_open_time,
        ticket_close_time=None,
        status="todo",
    )
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

def get_ticket(db: Session, ticket_id: int) -> Optional[Ticket]:
    return db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()

def get_tickets(db: Session, skip: int = 0, limit: int = 100) -> list[Ticket]:
    return db.query(Ticket).offset(skip).limit(limit).all()

def update_ticket(db: Session, ticket_id: int, ticket_update: TicketUpdate) -> Optional[Ticket]:
    db_ticket = db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()
    if db_ticket:
        update_data = ticket_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_ticket, key, value)
        db.commit()
        db.refresh(db_ticket)
    return db_ticket

def delete_ticket(db: Session, ticket_id: int):
    db_ticket = db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()
    if db_ticket:
        db.delete(db_ticket)
        db.commit()
    return db_ticket
