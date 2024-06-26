from codicefiscale import codicefiscale as cf
from sqlalchemy.orm import Session

from ..core import crypto
from ..core.const import ADMIN_USERNAME, SMS_PATIENT_CREATE
from ..core.excp import (
    JHON_TITOR,
    BadValues,
    DuplicateCF,
    JhonTitor,
    john_titor,
    johntitorable,
    unfoundable,
)
from ..core.status import TICKET_INSTALLATION
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
    PatientInfo,
    PatientRead,
    PatientStatus,
    PatientUpdate,
)
from ..schemas.ticket import TicketCreate
from ..schemas.ticket_message import TicketMessageCreate
from ..utils import to_age, to_city
from . import installation_details, patient_contacts, tickets


@unfoundable("patient")
def query_one(db: Session, *, patient_id: str) -> PatientFull:
    result_orm = db.query(PatientFull).where(PatientFull.patient_id == patient_id).one()
    return result_orm


def delete(db: Session, *, patient_id: str) -> str:
    result_orm = query_one(db, patient_id=patient_id)
    db.delete(result_orm)
    db.commit()
    return patient_id


def read_one(db: Session, *, patient_id: str) -> PatientRead:
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
        neuro_diag=result_orm.screening.neuro_diag,
        # Contact
        contacts=[
            ContactEntry.model_validate(contact) for contact in result_orm.contacts
        ],
        # DATES
        date_join=result_orm.date_join,
        date_exit=result_orm.date_exit,
    )
    return result


def read_many(db: Session) -> list[PatientStatus]:
    results_orm = db.query(PatientFull).all()
    results = [
        PatientStatus(
            first_name=result_orm.details.first_name,
            last_name=result_orm.details.last_name,
            neuro_diag=result_orm.screening.neuro_diag,
            patient_id=result_orm.patient_id,
            status=installation_details.read_status(
                db, patient_id=result_orm.patient_id
            ),
            hue=crypto.hue(result_orm.patient_id),
            date_join=result_orm.date_join,
            date_exit=result_orm.date_exit,
        )
        for result_orm in results_orm
    ]
    return results


@johntitorable
def create(db: Session, *, patient: PatientCreate) -> PatientRead:
    if not cf.is_valid(patient.codice_fiscale):
        raise BadValues("Invalid codice_fiscale")
    patient.codice_fiscale = "".join(filter(str.isalnum, patient.codice_fiscale))

    if john_titor(patient.date_join, patient.date_exit):
        raise JhonTitor(
            JHON_TITOR.format(
                prev_key="date_join",
                prev_value=patient.date_join,
                curr_key="date_exit",
                curr_value=patient.date_exit,
            )
        )

    if (
        db.query(PatientNote)
        .where(PatientNote.codice_fiscale == patient.codice_fiscale)
        .count()
    ):
        raise DuplicateCF

    while True:
        patient_id = crypto.draw()
        if not db.query(Patient).where(Patient.patient_id == patient_id).count():
            break

    patient_orm = Patient(
        patient_id=patient_id,
        date_join=patient.date_join,
        date_exit=patient.date_exit,
    )
    detail_orm = PatientDetail(
        patient_id=patient_id,
        first_name=patient.first_name,
        last_name=patient.last_name,
        home_address=patient.home_address,
    )
    note_orm = PatientNote(
        patient_id=patient_id,
        codice_fiscale=patient.codice_fiscale,
        medical_notes=patient.medical_notes,
    )
    db.add_all([detail_orm, note_orm, patient_orm])
    db.commit()

    current_age = to_age(patient.codice_fiscale)
    age_class = "<75" if current_age < 75 else ("75-85" if current_age < 85 else "85+")

    screening_orm = PatientScreening(
        patient_id=patient_id,
        neuro_diag=patient.neuro_diag,
        age_class=age_class,
    )
    db.add(screening_orm)
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
        category=TICKET_INSTALLATION,
    )

    tickets.create(
        db,
        patient_id=patient_id,
        ticket=ticket,
    )

    result = read_one(db, patient_id=patient_id)
    return result


@johntitorable
def update(db: Session, *, patient_id: str, patient: PatientUpdate) -> PatientRead:
    result_orm = query_one(db, patient_id=patient_id)
    kw = patient.model_dump(exclude_unset=True)

    date_join = result_orm.date_join if "date_join" not in kw else kw["date_join"]
    date_exit = result_orm.date_exit if "date_exit" not in kw else kw["date_exit"]
    if john_titor(date_join, date_exit):
        raise JhonTitor(
            JHON_TITOR.format(
                prev_key="date_join",
                prev_value=date_join,
                curr_key="date_exit",
                curr_value=date_exit,
            )
        )

    result_orm.date_join = date_join
    result_orm.date_exit = date_exit

    if "home_address" in kw:
        result_orm.details.home_address = patient.home_address
    if "medical_notes" in kw:
        result_orm.note.medical_notes = patient.medical_notes

    db.commit()

    result = read_one(db, patient_id=patient_id)
    return result


@unfoundable("patient")
def info(db: Session, *, patient_id: str) -> PatientInfo:
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
