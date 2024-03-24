from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import NoResultFound
from sqlalchemy.orm import Session

from ...api.deps import get_db, is_imt_or_iit, require_role
from ...crud import installations, installation_status
from ...core.roles import IIT, IMT
from ...schemas.installation import (
    InstallationIIT,
    InstallationIMT,
    InstallationStatus,
    InstallationBase,
)

router = APIRouter()


@router.get("/", response_model=list[InstallationBase])
async def read_many(
    current_user: dict = Depends(require_role([IIT, IMT])),
    db: Session = Depends(get_db),
) -> list[InstallationBase]:
    result = installations.read_many(db)
    return result


@router.get("/{install_num}", response_model=InstallationIIT | InstallationIMT)
async def read_one(
    install_num: int,
    current_user: dict = Depends(require_role([IIT, IMT])),
    db: Session = Depends(get_db),
) -> InstallationIIT | InstallationIMT:
    role = is_imt_or_iit(current_user)
    try:
        result = installations.read_one(db, install_num=install_num, role=role)
    except NoResultFound as excp:
        raise HTTPException(
            status_code=404,
            detail=f"Installation {install_num} not found",
        ) from excp
    return result


@router.get("/{install_num}/status", response_model=InstallationStatus)
async def read_one_status(
    install_num: int,
    current_user: dict = Depends(require_role([IIT, IMT])),
    db: Session = Depends(get_db),
) -> InstallationStatus:
    role = is_imt_or_iit(current_user)
    try:
        result = installation_status.read_one(db, install_num=install_num, role=role)
    except NoResultFound as excp:
        raise HTTPException(
            status_code=404,
            detail=f"Installation {install_num} not found",
        ) from excp
    return result
