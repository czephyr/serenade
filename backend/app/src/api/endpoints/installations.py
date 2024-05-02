from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ...api.deps import get_db, require_role
from ...core.crypto import maskable
from ...core.excp import BadValues
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

router = APIRouter()


@router.get("", response_model=list[InstallationStatus])
def read_many(
    role: str = Depends(require_role([IIT, IMT, UNIMI, HOS])),
    db: Session = Depends(get_db),
) -> list[InstallationStatus]:
    result = maskable(installation_details.read_many, role)(db)
    return result


@router.get("/{patient_id}", response_model=InstallationDetailRead)
def read_one(
    patient_id: str,
    role: str = Depends(require_role([IIT, IMT, UNIMI, HOS])),
    db: Session = Depends(get_db),
) -> InstallationDetailRead:
    result = maskable(installation_details.read_one, role)(db, patient_id=patient_id)
    return result


@router.get("/{patient_id}/info", response_model=PatientInfo)
def read_info(
    patient_id: str,
    role: str = Depends(require_role([IIT])),
    db: Session = Depends(get_db),
) -> PatientInfo:
    result = maskable(patients.info, role)(db, patient_id=patient_id)
    return result


@router.post("/{patient_id}", response_model=InstallationDetailRead)
def create(
    patient_id: str,
    installation: InstallationDetailCreate,
    role: str = Depends(require_role([HOS, IIT, IMT])),
    db: Session = Depends(get_db),
) -> InstallationDetailRead:
    result = maskable(installation_details.create, role)(
        db,
        patient_id=patient_id,
        installation=installation,
    )
    return result


@router.put("/{patient_id}", response_model=InstallationDetailRead)
def update(
    patient_id: str,
    installation: InstallationDetailUpdate,
    role: str = Depends(require_role([HOS, IIT, IMT])),
    db: Session = Depends(get_db),
) -> InstallationDetailRead:
    result = maskable(installation_details.update, role)(
        db,
        patient_id=patient_id,
        installation=installation,
    )
    return result


@router.get("/{patient_id}/tickets", response_model=list[TicketStatus])
def read_tickets(
    patient_id: str,
    role: str = Depends(require_role([IIT, IMT])),
    db: Session = Depends(get_db),
) -> list[TicketStatus]:
    result = maskable(tickets.read_many, role)(db, patient_id=patient_id)
    return result


@router.post("/{patient_id}/tickets", response_model=TicketBase)
def create_ticket(
    patient_id: str,
    message: TicketCreate,
    role: str = Depends(require_role([IIT, IMT])),
    db: Session = Depends(get_db),
) -> TicketBase:
    result = maskable(tickets.create, role)(
        db,
        patient_id=patient_id,
        ticket=message,
    )
    return result
