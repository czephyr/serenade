from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import NoResultFound
from sqlalchemy.orm import Session

from ...api.deps import get_db, require_role
from ...core.roles import HOS, IIT, IMT, UNIMI
from ...crud import installation_details, installations
from ...schemas.installation import (
    InstallationDetailCreate,
    InstallationDetailRead,
    InstallationDetailUpdate,
    InstallationInfo,
    InstallationStatus,
)
from ...schemas.patient_base import PatientBase

router = APIRouter()


@router.get("/", response_model=list[InstallationStatus])
def read_many(
    current_user: dict = Depends(require_role([IIT, IMT])),
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
        result = installation_details.read_one(db, patient_id)
    except NoResultFound as excp:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail=f"Installation {patient_id} not found",
        ) from excp
    return result


@router.get("/{patient_id}/info", response_model=InstallationInfo)
def read_info(
    patient_id: int,
    current_user: dict = Depends(require_role([IIT])),
    db: Session = Depends(get_db),
) -> InstallationInfo:
    try:
        result = installations.info(db, patient_id)
    except NoResultFound as excp:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail=f"Installation {patient_id} not found",
        ) from excp
    else:
        return result


@router.post("/", response_model=InstallationDetailRead)
def create(
    patient_id: int,
    installation: InstallationDetailCreate,
    current_user: dict = Depends(require_role([HOS, IMT])),
    db: Session = Depends(get_db),
) -> InstallationDetailRead:
    try:
        result = installation_details.create(db, patient_id, installation)
    except NoResultFound as excp:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail=f"Patient {patient_id} not found",
        ) from excp
    else:
        return result


@router.put("/{patient_id}/", response_model=InstallationDetailRead)
def update(
    patient_id: int,
    installation: InstallationDetailUpdate,
    current_user: dict = Depends(require_role([HOS, IMT])),
    db: Session = Depends(get_db),
) -> InstallationDetailRead:
    try:
        result = installation_details.update(db, patient_id, installation)
    except NoResultFound as excp:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail=f"Patient {patient_id} not found",
        ) from excp
    else:
        return result


@router.post("/{patient_id}/close", response_model=PatientBase)
def close(
    patient_id: int,
    current_user: dict = Depends(require_role([HOS, IMT])),
    db: Session = Depends(get_db),
) -> PatientBase:
    try:
        result = installations.close(db, patient_id=patient_id)
    except NoResultFound as excp:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail=f"Patient {patient_id} not found",
        ) from excp
    else:
        return result


@router.post("/{patient_id}/open", response_model=PatientBase)
def open(
    patient_id: int,
    current_user: dict = Depends(require_role([HOS, IMT])),
    db: Session = Depends(get_db),
) -> PatientBase:
    try:
        result = installations.open(db, patient_id=patient_id)
    except NoResultFound as excp:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail=f"Patient {patient_id} not found",
        ) from excp
    else:
        return result