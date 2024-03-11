from sqlalchemy.orm import Session
from ..models.patient import Patient
from ..models.tickets import Ticket
from ..schemas.patient import PatientCreate, PatientUpdate
from ..schemas.ticket import TicketCreate
from .crud_ticket import create_ticket
import arrow
import random


def get_patient(db: Session, patient_id: int):
    return db.query(Patient).filter(Patient.patient_id == patient_id).first()


def get_patients(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Patient).offset(skip).limit(limit).all()


def create_patient(db: Session, patient: PatientCreate):
    db_patient = Patient(
        first_name=patient.first_name,
        last_name=patient.last_name,
        cf=patient.cf,
        address=patient.address,
        contact=patient.contact,
        medical_notes=patient.medical_notes,
        install_num=patient.install_num,
        install_time=arrow.utcnow(),
    )
    db.add(db_patient)

    create_ticket(
        TicketCreate(
            install_num=db_patient.install_num, ticket_open_time=arrow.utcnow()
        ),
        patient_id=db_patient,
    )

    db.commit()
    db.refresh(db_patient)
    return db_patient


def update_patient(db: Session, patient_id: int, patient: PatientUpdate):
    db_patient = get_patient(db, patient_id)
    if db_patient:
        update_data = patient.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_patient, key, value)
        db.commit()
        db.refresh(db_patient)
    return db_patient


def delete_patient(db: Session, patient_id: int):
    db_patient = get_patient(db, patient_id)
    if db_patient:
        db.delete(db_patient)
        db.commit()
    return db_patient
