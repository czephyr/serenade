from sqlalchemy.orm import Session

from ..core.excp import unfoundable
from ..ormodels import PatientScreening, PatientFull
from ..schemas.patient_screening import PatientScreeningRead
from ..utils import to_age


@unfoundable("patient")
def read_one(db: Session, *, patient_id: str) -> PatientScreeningRead:
    result_orm = (
        db.query(PatientScreening)
        .where(PatientScreening.patient_id == patient_id)
        .order_by(PatientScreening.ts.desc())
        .first()
    )
    if result_orm is None:
        return PatientScreeningRead()

    result = PatientScreeningRead.model_validate(result_orm)

    # result_orm = db.query(PatientFull).where(PatientFull.patient_id == patient_id).one()
    # result = PatientScreeningRead(
    #     neuro_diag=(
    #         result_orm.screenings[-1].neuro_diag if result_orm.screenings else None
    #     ),
    #     age_class=(
    #         result_orm.screenings[-1].age_class if result_orm.screenings else None,
    #     ),
    # )

    return result


@unfoundable("patient")
def read_many(db: Session, *, patient_id: str) -> list[PatientScreeningRead]:
    results_orm = db.query(PatientScreening).where(
        PatientScreening.patient_id == patient_id
    )

    results = [
        PatientScreeningRead.model_validate(result_orm) for result_orm in results_orm
    ]
    return results


@unfoundable("patient")
def create(db: Session, *, patient_id: str) -> PatientScreeningRead:
    raise NotImplementedError
