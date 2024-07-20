from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from ..core import crypto
from ..core.excp import JHON_TITOR, JhonTitor, john_titor, johntitorable, unfoundable
from ..core.status import (
    INSTALLATION_CLOSED,
    INSTALLATION_CLOSING,
    INSTALLATION_OPEN,
    INSTALLATION_OPENING,
    INSTALLATION_PAUSE,
    INSTALLATION_UNKNOW,
    TICKET_OPEN,
    TICKET_CLOSED,
    TICKET_INSTALLATION,
    TICKET_MAINTENANCE,
    TICKET_UNINSTALLATION,
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
            status=read_status(db, patient_id=result_orm.patient_id),
            date_delta=last_update(db, patient_id=result_orm.patient_id),
            hue=crypto.hue(result_orm.patient_id),
            date_join=result_orm.date_join,
        )
        for result_orm in results_orm
    ]
    return results


@johntitorable
@unfoundable("patient")
def create(
    db: Session, *, patient_id: str, installation: InstallationDetailCreate
) -> InstallationDetailRead:

    if john_titor(installation.date_start, installation.date_end):
        raise JhonTitor(
            JHON_TITOR.format(
                prev_key="date_start",
                prev_value=installation.date_start,
                curr_key="date_end",
                curr_value=installation.date_end,
            )
        )

    kw = installation.model_dump(exclude_unset=True)
    result_orm = InstallationDetail(**kw)
    result_orm.patient_id = patient_id
    db.add(result_orm)

    db.commit()
    db.refresh(result_orm)

    result = read_one(db, patient_id=patient_id)
    return result


@johntitorable
def update(
    db: Session, *, patient_id: str, installation: InstallationDetailUpdate
) -> InstallationDetailRead:
    result_orm = query_one(db, patient_id=patient_id)
    kw = installation.model_dump(exclude_unset=True)

    date_start = result_orm.date_start if "date_start" not in kw else kw["date_start"]
    date_end = result_orm.date_end if "date_end" not in kw else kw["date_end"]
    if john_titor(date_start, date_end):
        raise JhonTitor(
            JHON_TITOR.format(
                prev_key="date_start",
                prev_value=date_start,
                curr_key="date_end",
                curr_value=date_end,
            )
        )

    for k, v in kw.items():
        setattr(result_orm, k, v)
    db.commit()
    db.refresh(result_orm)

    result = read_one(db, patient_id=patient_id)
    return result


def last_update(db: Session, *, patient_id: str) -> float:
    ts_max = max(
        [
            m.ts
            for t in tickets.read_many(db, patient_id=patient_id)
            for m in tickets.query_one(db, ticket_id=t.ticket_id).messages
        ],
        default=patient_status.query_one(db, patient_id=patient_id).ts,
    )
    date_delta = (datetime.now() - ts_max).total_seconds()
    return date_delta


def read_status(db: Session, *, patient_id: str) -> str:
    try:
        result_orm = query_one(db, patient_id=patient_id)
    except HTTPException as excp:
        if excp.status_code == status.HTTP_404_NOT_FOUND:
            return INSTALLATION_UNKNOW
        else:
            raise excp

    all_tickets = {
        (e.category, e.status) for e in tickets.read_many(db, patient_id=patient_id)
    }

    if (TICKET_UNINSTALLATION, TICKET_CLOSED) in all_tickets:
        return INSTALLATION_CLOSED
    if (TICKET_UNINSTALLATION, TICKET_OPEN) in all_tickets:
        return INSTALLATION_CLOSING
    if (TICKET_INSTALLATION, TICKET_OPEN) in all_tickets:
        return INSTALLATION_OPENING
    if (TICKET_MAINTENANCE, TICKET_OPEN) in all_tickets:
        return INSTALLATION_PAUSE
    if (INSTALLATION_OPEN, INSTALLATION_OPEN) not in all_tickets:
        return INSTALLATION_OPEN
    else:
        return INSTALLATION_UNKNOW
