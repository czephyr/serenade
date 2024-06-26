import random

import arlecchino
from codicefiscale import codicefiscale as cf
from sqlalchemy.orm import Session

from ..core.const import ADMIN_USERNAME, SALT_HASH, SMS_PATIENT_CREATE
from ..core.excp import BadValues, DuplicateCF
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
    PatientStatus,
    PatientUpdate,
    PatientInfo,
)
from ..schemas.ticket import TicketCreate
from ..schemas.ticket_message import TicketMessageCreate
from ..utils import to_age, to_city, unfoundable
from . import patient_contacts, tickets, installation_details


@unfoundable("patient")
def query_one(db: Session, *, patient_id: int) -> PatientFull:
    result_orm = db.query(PatientFull).where(PatientFull.patient_id == patient_id).one()
    return result_orm


def read_one(db: Session, *, patient_id: int) -> PatientRead:
    result_orm = query_one(db, patient_id=patient_id)
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
        age=to_age(codice_fiscale),
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


def read_many(db: Session) -> list[PatientStatus]:
    results_orm = db.query(PatientFull).all()
    results = [
        PatientStatus(
            first_name=result_orm.details.first_name,
            last_name=result_orm.details.last_name,
            neuro_diag=(
                result_orm.screenings[-1].neuro_diag if result_orm.screenings else None
            ),
            patient_id=result_orm.patient_id,
            status=installation_details.status(db, patient_id=result_orm.patient_id),
            hue=arlecchino.draw(result_orm.patient_id, SALT_HASH),
        )
        for result_orm in results_orm
    ]
    return results


def create(db: Session, *, patient: PatientCreate) -> PatientRead:
    if not cf.is_valid(patient.codice_fiscale):
        raise BadValues("Invalid codice_fiscale")

    if (
        db.query(PatientNote)
        .where(PatientNote.codice_fiscale == patient.codice_fiscale)
        .count()
    ):
        raise DuplicateCF

    while True:
        patient_id = random.randrange(2**1, 2**52)
        if not db.query(Patient).where(Patient.patient_id == patient_id).count():
            break

    patient_orm = Patient(
        patient_id=patient_id,
        date_join=patient.date_join,
        date_exit=patient.date_exit,
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

    db.commit()

    if patient.contacts is not None:
        _ = patient_contacts.create_many(
            db,
            patient_id=patient_id,
            contacts=patient.contacts,
        )

    ticket = TicketCreate(
        message=TicketMessageCreate(
            body=SMS_PATIENT_CREATE,
            sender=ADMIN_USERNAME,
        ),
        category="PRIMA INSTALLAZIONE",
    )

    tickets.create(
        db,
        patient_id=patient_id,
        ticket=ticket,
    )

    result = read_one(db, patient_id=patient_id)
    return result


def update(db: Session, *, patient_id: int, patient: PatientUpdate) -> PatientRead:
    result_orm = query_one(db, patient_id=patient_id)

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

    if "date_join" in kw:
        result_orm.date_join = patient.date_join
    if "date_exit" in kw:
        result_orm.date_exit = patient.date_exit

    if "first_name" in kw:
        if not patient.first_name:
            raise BadValues("first_name cannot be empty")
        result_orm.details.first_name = patient.first_name

    if "last_name" in kw:
        if not patient.last_name:
            raise BadValues("last_name cannot be empty")
        result_orm.details.last_name = patient.last_name

    db.commit()

    result = read_one(db, patient_id=patient_id)
    return result


@unfoundable("patient")
def info(db: Session, *, patient_id: int) -> PatientInfo:
    result_orm = (
        db.query(PatientDetail).where(PatientDetail.patient_id == patient_id).one()
    )
    result = PatientInfo(
        first_name=result_orm.first_name,
        last_name=result_orm.last_name,
        home_address=result_orm.home_address,
        contacts=patient_contacts.read_many(db, patient_id=patient_id),
    )
    return result
