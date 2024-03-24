from sqlalchemy.orm import Session

from ..ormodels import Patient
from ..schemas.installation import InstallationBase, InstallationIIT, InstallationIMT
from . import patients
from ..core import roles


def read_one(
    db: Session, install_num: int, role: str
) -> InstallationIIT | InstallationIMT:
    result_orm = db.query(Patient).filter(Patient.install_num == install_num).one()
    match role:
        case roles.IIT:
            result = InstallationIIT.model_validate(result_orm)
        case roles.IMT:
            result = InstallationIMT.model_validate(result_orm)
        case _:
            raise ValueError(f"role `{role}` is not allowed in this context")

    return result


def read_many(
    db: Session, *, skip: int = 0, limit: int = 100
) -> list[InstallationBase]:
    results_orm = patients.read_many(db, skip=skip, limit=limit)
    result = [InstallationBase.model_validate(r) for r in results_orm]
    return result
