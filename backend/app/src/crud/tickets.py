from datetime import datetime

import arlecchino
import humanize
from sqlalchemy.orm import Session

from ..core.const import SALT_HASH
from ..core.status import TICKET_CLOSED, TICKET_OPEN
from ..ormodels import Ticket, TicketMessage
from ..schemas.ticket import TicketBase, TicketCreate, TicketStatus


def create(db: Session, patient_id: int, ticket: TicketCreate) -> TicketBase:
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

    result = TicketBase.model_validate(result_orm)
    return result


def query_one(db: Session, ticket_id: int) -> Ticket:
    result_orm = db.query(Ticket).where(Ticket.ticket_id == ticket_id).one()
    return result_orm


def read_one(db: Session, ticket_id: int) -> TicketBase:
    result_orm = query_one(db, ticket_id)
    result = TicketBase.model_validate(result_orm)
    return result


def read_many(db: Session, patient_id: int | None = None) -> list[TicketStatus]:
    results_orm = db.query(Ticket)
    if patient_id is not None:
        results_orm = results_orm.where(Ticket.patient_id == patient_id)

    results_orm = results_orm.all()
    results = [
        TicketStatus(
            ticket_id=result_orm.ticket_id,
            date_delta=humanize.naturaltime((datetime.now() - result_orm.ts)),
            status=TICKET_CLOSED if result_orm.date_closed else TICKET_OPEN,
            last_sender=sorted(result_orm.messages, key=lambda x: x.ts)[-1].sender,
            hue=arlecchino.draw(result_orm.patient_id, SALT_HASH),
            category=result_orm.category,
        )
        for result_orm in results_orm
    ]
    return results


def update(db: Session, ticket_id: int) -> TicketBase:
    result_orm = query_one(db, ticket_id)
    result_orm.date_closed = datetime.now()

    db.commit()
    db.refresh(result_orm)

    result = TicketBase.model_validate(result_orm)
    return result
