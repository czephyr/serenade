import arrow
from sqlalchemy.orm import Session

from ..core.status import CLOSED, NOT_READY, OPEN, RUNNING
from ..ormodels import Ticket
from ..schemas.ticket import TicketBase, TicketCreate


def create(db: Session, ticket: TicketCreate) -> TicketBase:
    now_time = arrow.utcnow().datetime
    result_orm = Ticket(
        install_num=ticket.install_num,
        ticket_open_time=now_time,
        status=OPEN,
    )
    db.add(result_orm)
    db.commit()
    db.refresh(result_orm)

    result = TicketBase.model_validate(result_orm)
    return result


def query_one(db: Session, ticket_id: int) -> Ticket:
    result_orm = db.query(Ticket).filter(Ticket.ticket_id == ticket_id).one()
    Ticket.install_num
    return result_orm


def read_one(db: Session, ticket_id: int) -> TicketBase:
    result_orm = query_one(db, ticket_id)
    result = TicketBase.model_validate(result_orm)
    return result


def read_many(
    db: Session, install_num: int | None = None, *, skip: int = 0, limit: int = 100
) -> list[TicketBase]:
    results_orm = db.query(Ticket)
    if install_num is not None:
        results_orm = results_orm.where(Ticket.install_num == install_num)
    results_orm = results_orm.offset(skip).limit(limit).all()
    results = [TicketBase.model_validate(r) for r in results_orm]
    return results


def update(db: Session, ticket_id: int, ticket: TicketBase) -> TicketBase:
    agruments = ticket.model_dump(exclude_unset=True)
    result_orm = query_one(db, ticket_id)
    for k, v in agruments.items():
        setattr(result_orm, k, v)
    db.commit()
    db.refresh(result_orm)

    result = TicketBase.model_validate(result_orm)
    return result


def delete(db: Session, ticket_id: int) -> TicketBase:
    result_orm = query_one(db, ticket_id)
    db.delete(result_orm)
    db.commit()
    result = TicketBase.model_validate(result_orm)
    return result


def status(db: Session, install_num: int) -> str:
    _tickets = read_many(db, install_num)
    for ticket in _tickets:
        if ticket.status != CLOSED:
            return NOT_READY
    else:
        return RUNNING
