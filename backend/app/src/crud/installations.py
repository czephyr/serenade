from datetime import datetime

import humanize
from sqlalchemy.orm import Session

from ..core.roles import IIT
from ..ormodels import Patient, PatientDetail
from ..schemas.installation import InstallationInfo
from ..schemas.patient_base import PatientBase
from . import contacts


def query_one(db: Session, patient_id: int) -> Patient:
    result_orm = db.query(Patient).where(Patient.patient_id == patient_id).one()
    return result_orm


def read_one(db: Session, patient_id: int) -> PatientBase:
    result_orm = query_one(db, patient_id)
    result = PatientBase.model_validate(result_orm)
    return result


def info(db: Session, patient_id: int) -> InstallationInfo:
    result_orm = (
        db.query(PatientDetail).where(PatientDetail.patient_id == patient_id).one()
    )
    result = InstallationInfo(
        first_name=result_orm.first_name,
        last_name=result_orm.last_name,
        home_address=result_orm.home_address,
        contacts=contacts.read_many(db, patient_id),
    )
    return result


def open(db: Session, patient_id: int) -> PatientBase:
    result_orm = query_one(db, patient_id)
    result_orm.date_start = datetime.now()
    result_orm.date_end = None

    db.commit()
    db.refresh(result_orm)

    result = read_one(db, patient_id)
    return result


def close(db: Session, patient_id: int) -> PatientBase:
    result_orm = query_one(db, patient_id)
    result_orm.date_end = datetime.now()

    db.commit()
    db.refresh(result_orm)

    result = read_one(db, patient_id)
    return result
