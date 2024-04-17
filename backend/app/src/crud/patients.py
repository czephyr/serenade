import random

import arlecchino
from codicefiscale import codicefiscale as cf
from sqlalchemy.orm import Session

from ..core.const import ADMIN_USERNAME, SALT_HASH, SMS_PATIENT_CREATE
from ..core.excp import DuplicateCF
from ..core.status import (
    INSTALLATION_CLOSED,
    INSTALLATION_CLOSING,
    INSTALLATION_OPEN,
    INSTALLATION_OPENING,
    INSTALLATION_PAUSE,
    INSTALLATION_UNKNOW,
    TICKET_CLOSED,
)
from ..ormodels import (
    Patient,
    PatientDetail,
    PatientFull,
    PatientNote,
    PatientScreening,
)
from ..schemas.contact import ContactEntry
from ..schemas.patient import PatientCreate, PatientRead, PatientStatus, PatientUpdate
from ..schemas.ticket import TicketCreate
from ..schemas.ticket_message import TicketMessageCreate
from ..utils import to_age, to_city
from . import patient_contacts, tickets


def query_one(db: Session, patient_id: int) -> PatientFull:
    result_orm = db.query(PatientFull).where(PatientFull.patient_id == patient_id).one()
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
        date_of_birth=cf.decode(codice_fiscale)["birthdate"],
        place_of_birth=to_city(codice_fiscale),
        # PatientScreening
        neuro_diag=(
            result_orm.screenings[-1].neuro_diag if result_orm.screenings else None
        ),
        age_class=(
            result_orm.screenings[-1].age_class if result_orm.screenings else None
        ),
        # Contact
        contacts=[
            ContactEntry.model_validate(contact) for contact in result_orm.contacts
        ],
    )
    return result


def read_many(db: Session, *, skip: int = 0, limit: int = 100) -> list[PatientStatus]:
    results_orm = db.query(PatientFull).offset(skip).limit(limit).all()
    results = [
        PatientStatus(
            first_name=result_orm.details.first_name,
            last_name=result_orm.details.last_name,
            age=to_age(result_orm.note.codice_fiscale),
            patient_id=result_orm.patient_id,
            status=status(db, patient_id=result_orm.patient_id),
            hue=arlecchino.draw(result_orm.patient_id, SALT_HASH),
        )
        for result_orm in results_orm
    ]
    return results


def create(db: Session, patient: PatientCreate) -> PatientRead:
    if (
        db.query(PatientNote)
        .where(PatientNote.codice_fiscale == patient.codice_fiscale)
        .count()
    ):
        raise DuplicateCF

    while True:
        patient_id = int.from_bytes(random.randbytes(7), byteorder="little")
        if not db.query(Patient).where(Patient.patient_id == patient_id).count():
            break

    patient_orm = Patient(
        patient_id=patient_id,
    )
    db.add(patient_orm)
    db.commit()

    result_orm = PatientDetail(
        patient_id=patient_id,
        first_name=patient.first_name,
        last_name=patient.last_name,
        home_address=patient.home_address,
    )
    db.add(result_orm)

    result_orm = PatientScreening(
        patient_id=patient_id,
        neuro_diag=patient.neuro_diag,
        age_class=patient.age_class,
    )
    db.add(result_orm)

    result_orm = PatientNote(
        patient_id=patient_id,
        codice_fiscale=patient.codice_fiscale,
        medical_notes=patient.medical_notes,
    )
    db.add(result_orm)

    if patient.contacts is not None:
        _ = patient_contacts.create_many(db, patient_id, patient.contacts)

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

    kw = patient.model_dump(exclude_unset=True)

    if any([e in kw for e in ("neuro_diag", "age_class")]):
        screening_orm = PatientScreening(
            patient_id=patient_id,
            neuro_diag=patient.neuro_diag,
            age_class=patient.age_class,
        )
        if result_orm.screenings:
            if "nuero_diag" not in kw:
                screening_orm.neuro_diag = result_orm.screenings[-1].neuro_diag
            if "age_class" not in kw:
                screening_orm.age_class = result_orm.screenings[-1].age_class
        db.add(screening_orm)

    if "home_address" in kw:
        result_orm.details.home_address = patient.home_address
    if "medical_notes" in kw:
        result_orm.note.medical_notes = patient.medical_notes

    db.commit()

    result = read_one(db, patient_id)
    return result


def status(db: Session, patient_id: int) -> str:
    result_orm = query_one(db, patient_id)
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
