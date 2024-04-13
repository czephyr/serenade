import random

from codicefiscale import codicefiscale as cf
from sqlalchemy.orm import Session

from ..core.const import ADMIN_USERNAME, SMS_PATIENT_CREATE
from ..ormodels import (
    Patient,
    PatientDetail,
    PatientFull,
    PatientNote,
    PatientScreening,
)
from ..schemas.contact import ContactEntry
from ..schemas.patient import (
    PatientCreate,
    PatientRead,
    PatientScreeningCreate,
    PatientStatus,
    PatientUpdate,
)
from ..schemas.patient_base import PatientScreeningBase
from ..schemas.ticket import TicketCreate
from ..schemas.ticket_message import TicketMessageCreate
from ..utils import to_age
from . import contacts, tickets


def query_one(db: Session, patient_id: int) -> PatientFull:
    result_orm = (
        db.query(PatientFull).filter(PatientFull.patient_id == patient_id).one()
    )
    return result_orm


def read_one(db: Session, patient_id: int) -> PatientRead:
    result_orm = query_one(db, patient_id)
    codice_fiscale = result_orm.note.codice_fiscale
    result = PatientRead(
        # Patient
        patient_id=result_orm.patient_id,
        # PatientDetail
        first_name=result_orm.details.first_name,
        last_name=result_orm.details.last_name,
        home_address=result_orm.details.home_address,
        # PatientNote
        medical_notes=result_orm.note.medical_notes,
        codice_fiscale=result_orm.note.codice_fiscale,
        # PatientNote : codice_fiscale
        gender=cf.decode(codice_fiscale)["gender"],
        date_of_birth=cf.decode(codice_fiscale)["birthday"],
        place_of_birth=cf.decode(codice_fiscale)["birthplave"],
        # PatientScreening
        neuro_diag=result_orm.screenings[-1].neuro_diag,
        age_class=result_orm.screenings[-1].age_class,
        # Contact
        contacts=[ContactEntry.model_validate(r) for r in result_orm.contacts],
    )
    return result


def read_many(db: Session, *, skip: int = 0, limit: int = 100) -> list[PatientStatus]:
    results_orm = db.query(PatientFull).offset(skip).limit(limit).all()
    results = [
        PatientStatus(
            # PatientDetail
            first_name=result_orm.details.first_name,
            last_name=result_orm.details.last_name,
            age=to_age(result_orm.note.codice_fiscale),
            patient_id=result_orm.patient_id,
            status=status(db=db, patient_id=result_orm.patient_id),
        )
        for result_orm in results_orm
    ]
    return results


def create(db: Session, patient: PatientCreate) -> PatientRead:
    while True:
        patient_id = int.from_bytes(random.randbytes(7), byteorder="little")
        if not db.query(Patient).filter(Patient.patient_id == patient_id).count():
            break

    patient_orm = Patient(
        patient_id=patient_id,
    )
    db.add(patient_orm)
    db.commit()

    result_orm = PatientDetail(
        first_name=patient.first_name,
        last_name=patient.last_name,
        home_address=patient.home_address,
    )
    db.add(result_orm)

    # TODO check AttributeError
    result_orm = PatientScreening(
        neuro_diag=patient.neuro_diag,
        age_class=patient.age_class,
    )
    db.add(result_orm)

    result_orm = PatientNote(
        codice_fiscale=patient.codice_fiscale,
        medical_notes=patient.medical_notes,
    )
    db.add(result_orm)

    _ = contacts.create_many(db, patient_id, patient.contacts)

    ticket = TicketCreate(
        patient_id=patient_id,
        message=TicketMessageCreate(
            body=SMS_PATIENT_CREATE,
            sender=ADMIN_USERNAME,
        ),
    )
    tickets.create(db, ticket)

    result = read_one(db, patient_id)
    return result


def update(db: Session, patient_id: int, patient: PatientUpdate) -> PatientRead:
    result_orm = query_one(db, patient_id)

    _ = create_screening(
        db,
        patient_id,
        PatientScreeningCreate(
            neuro_diag=patient.neuro_diag,
            age_class=patient.age_class,
        ),
    )
    result_orm.details.home_address = patient.home_address
    result_orm.note.medical_notes = patient.medical_notes

    contacts.delete_many(db, patient_id)
    contacts.create_many(db, patient_id, patient.contacts)

    db.commit()

    result = read_one(db, patient_id)
    return result


def status(db: Session, patient_id: int) -> str:
    return "OK"


def create_screening(
    db: Session, patient_id: int, screening: PatientScreeningCreate
) -> PatientScreeningBase:
    result_orm = PatientScreening(
        neuro_diag=screening.neuro_diag,
        age_class=screening.age_class,
    )
    db.add(result_orm)
    db.refresh(result_orm)
    result = PatientScreeningBase.model_validate(result_orm)
    return result
