from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas
from ...crud.crud_patient import get_patients,create_patient 
from ..api.deps import get_db, require_role 
from ...schemas.patient import PatientCreate, Patient
from typing import Dict

router = APIRouter()

@router.get("/patients/", response_model=List[Patient])
def list_patients(
    current_user: Dict = Depends(require_role(["dottore"])),
    db: Session = Depends(get_db),
):
    return get_patients(db=db)


@router.get("/patients/{patient_id}", response_model=Patient)
def get_patient(patient_id: int, db: Session = Depends(get_db)):
    db_patient = get_patient(db, patient_id=patient_id)
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
