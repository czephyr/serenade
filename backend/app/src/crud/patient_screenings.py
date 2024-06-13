from sqlalchemy.orm import Session

from ..core.excp import unfoundable
from ..ormodels import PatientScreening
from ..schemas.patient_screening import PatientScreeningRead


@unfoundable("patient")
def read_screening(db: Session, *, patient_id: str) -> PatientScreeningRead:
    result_orm = (
        db.query(PatientScreening)
        .where(PatientScreening.patient_id == patient_id)
        .one()
    )

    result = PatientScreeningRead.model_validate(result_orm)
    return result
