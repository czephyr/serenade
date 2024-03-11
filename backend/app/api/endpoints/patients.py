from typing import Dict, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.orm.exc import NoResultFound

from crud.crud_patient import (create_patient, delete_patient, get_patient,
                                  get_patients, update_patient)
from schemas.patient import Patient, PatientCreate
from api.deps import get_db, require_role

router = APIRouter()


@router.get("/patients/", response_model=List[Patient])
async def list_patients_endpoint(
    current_user: Dict = Depends(require_role(["dottore"])),
    db: Session = Depends(get_db),
):
    return get_patients(db=db)


@router.get("/patients/{patient_id}", response_model=Patient)
async def get_patient_endpoint(
    cf: str,
    current_user: Dict = Depends(require_role(["dottore"])),
    db: Session = Depends(get_db),
):
    db_patient = get_patient(db, cf=cf)
    if db_patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return db_patient


# Add more endpoints as needed for update and delete
@router.post("/patients/", response_model=Patient)
async def create_patient_endpoint(
    patient: PatientCreate,
    current_user: Dict = Depends(require_role(["dottore"])),
    db: Session = Depends(get_db),
):

    # Creating patient
    new_patient = create_patient(db=db, patient=patient)

    return new_patient

@router.put("/patients/{patient_id}", response_model=Patient)
async def update_patient_endpoint(
    cf: str,
    updated_patient: Patient,
    current_user: Dict = Depends(require_role(["dottore"])),
    db: Session = Depends(get_db),
):
    try:
        updated_patient = update_patient(db=db, cf=cf, patient=updated_patient)
        return updated_patient
    except NoResultFound as excp:
        raise HTTPException(status_code=404, detail="Patient not found") from excp


@router.delete("/patients/{patient_id}", response_model=Patient)
async def delete_patient_endpoint(
    cf: str,
    updated_patient: Patient,
    current_user: Dict = Depends(require_role(["dottore"])),
    db: Session = Depends(get_db),
):
    deleted = delete_patient(db=db, cf=cf)

    return deleted
