from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ...core.excp import BadValues, DuplicateCF
from ...core.roles import HOS, IMT, IIT
from ...crud import patient_contacts, patients, patient_status
from ...schemas.contact import ContactCreate, ContactEntry
from ...schemas.patient import PatientCreate, PatientRead, PatientStatus, PatientUpdate
from ...schemas.patient_base import PatientBase
from ..deps import get_db, require_role

router = APIRouter()


@router.get("", response_model=list[PatientStatus])
def read_many(
    role: str = Depends(require_role([HOS])),
    db: Session = Depends(get_db),
) -> list[PatientStatus]:
    result = patients.read_many(db)
    return result


@router.post("", response_model=PatientRead)
def create(
    patient: PatientCreate,
    role: str = Depends(require_role([HOS])),
    db: Session = Depends(get_db),
) -> PatientRead:
    try:
        result = patients.create(db, patient=patient)
    except DuplicateCF as excp:
        raise HTTPException(
            status_code=409,
            detail=f"Patient {patient.codice_fiscale} already exists in database",
        ) from excp
    else:
        return result


@router.get("/{patient_id}", response_model=PatientRead)
def read_one(
    patient_id: str,
    role: str = Depends(require_role([HOS])),
    db: Session = Depends(get_db),
) -> PatientRead:
    result = patients.read_one(db, patient_id=patient_id)
    return result


@router.put("/{patient_id}", response_model=PatientRead)
def update(
    patient_id: str,
    patient: PatientUpdate,
    role: str = Depends(require_role([HOS, IIT])),
    db: Session = Depends(get_db),
) -> PatientRead:
    try:
        result = patients.update(db, patient_id=patient_id, patient=patient)
    except BadValues as excp:
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=excp.args,
        ) from excp
    else:
        return result


@router.post("/{patient_id}/contacts", response_model=ContactEntry)
def create_contact(
    patient_id: str,
    contact: ContactCreate,
    role: str = Depends(require_role([HOS, IIT])),
    db: Session = Depends(get_db),
) -> ContactEntry:
    result = patient_contacts.create_one(db, patient_id=patient_id, contact=contact)
    return result


@router.get("/{patient_id}/contacts", response_model=list[ContactEntry])
def read_contacts(
    patient_id: str,
    role: str = Depends(require_role([HOS])),
    db: Session = Depends(get_db),
) -> list[ContactEntry]:
    result = patient_contacts.read_many(db, patient_id=patient_id)
    return result


@router.put("/{patient_id}/contacts", response_model=list[ContactEntry])
def update_contact(
    patient_id: str,
    contacts: list[ContactCreate],
    role: str = Depends(require_role([HOS])),
    db: Session = Depends(get_db),
) -> list[ContactEntry]:
    _ = patient_contacts.delete_many(db, patient_id=patient_id)
    result = patient_contacts.create_many(
        db,
        patient_id=patient_id,
        contacts=contacts,
    )
    return result
