import random

import arrow
from sqlalchemy.orm import Session

from ..ormodels import Patient
from ..schemas.patient import PatientBase, PatientCreate, PatientUpdate
from ..schemas.ticket import TicketCreate
from . import tickets


def query_one(db: Session, patient_id: int) -> Patient:
    result_orm = db.query(Patient).filter(Patient.patient_id == patient_id).one()
    return result_orm


def read_one(db: Session, patient_id: int) -> PatientBase:
    result_orm = query_one(db, patient_id)
    result = PatientBase.model_validate(result_orm)
    return result


def read_many(db: Session, *, skip: int = 0, limit: int = 100) -> list[PatientBase]:
    results_orm = db.query(Patient).offset(skip).limit(limit).all()
    results = [PatientBase.model_validate(r) for r in results_orm]
    return results


def create(db: Session, patient: PatientCreate) -> PatientBase:
    now_time = arrow.utcnow().datetime

    while True:
        patient_id = int.from_bytes(random.randbytes(7), byteorder="little")
        if not db.query(Patient).filter(Patient.patient_id == patient_id).count():
            break

    while True:
        install_num = int.from_bytes(random.randbytes(7), byteorder="little")
        if not db.query(Patient).filter(Patient.install_num == install_num).count():
            break

    result_orm = Patient(
        patient_id=patient_id,
        first_name=patient.first_name,
        last_name=patient.last_name,
        cf=patient.cf,
        address=patient.address,
        contact=patient.contact,
        medical_notes=patient.medical_notes,
        install_num=install_num,
        creation_time=now_time,
    )

    db.add(result_orm)
    db.commit()
    db.refresh(result_orm)

    ticket = TicketCreate(
        install_num=install_num,
    )
    # TODO  qui ci starebbe bene un bellissimo await
    tickets.create(db, ticket)

    result = PatientBase.model_validate(result_orm)
    return result


def update(db: Session, patient_id: int, patient: PatientUpdate) -> PatientBase:
    agruments = patient.model_dump(exclude_unset=True)
    result_orm = query_one(db, patient_id)
    for k, v in agruments.items():
        setattr(result_orm, k, v)
    db.commit()
    db.refresh(result_orm)

    result = PatientBase.model_validate(result_orm)
    return result


def delete(db: Session, patient_id: int) -> PatientBase:
    result_orm = query_one(db, patient_id)
    db.delete(result_orm)
    db.commit()
    result = PatientBase.model_validate(result_orm)
    return result
