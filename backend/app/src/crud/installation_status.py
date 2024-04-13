from sqlalchemy.orm import Session

from ..schemas.installation import InstallationStatus
from . import tickets, installations


def read_one(db: Session, install_num: int, role: str) -> InstallationStatus:
    result_parent = installations.read_one(db, install_num, role)
    arguments = result_parent.model_dump()
    result = InstallationStatus(
        **arguments,
        status=tickets.status(db, install_num),
        tickets_list=tickets.read_many(db, install_num),
    )
    return result
