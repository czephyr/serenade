from datetime import datetime

import arlecchino
import humanize
from sqlalchemy.orm import Session

from ..core.const import SALT_HASH
from ..core.roles import IIT
from ..ormodels import InstallationDetail, Patient
from ..schemas.installation import (
    InstallationDetailBase,
    InstallationDetailCreate,
    InstallationDetailRead,
    InstallationDetailUpdate,
    InstallationStatus,
)
from ..schemas.patient_base import PatientBase
from . import installations, patients, tickets


def query_one(db: Session, patient_id: int) -> InstallationDetail:
    result_orm = (
        db.query(InstallationDetail)
        .where(InstallationDetail.patient_id == patient_id)
        .one()
    )
    return result_orm


def read_one(db: Session, patient_id: int) -> InstallationDetailRead:
    detail_orm = query_one(db, patient_id)
    detail = InstallationDetailBase.model_validate(detail_orm)

    patient_orm = installations.query_one(db, patient_id)
    patient = PatientBase.model_validate(patient_orm)

    kw = PatientBase.model_dump(patient)
    kw |= InstallationDetailBase.model_dump(detail)
    kw["hue"] = arlecchino.draw(patient_id, SALT_HASH)
    result = InstallationDetailRead.model_validate(kw)
    return result


def read_many(
    db: Session, *, skip: int = 0, limit: int = 100
) -> list[InstallationStatus]:
    results_orm = db.query(Patient).offset(skip).limit(limit).all()
    results = [
        InstallationStatus(
            patient_id=result_orm.patient_id,
            status=patients.status(db, result_orm.patient_id),
            date_delta=last_update(db, result_orm.patient_id),
            hue=arlecchino.draw(result_orm.patient_id, SALT_HASH),
        )
        for result_orm in results_orm
    ]
    return results


def create(
    db: Session, patient_id: int, installation: InstallationDetailCreate
) -> InstallationDetailRead:
    kw = installation.model_dump(exclude_unset=True)
    result_orm = InstallationDetail(**kw)
    result_orm.patient_id = patient_id
    db.add(result_orm)

    db.commit()
    db.refresh(result_orm)

    result = read_one(db, patient_id)
    return result


def update(
    db: Session, patient_id: int, installation: InstallationDetailUpdate
) -> InstallationDetailRead:
    result_orm = query_one(db, patient_id)
    kw = installation.model_dump(exclude_unset=True)
    for k, v in kw.items():
        setattr(result_orm, k, v)
    db.commit()
    db.refresh(result_orm)

    result = read_one(db, patient_id)
    return result


def last_update(db: Session, patient_id: int):
    ts_max = max(
        [
            m.ts
            for t in tickets.read_many(db, patient_id)
            for m in tickets.query_one(db, t.ticket_id).messages
        ]
    )
    date_delta = humanize.naturaltime((datetime.now() - ts_max))
    return date_delta
