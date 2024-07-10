from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from ..core import crypto
from ..core.excp import unfoundable
from ..core.status import (
    TICKET_CLOSED,
    TICKET_INSTALLATION,
    TICKET_OPEN,
    TICKET_UNINSTALLATION,
)
from ..ormodels import Ticket, TicketMessage
from ..schemas.ticket import TicketCreate, TicketRead, TicketStatus
from . import installation_details


@unfoundable("patient")
def create(db: Session, *, patient_id: str, ticket: TicketCreate) -> TicketRead:
    result_orm = Ticket(
        patient_id=patient_id,
        category=ticket.category,
    )
    db.add(result_orm)

    db.commit()
    db.refresh(result_orm)

    ticket_orm = TicketMessage(
        body=ticket.message.body,
        sender=ticket.message.sender,
    )
    result_orm.messages.append(ticket_orm)

    db.commit()
    db.refresh(result_orm)

    if result_orm.category == TICKET_UNINSTALLATION:
        installation_orm = installation_details.query_one(
            db, patient_id=result_orm.patient_id
        )
        installation_orm.date_end = datetime.now()
    db.commit()

    result = read_one(db, ticket_id=result_orm.ticket_id)
    return result


@unfoundable("ticket")
def query_one(db: Session, *, ticket_id: int) -> Ticket:
    result_orm = db.query(Ticket).where(Ticket.ticket_id == ticket_id).one()
    return result_orm


def read_one(db: Session, *, ticket_id: int) -> TicketRead:
    result_orm = query_one(db, ticket_id=ticket_id)
    result = TicketRead.model_validate(result_orm)
    result.hue = crypto.hue(result_orm.patient_id)
    return result


def read_many(db: Session, *, patient_id: str | None = None) -> list[TicketStatus]:
    results_orm = db.query(Ticket)
    if patient_id is not None:
        results_orm = results_orm.where(Ticket.patient_id == patient_id)

    results_orm = results_orm.all()
    results = [
        TicketStatus(
            ticket_id=result_orm.ticket_id,
            date_delta=(datetime.now() - result_orm.ts).total_seconds(),
            status=TICKET_CLOSED if result_orm.date_closed else TICKET_OPEN,
            last_sender=sorted(result_orm.messages, key=lambda x: x.ts)[-1].sender,
            hue=crypto.hue(result_orm.patient_id),
            category=result_orm.category,
        )
        for result_orm in results_orm
    ]
    return results


def update(db: Session, *, ticket_id: int) -> TicketRead:
    result_orm = query_one(db, ticket_id=ticket_id)
    right_now = datetime.now()
    result_orm.date_closed = right_now

    db.commit()

    if result_orm.category == TICKET_INSTALLATION:
        installation_orm = installation_details.query_one(
            db, patient_id=result_orm.patient_id
        )
        installation_orm.date_start = right_now
        installation_orm.date_end = right_now + timedelta(days=365)

    db.commit()
    db.refresh(result_orm)

    result = read_one(db, ticket_id=result_orm.ticket_id)
    return result
