from typing import Dict, List, Union
from sqlalchemy.exc import IntegrityError

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.orm.exc import NoResultFound

from crud.crud_installation import (get_installation,
                                  get_installations)
from schemas.installation import ListInstallation, IITInstallation, IMTInstallation
from api.deps import get_db, require_role,is_imt_or_iit

router = APIRouter()


@router.get("/", response_model=List[ListInstallation])
async def list_installations_endpoint(
    current_user: Dict = Depends(require_role(["iit","imt"])),
    db: Session = Depends(get_db),
):
    return get_installations(db=db)

@router.get("/{install_num}", response_model=Union[IITInstallation,IMTInstallation])
async def get_installation_endpoint(
    install_num: int,
    current_user: Dict = Depends(require_role(["iit","imt"])),
    db: Session = Depends(get_db),
):
    try:
        role = is_imt_or_iit(current_user)
        installation = get_installation(db, install_num=install_num, asker_role=role)
    except NoResultFound as excp:
        raise HTTPException(status_code=404, detail="Patient with id {id} not found") from excp
    return installation

# @router.put("/{patient_id}", response_model=Patient)
# async def update_patient_endpoint(
#     patient_id: int,
#     updated_patient: PatientCreate,
#     current_user: Dict = Depends(require_role(["dottore"])),
#     db: Session = Depends(get_db),
# ):
#     try:
#         updated_patient = update_patient(db=db, id=patient_id, patient=updated_patient)
#         return updated_patient
#     except NoResultFound as excp:
#         raise HTTPException(status_code=404, detail="Patient with id {patient_id} not found") from excp
#     except IntegrityError as excp:
#         raise HTTPException(status_code=409, detail=f"Patient with id {patient_id} already exists in database") from excp
