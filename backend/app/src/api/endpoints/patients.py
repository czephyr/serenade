from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import NoResultFound
from sqlalchemy.orm import Session

from ...crud import patients
from ...schemas.patient import PatientCreate, PatientRead, PatientStatus, PatientUpdate
from ..deps import get_db, require_role
from ...core.excp import DuplicateCF
from ...core.roles import HOS

router = APIRouter()


@router.get("/", response_model=list[PatientStatus])
def read_many(
    current_user: dict = Depends(require_role([HOS])),
    db: Session = Depends(get_db),
) -> list[PatientStatus]:
    result = patients.read_many(db=db)
    return result


@router.post("/", response_model=PatientRead)
def create(
    patient: PatientCreate,
    current_user: dict = Depends(require_role([HOS])),
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
    patient_id: int,
    current_user: dict = Depends(require_role([HOS])),
    db: Session = Depends(get_db),
) -> PatientRead:
    try:
        result = patients.read_one(db, patient_id=patient_id)
    except NoResultFound as excp:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail=f"Patient with id {patient_id} not found",
        ) from excp
    else:
        return result


@router.put("/{patient_id}", response_model=PatientRead)
def update(
    patient_id: int,
    patient: PatientUpdate,
    current_user: dict = Depends(require_role([HOS])),
    db: Session = Depends(get_db),
) -> PatientRead:
    try:
        result = patients.update(db, patient_id=patient_id, patient=patient)
    except NoResultFound as excp:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail=f"Patient with id {patient_id} not found",
        ) from excp
    else:
        return result