from sqlalchemy.orm import Session

from ..ormodels import Contact
from ..schemas.contact import ContactEntry, ContactCreate


def query_many(db: Session, patient_id: int) -> list[Contact]:
    results_orm = db.query(Contact).where(Contact.patient_id == patient_id).all()
    return results_orm


def read_many(db: Session, patient_id: int) -> list[ContactEntry]:
    results_orm = query_many(db, patient_id)
    result = [ContactEntry.model_validate(result_orm) for result_orm in results_orm]
    return result


def delete_many(db: Session, patient_id: int) -> list[ContactEntry]:
    results_orm = query_many(db, patient_id)
    result = [ContactEntry.model_validate(result_orm) for result_orm in results_orm]
    db.delete(results_orm)
    return result


def create_many(db: Session, patient_id: int, contacts: list[ContactCreate]):
    for contact in contacts:
        result_orm = Contact(
            patient_id=patient_id,
            alias=contact.alias,
            phone_no=contact.phone_no,
        )
        db.add(result_orm)

    db.commit()

    result = read_many(db, patient_id)
    return result
