from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from models.patient import Patient
from models.tickets import Ticket as ModelTicket
from schemas.patient import PatientCreate, ListPatient
from models.notes import Note
from schemas.ticket import TicketBase as SchemaTicket
from utils import local_utils
from schemas.installation import IITInstallation, IMTInstallation, ListInstallation
from sqlalchemy.orm.exc import NoResultFound
import arrow
import random


# TODO: fix this shit with SQLModels
def sqlalchemy_to_pydantic(ticket: ModelTicket) -> SchemaTicket:
    return SchemaTicket(
        status=ticket.status,
        install_num=ticket.install_num,
        ticket_open_time=ticket.ticket_open_time,
        ticket_id=ticket.ticket_id,
        ticket_close_time=ticket.ticket_close_time,
    )


def get_installation(db: Session, install_num: int, asker_role: str):
    try:
        patient = db.query(Patient).filter(Patient.install_num == install_num).first()
        note = db.query(Note).filter(Note.install_num == install_num).first()
        tickets_list = (
            db.query(ModelTicket).filter(ModelTicket.install_num == install_num).all()
        )
        pydantic_tickets_list = [
            sqlalchemy_to_pydantic(ticket) for ticket in tickets_list
        ]
        if asker_role == "iit":
            return IITInstallation(
                creation_time=patient.creation_time,
                install_num=patient.install_num,
                medical_notes=patient.medical_notes,
                installation_notes=note.install_notes,
                tickets_list=pydantic_tickets_list,
                first_name=patient.first_name,
                last_name=patient.last_name,
                age=local_utils.age_from_cf(patient.cf),
                address=patient.address,
                contact=patient.contact,
            )
        elif asker_role == "imt":
            return IMTInstallation(
                creation_time=patient.creation_time,
                install_num=patient.install_num,
                medical_notes=patient.medical_notes,
                installation_notes=note.install_notes,
                tickets_list=pydantic_tickets_list,
                patient_id=patient.patient_id,
            )
    except NoResultFound as excp:
        raise NoResultFound(
            detail=f"No installation found with install number {install_num}"
        ) from excp


def get_installations(db: Session, skip: int = 0, limit: int = 100):
    list_installations = []
    for patient in db.query(Patient).offset(skip).limit(limit).all():
        status = "functional"
        for ticket_status in (
            db.query(ModelTicket)
            .filter(ModelTicket.install_num == patient.install_num)
            .all()
        ):
            if ticket_status != "closed":
                status = "unready"
        list_installations.append(
            ListInstallation(
                install_num=patient.install_num,
                creation_time=patient.creation_time,
                status=status,
            )
        )
    return list_installations


# def update_patient(db: Session, id: int, patient: PatientCreate):
#     try:
#         db_patient = get_patient(db, id)
#     except NoResultFound as excp:
#         raise NoResultFound(detail=f"No patient found with id {id}") from excp

#     update_data = patient.dict(exclude_unset=True)

#     try:
#         for key, value in update_data.items():
#             setattr(db_patient, key, value)
#         db.commit()
#         db.refresh(db_patient)
#     except IntegrityError as excp:
#         db.rollback()
#         raise excp
#     return db_patient
