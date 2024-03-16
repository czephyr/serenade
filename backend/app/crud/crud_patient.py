from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from models.patient import Patient
from models.tickets import Ticket
from schemas.patient import PatientCreate, ListPatient
from schemas.ticket import TicketCreate
from schemas.note import NoteCreate
from crud.crud_ticket import create_ticket
from crud.crud_note import create_note
from sqlalchemy.orm.exc import NoResultFound
import arrow
import random

def get_patient(db: Session, patient_id: int):
    try:
        return db.query(Patient).filter(Patient.patient_id == patient_id).first()
    except NoResultFound as excp:
        raise NoResultFound(detail=f"No patient found with id {id}") from excp    

def get_patients(db: Session, skip: int = 0, limit: int = 100):
    list_patients = []
    for patient in db.query(Patient).offset(skip).limit(limit).all():
        status = "functional"
        for ticket_status in db.query(Ticket).filter(Ticket.install_num == patient.install_num).all():
            if ticket_status != "closed":
                status = "unready"
        list_patients.append(ListPatient(first_name=patient.first_name,last_name=patient.last_name,patient_id=patient.patient_id))
    return list_patients


def create_patient(db: Session, patient_create: PatientCreate):
    now_time = arrow.utcnow().datetime

    while True:
        pid = int.from_bytes(random.randbytes(7), byteorder="little")
        if not db.query(Patient).filter(Patient.patient_id == pid).first():
            break
    
    while True:
        install_n = int.from_bytes(random.randbytes(7), byteorder="little")
        if not db.query(Patient).filter(Patient.install_num == install_n).first():
            break

    db_patient = Patient(
        patient_id=pid,
        first_name=patient_create.first_name,
        last_name=patient_create.last_name,
        cf=patient_create.cf,
        address=patient_create.address,
        contact=patient_create.contact,
        medical_notes=patient_create.medical_notes,
        install_num=install_n,
        creation_time=now_time,
    )
    try:
        db.add(db_patient)
    except IntegrityError as excp:
        db.rollback()
        raise excp
    db.commit()

    create_ticket(
        db=db,
        ticket_create=TicketCreate(
            status="todo", install_num=db_patient.install_num, ticket_open_time=now_time
        ),
    )

    create_note(
        db=db,
        note_create=NoteCreate(
            install_num=db_patient.install_num, install_notes=""
        ),
    )

    return db_patient


def update_patient(db: Session, id: int, patient: PatientCreate):
    try:
        db_patient = get_patient(db, id)
    except NoResultFound as excp:
        raise NoResultFound(detail=f"No patient found with id {id}") from excp

    update_data = patient.dict(exclude_unset=True)
    
    try:
        for key, value in update_data.items():
            setattr(db_patient, key, value)
        db.commit()
        db.refresh(db_patient)
    except IntegrityError as excp:
        db.rollback()
        raise excp
    return db_patient


def delete_patient(db: Session, id: int):
    try:
        db_patient = get_patient(db, id)
    except NoResultFound as excp:
        raise NoResultFound(detail=f"No patient found with id {id}") from excp
    db.delete(db_patient)
    db.commit()
    return db_patient
