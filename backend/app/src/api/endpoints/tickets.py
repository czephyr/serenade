from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import NoResultFound
from sqlalchemy.orm import Session

from ...core.roles import IIT, IMT
from ...crud import ticket_messages, tickets
from ...schemas.ticket import TicketBase, TicketCreate, TicketStatus
from ...schemas.ticket_message import TicketMessageBase, TicketMessageCreate
from ..deps import get_db, require_role

router = APIRouter()


@router.get("/", response_model=list[TicketStatus])
def read_many(
    current_user: dict = Depends(require_role([IIT, IMT])),
    db: Session = Depends(get_db),
) -> list[TicketStatus]:
    result = tickets.read_many(db=db)
    return result


@router.post("/", response_model=TicketBase)
def create(
    ticket: TicketCreate,
    current_user: dict = Depends(require_role([IIT, IMT])),
    db: Session = Depends(get_db),
) -> TicketBase:
    result = tickets.create(db, ticket=ticket)
    return result


@router.get("/{ticket_id}", response_model=TicketBase)
def read_one(
    ticket_id: int,
    current_user: dict = Depends(require_role([IIT, IMT])),
    db: Session = Depends(get_db),
) -> TicketBase:
    try:
        result = tickets.read_one(db, ticket_id=ticket_id)
    except NoResultFound as excp:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail=f"Ticket {ticket_id} not found",
        ) from excp
    else:
        return result


@router.get("/{ticket_id}/messages", response_model=list[TicketMessageBase])
def read_messages(
    ticket_id: int,
    current_user: dict = Depends(require_role([IIT, IMT])),
    db: Session = Depends(get_db),
) -> list[TicketMessageBase]:
    result = ticket_messages.read_many(db, ticket_id=ticket_id)
    return result


@router.post("/{ticket_id}/messages", response_model=TicketMessageBase)
def create_message(
    ticket_id: int,
    ticket_message: TicketMessageCreate,
    current_user: dict = Depends(require_role([IIT, IMT])),
    db: Session = Depends(get_db),
) -> TicketMessageBase:
    result = ticket_messages.create(db, ticket_id=ticket_id, message=ticket_message)
    return result


@router.post("/{ticket_id}/close", response_model=TicketBase)
def close(
    ticket_id: int,
    current_user: dict = Depends(require_role([IIT, IMT])),
    db: Session = Depends(get_db),
) -> TicketBase:
    try:
        result = tickets.update(db, ticket_id=ticket_id)
    except NoResultFound as excp:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail=f"Ticket {ticket_id} not found",
        ) from excp
    else:
        return result