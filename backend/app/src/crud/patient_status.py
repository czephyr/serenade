from datetime import datetime

from sqlalchemy.orm import Session

from ..core.excp import BadValues
from ..ormodels import Patient
from ..schemas.patient_base import PatientBase
from ..utils import unfoundable


@unfoundable("patient")
def query_one(db: Session, *, patient_id: int) -> Patient:
    result_orm = db.query(Patient).where(Patient.patient_id == patient_id).one()
    return result_orm


def read_one(db: Session, *, patient_id: int) -> PatientBase:
    result_orm = query_one(db, patient_id=patient_id)
    result = PatientBase.model_validate(result_orm)
    return result


def open(db: Session, *, patient_id: int, force: bool = False) -> PatientBase:
    result_orm = query_one(db, patient_id=patient_id)
    if not force and result_orm.date_join is not None:
        raise BadValues("Patient already join the programme.")
    result_orm.date_join = datetime.now()
    result_orm.date_exit = None

    db.commit()
    db.refresh(result_orm)

    result = read_one(db, patient_id=patient_id)
    return result


def close(db: Session, *, patient_id: int, force: bool = False) -> PatientBase:
    result_orm = query_one(db, patient_id=patient_id)
    if not force and result_orm.date_exit is not None:
        raise BadValues("Patient already exit the programme.")
    result_orm.date_exit = datetime.now()

    db.commit()
    db.refresh(result_orm)

    result = read_one(db, patient_id=patient_id)
    return result
