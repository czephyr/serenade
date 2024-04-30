from sqlalchemy.orm import Session

from ..ormodels import InstallationDocument
from ..schemas.installation_document import InstallationDocumentRead
from ..utils import unfoundable


@unfoundable("document")
def query_one(db: Session, *, document_id: int) -> InstallationDocument:
    result_orm = (
        db.query(InstallationDocument)
        .where(InstallationDocument.document_id == document_id)
        .one()
    )
    return result_orm


def download(db: Session, *, document_id: int) -> bytes:
    result_orm = query_one(db, document_id=document_id)
    result = result_orm.file_content
    return result


def create(
    db: Session,
    *,
    patient_id: int,
    file: bytes,
    file_type: str | None = None,
    file_name: str | None = None,
) -> InstallationDocumentRead:
    result_orm = InstallationDocument(
        patient_id=patient_id,
        file_name=file_name,
        file_type=file_type,
        file_content=file,
    )

    db.add(result_orm)
    db.commit()
    db.refresh(result_orm)

    result = InstallationDocumentRead.model_validate(result_orm)
    return result


@unfoundable("patient")
def read_many(db: Session, *, patient_id: int) -> list[InstallationDocumentRead]:
    results_orm = (
        db.query(InstallationDocument)
        .where(InstallationDocument.patient_id == patient_id)
        .all()
    )
    results = [
        InstallationDocumentRead.model_validate(result_orm)
        for result_orm in results_orm
    ]
    return results


def delete(db: Session, *, document_id: int) -> InstallationDocumentRead:
    result_orm = query_one(db, document_id=document_id)
    db.delete(result_orm)
    db.commit()
    result = InstallationDocumentRead.model_validate(result_orm)
    return result
