from datetime import datetime

import humanize
from fastapi import HTTPException
from sqlalchemy.orm import Session

from ..core import crypto
from ..core.status import (
    INSTALLATION_CLOSED,
    INSTALLATION_CLOSING,
    INSTALLATION_OPEN,
    INSTALLATION_OPENING,
    INSTALLATION_PAUSE,
    INSTALLATION_UNKNOW,
    TICKET_CLOSED,
)
from ..ormodels import InstallationDetail, Patient
from ..schemas.installation import (
    InstallationDetailBase,
    InstallationDetailCreate,
    InstallationDetailRead,
    InstallationDetailUpdate,
    InstallationStatus,
)
from ..schemas.patient_base import PatientBase
from ..utils import unfoundable
from . import patient_status, tickets


@unfoundable("patient")
def query_one(db: Session, *, patient_id: str) -> InstallationDetail:
    result_orm = (
        db.query(InstallationDetail)
        .where(InstallationDetail.patient_id == patient_id)
        .one()
    )
    return result_orm


def read_one(db: Session, *, patient_id: str) -> InstallationDetailRead:
    detail_orm = query_one(db, patient_id=patient_id)
    detail = InstallationDetailBase.model_validate(detail_orm)

    patient_orm = patient_status.query_one(db, patient_id=patient_id)
    patient = PatientBase.model_validate(patient_orm)

    kw = PatientBase.model_dump(patient)
    kw |= InstallationDetailBase.model_dump(detail)
    result = InstallationDetailRead.model_validate(kw)
    result.hue = crypto.hue(patient_id)
    return result


def read_many(db: Session) -> list[InstallationStatus]:
    results_orm = db.query(Patient).all()
    results = [
        InstallationStatus(
            patient_id=result_orm.patient_id,
            status=status(db, patient_id=result_orm.patient_id),
            date_delta=last_update(db, patient_id=result_orm.patient_id),
            hue=crypto.hue(result_orm.patient_id),
        )
        for result_orm in results_orm
    ]
    return results


def create(
    db: Session, *, patient_id: str, installation: InstallationDetailCreate
) -> InstallationDetailRead:
    kw = installation.model_dump(exclude_unset=True)
    result_orm = InstallationDetail(**kw)
    result_orm.patient_id = patient_id
    db.add(result_orm)

    db.commit()
    db.refresh(result_orm)

    result = read_one(db, patient_id=patient_id)
    return result


def update(
    db: Session, *, patient_id: str, installation: InstallationDetailUpdate
) -> InstallationDetailRead:
    result_orm = query_one(db, patient_id=patient_id)
    kw = installation.model_dump(exclude_unset=True)
    for k, v in kw.items():
        setattr(result_orm, k, v)
    db.commit()
    db.refresh(result_orm)

    result = read_one(db, patient_id=patient_id)
    return result


def last_update(db: Session, *, patient_id: str) -> str:
    ts_max = max(
        [
            m.ts
            for t in tickets.read_many(db, patient_id=patient_id)
            for m in tickets.query_one(db, ticket_id=t.ticket_id).messages
        ]
    )
    date_delta = humanize.naturaltime((datetime.now() - ts_max))
    return date_delta


def status(db: Session, *, patient_id: str) -> str:
    try:
        result_orm = query_one(db, patient_id=patient_id)
    except HTTPException as excp:
        if excp.status_code == 404:
            return INSTALLATION_UNKNOW
        else:
            raise excp

    ticket_status = all(
        e.status == TICKET_CLOSED for e in tickets.read_many(db, patient_id=patient_id)
    )
    context = (
        result_orm.date_start is not None,
        result_orm.date_end is not None,
        ticket_status,
    )
    match context:
        case (True, False, True):
            return INSTALLATION_OPEN
        case (True, False, False):
            return INSTALLATION_PAUSE
        case (_, True, True):
            return INSTALLATION_CLOSED
        case (False, _, False):
            return INSTALLATION_OPENING
        case (True, True, False):
            return INSTALLATION_CLOSING
        case _:
            return INSTALLATION_UNKNOW
