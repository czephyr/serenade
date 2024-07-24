from sqlalchemy.orm import Session

from ..ormodels import Contact
from ..schemas.contact import ContactEntry, ContactCreate

from .contacts import read_one
from ..core.excp import unfoundable


@unfoundable("patient")
def query_many(db: Session, *, patient_id: str) -> list[Contact]:
    results_orm = db.query(Contact).where(Contact.patient_id == patient_id).all()
    return results_orm


def read_many(db: Session, *, patient_id: str) -> list[ContactEntry]:
    results_orm = query_many(db, patient_id=patient_id)
    result = [ContactEntry.model_validate(result_orm) for result_orm in results_orm]
    return result


@unfoundable("patient")
def create_one(db: Session, *, patient_id: str, contact: ContactCreate) -> ContactEntry:
    kw = contact.model_dump(exclude_unset=True)
    result_orm = Contact(**kw)
    result_orm.patient_id = patient_id
    db.add(result_orm)
    db.commit()

    result = read_one(db, contact_id=result_orm.id)
    return result


@unfoundable("patient")
def create_many(
    db: Session, *, patient_id: str, contacts: list[ContactCreate]
) -> list[ContactEntry]:
    for contact in contacts:
        kw = contact.model_dump(exclude_unset=True)
        result_orm = Contact(**kw)
        result_orm.patient_id = patient_id
        db.add(result_orm)

    db.commit()

    result = read_many(db, patient_id=patient_id)
    return result


def delete_many(db: Session, *, patient_id: str) -> list[ContactEntry]:
    results_orm = query_many(db, patient_id=patient_id)
    result = [ContactEntry.model_validate(result_orm) for result_orm in results_orm]
    db.delete(results_orm)
    db.commit()
    return result
