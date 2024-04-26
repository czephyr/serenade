from datetime import datetime

import arlecchino
import humanize
from sqlalchemy.orm import Session

from ..core.const import SALT_HASH
from ..core.excp import BadValues
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
def query_one(db: Session, *, patient_id: int) -> InstallationDetail:
    result_orm = (
        db.query(InstallationDetail)
        .where(InstallationDetail.patient_id == patient_id)
        .one()
    )
    return result_orm


def read_one(db: Session, *, patient_id: int) -> InstallationDetailRead:
    detail_orm = query_one(db, patient_id=patient_id)
    detail = InstallationDetailBase.model_validate(detail_orm)

    patient_orm = patient_status.query_one(db, patient_id=patient_id)
    patient = PatientBase.model_validate(patient_orm)

    kw = PatientBase.model_dump(patient)
    kw |= InstallationDetailBase.model_dump(detail)
    kw["hue"] = arlecchino.draw(patient_id, SALT_HASH)
    result = InstallationDetailRead.model_validate(kw)
    return result


def read_many(db: Session) -> list[InstallationStatus]:
    results_orm = db.query(Patient).all()
    results = [
        InstallationStatus(
            patient_id=result_orm.patient_id,
            status=status(db, patient_id=result_orm.patient_id),
            date_delta=last_update(db, patient_id=result_orm.patient_id),
            hue=arlecchino.draw(result_orm.patient_id, SALT_HASH),
        )
        for result_orm in results_orm
    ]
    return results


def create(
    db: Session, *, patient_id: int, installation: InstallationDetailCreate
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
    db: Session, *, patient_id: int, installation: InstallationDetailUpdate
) -> InstallationDetailRead:
    result_orm = query_one(db, patient_id=patient_id)
    kw = installation.model_dump(exclude_unset=True)
    for k, v in kw.items():
        setattr(result_orm, k, v)
    db.commit()
    db.refresh(result_orm)

    result = read_one(db, patient_id=patient_id)
    return result


def last_update(db: Session, *, patient_id: int) -> str:
    ts_max = max(
        [
            m.ts
            for t in tickets.read_many(db, patient_id=patient_id)
            for m in tickets.query_one(db, ticket_id=t.ticket_id).messages
        ]
    )
    date_delta = humanize.naturaltime((datetime.now() - ts_max))
    return date_delta


def status(db: Session, *, patient_id: int) -> str:
    result_orm = query_one(db, patient_id=patient_id)
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


def open(
    db: Session, *, patient_id: int, force: bool = False
) -> InstallationDetailRead:
    result_orm = query_one(db, patient_id=patient_id)
    if not force and result_orm.date_start is not None:
        raise BadValues("Installation is already marked as active.")
    result_orm.date_start = datetime.now()
    result_orm.date_end = None

    db.commit()
    db.refresh(result_orm)

    result = read_one(db, patient_id=patient_id)
    return result


def close(
    db: Session, *, patient_id: int, force: bool = False
) -> InstallationDetailRead:
    result_orm = query_one(db, patient_id=patient_id)
    if not force and result_orm.date_end is not None:
        raise BadValues("Installation is already marked as inactive.")
    result_orm.date_end = datetime.now()

    db.commit()
    db.refresh(result_orm)

    result = read_one(db, patient_id=patient_id)
    return result
