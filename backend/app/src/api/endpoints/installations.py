from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import NoResultFound
from sqlalchemy.orm import Session

from ...api.deps import get_db, require_role
from ...core.excp import RESOURCE_NOT_FOUND
from ...core.roles import HOS, IIT, IMT, UNIMI
from ...crud import installation_details, tickets, patients
from ...schemas.installation import (
    InstallationDetailCreate,
    InstallationDetailRead,
    InstallationDetailUpdate,
    InstallationStatus,
)
from ...schemas.patient import PatientInfo
from ...schemas.ticket import TicketBase, TicketCreate, TicketStatus
from ...schemas.ticket_message import TicketMessageCreate

router = APIRouter()


@router.get("/", response_model=list[InstallationStatus])
def read_many(
    current_user: dict = Depends(require_role([IIT, IMT, UNIMI, HOS])),
    db: Session = Depends(get_db),
) -> list[InstallationStatus]:
    result = installation_details.read_many(db)
    return result


@router.get("/{patient_id}", response_model=InstallationDetailRead)
def read_one(
    patient_id: int,
    current_user: dict = Depends(require_role([IIT, IMT, UNIMI, HOS])),
    db: Session = Depends(get_db),
) -> InstallationDetailRead:
    try:
        result = installation_details.read_one(db, patient_id=patient_id)
    except NoResultFound as excp:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail=RESOURCE_NOT_FOUND.format(_id=patient_id, resource="patients"),
        ) from excp
    return result


@router.get("/{patient_id}/info", response_model=PatientInfo)
def read_info(
    patient_id: int,
    current_user: dict = Depends(require_role([IIT])),
    db: Session = Depends(get_db),
) -> PatientInfo:
    try:
        result = patients.info(db, patient_id=patient_id)
    except NoResultFound as excp:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail=RESOURCE_NOT_FOUND.format(_id=patient_id, resource="patients"),
        ) from excp
    else:
        return result


@router.post("/", response_model=InstallationDetailRead)
def create(
    patient_id: int,
    installation: InstallationDetailCreate,
    current_user: dict = Depends(require_role([HOS, IIT, IMT])),
    db: Session = Depends(get_db),
) -> InstallationDetailRead:
    try:
        result = installation_details.create(
            db, patient_id=patient_id, installation=installation
        )
    except NoResultFound as excp:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail=RESOURCE_NOT_FOUND.format(_id=patient_id, resource="patients"),
        ) from excp
    else:
        return result


@router.put("/{patient_id}/", response_model=InstallationDetailRead)
def update(
    patient_id: int,
    installation: InstallationDetailUpdate,
    current_user: dict = Depends(require_role([HOS, IIT, IMT])),
    db: Session = Depends(get_db),
) -> InstallationDetailRead:
    try:
        result = installation_details.update(
            db, patient_id=patient_id, installation=installation
        )
    except NoResultFound as excp:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail=RESOURCE_NOT_FOUND.format(_id=patient_id, resource="patients"),
        ) from excp
    else:
        return result


@router.post("/{patient_id}/close", response_model=InstallationDetailRead)
def close(
    patient_id: int,
    current_user: dict = Depends(require_role([IIT, IMT])),
    db: Session = Depends(get_db),
) -> InstallationDetailRead:
    try:
        result = installation_details.close(db, patient_id=patient_id)
    except NoResultFound as excp:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail=RESOURCE_NOT_FOUND.format(_id=patient_id, resource="patients"),
        ) from excp
    else:
        return result


@router.post("/{patient_id}/open", response_model=InstallationDetailRead)
def open(
    patient_id: int,
    current_user: dict = Depends(require_role([IIT, IMT])),
    db: Session = Depends(get_db),
) -> InstallationDetailRead:
    try:
        result = installation_details.open(db, patient_id=patient_id)
    except NoResultFound as excp:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail=RESOURCE_NOT_FOUND.format(_id=patient_id, resource="patients"),
        ) from excp
    else:
        return result


@router.get("/{patient_id}/tickets", response_model=list[TicketStatus])
def read_tickets(
    patient_id: int,
    current_user: dict = Depends(require_role([IIT, IMT])),
    db: Session = Depends(get_db),
) -> list[TicketStatus]:
    result = tickets.read_many(db, patient_id=patient_id)
    return result


@router.post("/{patient_id}/tickets", response_model=TicketBase)
def create_ticket(
    patient_id: int,
    message: TicketMessageCreate,
    current_user: dict = Depends(require_role([IIT, IMT])),
    db: Session = Depends(get_db),
) -> TicketBase:
    result = tickets.create(
        db, ticket=TicketCreate(patient_id=patient_id, message=message)
    )
    return result
