from sqlalchemy.orm import Session

from ..schemas.patient import PatientStatus
from . import patients, tickets
from ..utils import to_age


def read_many(db: Session, *, skip: int = 0, limit: int = 100) -> list[PatientStatus]:
    _patients = patients.read_many(db, skip=skip, limit=limit)
    results = [
        PatientStatus(
            first_name=patient.first_name,
            last_name=patient.last_name,
            age=to_age(patient.cf),
            patient_id=patient.patient_id,
            status=tickets.status(db, patient.install_num),
        )
        for patient in _patients
    ]
    return results
