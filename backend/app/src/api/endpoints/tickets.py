from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import NoResultFound
from sqlalchemy.orm import Session

from ...crud import tickets, ticket_messages
from ...schemas.ticket import TicketBase, TicketStatus, TicketCreate
from ...schemas.ticket_message import TicketMessageBase, TicketMessageCreate
from ..deps import get_db, require_role

router = APIRouter()


@router.get("/", response_model=list[TicketStatus])
async def read_many(
    # current_user: dict = Depends(require_role(["dottore"])),
    db: Session = Depends(get_db),
) -> list[TicketStatus]:
    result = tickets.read_many(db=db)
    return result


@router.post("/", response_model=TicketBase)
async def create(
    ticket: TicketCreate,
    # current_user: dict = Depends(require_role(["dottore"])),
    db: Session = Depends(get_db),
) -> TicketBase:
    result = tickets.create(db=db, ticket=ticket)
    return result


@router.get("/{ticket_id}", response_model=TicketBase)
async def read_one(
    ticket_id: int,
    # current_user: dict = Depends(require_role(["dottore"])),
    db: Session = Depends(get_db),
) -> TicketBase:
    try:
        result = tickets.read_one(db, ticket_id=ticket_id)
    except NoResultFound as excp:
        raise HTTPException(
            status_code=404,
            detail=f"Ticket {ticket_id} not found",
        ) from excp
    else:
        return result


@router.get("/{ticket_id}/messages", response_model=list[TicketMessageBase])
async def read_messages(
    ticket_id: int,
    # current_user: dict = Depends(require_role(["dottore"])),
    db: Session = Depends(get_db),
) -> list[TicketMessageBase]:
    result = ticket_messages.read_many(db=db, ticket_id=ticket_id)
    return result


@router.post("/{ticket_id}/messages", response_model=TicketMessageBase)
async def create_message(
    ticket_id: int,
    ticket_message: TicketMessageCreate,
    # current_user: dict = Depends(require_role(["dottore"])),
    db: Session = Depends(get_db),
) -> TicketMessageBase:
    result = ticket_messages.create(
        db=db,
        ticket_id=ticket_id,
        message=ticket_message,
    )
    return result


@router.post("/{ticket_id}/close", response_model=TicketBase)
async def close(
    ticket_id: int,
    # current_user: dict = Depends(require_role(["dottore"])),
    db: Session = Depends(get_db),
) -> TicketBase:
    try:
        result = tickets.update(db=db, ticket_id=ticket_id)
    except NoResultFound as excp:
        raise HTTPException(
            status_code=404,
            detail=f"Ticket {ticket_id} not found",
        ) from excp
    else:
        return result
