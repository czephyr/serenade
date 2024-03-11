from sqlalchemy.orm import Session
from models.patient import Patient
from models.tickets import Ticket
from schemas.patient import PatientCreate, PatientUpdate
from schemas.ticket import TicketCreate
from crud.crud_ticket import create_ticket
from sqlalchemy.orm.exc import NoResultFound
import arrow
import random 

def get_patient(db: Session, cf: str):
    return db.query(Patient).filter(Patient.cf == cf).first()


def get_patients(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Patient).offset(skip).limit(limit).all()


def create_patient(db: Session, patient_create: PatientCreate):
    db_patient = Patient(
        patient_id=random.randbytes(32),
        first_name=patient_create.first_name,
        last_name=patient_create.last_name,
        cf=patient_create.cf,
        address=patient_create.address,
        contact=patient_create.contact,
        medical_notes=patient_create.medical_notes,
        install_num=random.randbytes(32),
        install_time=arrow.utcnow(),
    )
    db.add(db_patient)

    create_ticket(
        TicketCreate(
            install_num=db_patient.install_num, ticket_open_time=arrow.utcnow()
        )    )

    db.commit()
    db.refresh(db_patient)
    return db_patient


def update_patient(db: Session, cf: str, patient: PatientUpdate):
    try:
        db_patient = get_patient(db, cf)
    except NoResultFound as excp:
        raise NoResultFound(f"No patient found with cf {cf}") from excp
    
    update_data = patient.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_patient, key, value)
    db.commit()
    db.refresh(db_patient)
    return db_patient


def delete_patient(db: Session, cf: int):
    db_patient = get_patient(db, cf)
    if db_patient:
        db.delete(db_patient)
        db.commit()
    return db_patient
