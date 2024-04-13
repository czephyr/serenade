from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError, NoResultFound
from sqlalchemy.orm import Session

from ...crud import patients
from ...schemas.patient_base import PatientBase
from ...schemas.patient import PatientCreate, PatientRead, PatientStatus, PatientUpdate
from ..deps import get_db, require_role

router = APIRouter()


@router.get("/", response_model=list[PatientStatus])
async def read_many(
    current_user: dict = Depends(require_role(["dottore"])),
    db: Session = Depends(get_db),
) -> list[PatientStatus]:
    result = patients.read_many(db=db)
    return result


@router.post("/", response_model=PatientRead)
async def create(
    patient: PatientCreate,
    current_user: dict = Depends(require_role(["dottore"])),
    db: Session = Depends(get_db),
) -> PatientRead:

    try:
        result = patients.create(db=db, patient=patient)
    except IntegrityError as excp:
        raise HTTPException(
            status_code=409,
            detail=f"Patient {patient.codice_fiscale} already exists in database",
        ) from excp
    else:
        return result


@router.get("/{patient_id}", response_model=PatientRead)
async def read_one(
    patient_id: int,
    current_user: dict = Depends(require_role(["dottore"])),
    db: Session = Depends(get_db),
) -> PatientRead:
    try:
        result = patients.read_one(db, patient_id=patient_id)
    except NoResultFound as excp:
        raise HTTPException(
            status_code=404,
            detail=f"Patient with id {patient_id} not found",
        ) from excp
    else:
        return result


@router.put("/{patient_id}", response_model=PatientRead)
async def update(
    patient_id: int,
    patient: PatientUpdate,
    current_user: dict = Depends(require_role(["dottore"])),
    db: Session = Depends(get_db),
) -> PatientRead:
    try:
        result = patients.update(db=db, patient_id=patient_id, patient=patient)
    except NoResultFound as excp:
        raise HTTPException(
            status_code=404,
            detail=f"Patient with id {patient_id} not found",
        ) from excp
    else:
        return result
