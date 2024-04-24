from sqlalchemy.orm import Session

from ..ormodels import Contact
from ..schemas.contact import ContactEntry, ContactUpdate


def query_one(db: Session, *, contact_id: int) -> Contact:
    result_orm = db.query(Contact).where(Contact.id == contact_id).one()
    return result_orm


def read_one(db: Session, *, contact_id: int) -> ContactEntry:
    result_orm = query_one(db, contact_id=contact_id)
    result = ContactEntry.model_validate(result_orm)
    return result


def update_one(db: Session, *, contact_id: int, contact: ContactUpdate) -> ContactEntry:
    result_orm = query_one(db, contact_id=contact_id)
    kw = contact.model_dump(exclude_unset=True)
    for k, v in kw.items():
        setattr(result_orm, k, v)
    db.commit()

    db.refresh(result_orm)

    result = ContactEntry.model_validate(result_orm)
    return result


def delete_one(db: Session, *, contact_id: int) -> ContactEntry:
    result_orm = query_one(db, contact_id=contact_id)
    result = ContactEntry.model_validate(result_orm)
    db.delete(result_orm)
    db.commit()
    return result
