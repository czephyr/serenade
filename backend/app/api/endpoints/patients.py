from typing import Dict, List
from sqlalchemy.exc import IntegrityError
from opentelemetry import trace
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.orm.exc import NoResultFound

from crud.crud_patient import (create_patient, delete_patient, get_patient,
                                  get_patients, update_patient)
from schemas.patient import Patient, PatientCreate, ListPatient
from api.deps import get_db, require_role

router = APIRouter()

@router.get("/", response_model=List[ListPatient])
async def list_patients_endpoint(
    current_user: Dict = Depends(require_role(["dottore"])),
    db: Session = Depends(get_db),
):
    
    # tracer = trace.get_tracer(__name__)
    # with tracer.start_as_current_span("list_patients", attributes={"user.name": current_user.get("username", "unknown")}):
    return get_patients(db=db)

@router.post("/", response_model=Patient)
async def create_patient_endpoint(
    patient: PatientCreate,
    current_user: Dict = Depends(require_role(["dottore"])),
    db: Session = Depends(get_db),
):
    # tracer = trace.get_tracer(__name__)
    # with tracer.start_as_current_span("create_patient", attributes={"user.name": current_user.get("username", "unknown")}):
    try:
        new_patient = create_patient(db=db, patient_create=patient)
    except IntegrityError as excp:
        raise HTTPException(status_code=409, detail=f"Patient with cf {patient.cf} already exists in database") from excp
    return new_patient

@router.get("/{patient_id}", response_model=Patient)
async def get_patient_endpoint(
    patient_id: int,
    current_user: Dict = Depends(require_role(["dottore"])),
    db: Session = Depends(get_db),
):
    try:
        db_patient = get_patient(db, patient_id=patient_id)
    except NoResultFound as excp:
        raise HTTPException(status_code=404, detail="Patient with id {id} not found") from excp
    return db_patient

@router.put("/{patient_id}", response_model=Patient)
async def update_patient_endpoint(
    patient_id: int,
    updated_patient: PatientCreate,
    current_user: Dict = Depends(require_role(["dottore"])),
    db: Session = Depends(get_db),
):
    try:
        updated_patient = update_patient(db=db, id=patient_id, patient=updated_patient)
        return updated_patient
    except NoResultFound as excp:
        raise HTTPException(status_code=404, detail="Patient with id {patient_id} not found") from excp
    except IntegrityError as excp:
        raise HTTPException(status_code=409, detail=f"Patient with id {patient_id} already exists in database") from excp


@router.delete("/{patient_id}", response_model=Patient)
async def delete_patient_endpoint(
    patient_id: int,
    current_user: Dict = Depends(require_role(["dottore"])),
    db: Session = Depends(get_db),
):
    try: 
        deleted = delete_patient(db=db, id=patient_id)
    except NoResultFound as excp:
        raise HTTPException(status_code=404, detail="Patient with id {patient_id} not found") from excp    
    return deleted
