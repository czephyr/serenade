from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ...api.deps import get_db, require_role
from ...core.roles import HOS, IIT
from ...crud import contacts
from ...schemas.contact import ContactEntry, ContactUpdate

router = APIRouter()


@router.get("/{contact_id}", response_model=ContactEntry)
def read_one(
    contact_id: int,
    role: str = Depends(require_role([IIT, HOS])),
    db: Session = Depends(get_db),
) -> ContactEntry:
    result = contacts.read_one(db, contact_id=contact_id)
    return result


@router.put("/{contact_id}", response_model=ContactEntry)
def update(
    contact_id: int,
    contact: ContactUpdate,
    role: str = Depends(require_role([IIT, HOS])),
    db: Session = Depends(get_db),
) -> ContactEntry:
    result = contacts.update_one(db, contact_id=contact_id, contact=contact)
    return result


@router.delete("/{contact_id}", response_model=ContactEntry)
def delete(
    contact_id: int,
    role: str = Depends(require_role([IIT, HOS])),
    db: Session = Depends(get_db),
) -> ContactEntry:
    result = contacts.delete_one(db, contact_id=contact_id)
    return result
