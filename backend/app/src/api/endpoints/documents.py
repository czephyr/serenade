from fastapi import APIRouter, Depends, Response, UploadFile
from sqlalchemy.orm import Session

from ...api.deps import get_db, require_role
from ...core.crypto import maskable
from ...core.roles import IIT, IMT, UNIMI
from ...crud import installation_documents
from ...schemas.installation_document import InstallationDocumentRead

router = APIRouter()


@router.get("/documents/{document_id}")
def download(
    document_id: int,
    role: str = Depends(require_role([IIT, IMT, UNIMI])),
    db: Session = Depends(get_db),
) -> Response:
    result = installation_documents.download(db, document_id=document_id)
    response = Response(result)
    return response


@router.delete("/documents/{document_id}", response_model=InstallationDocumentRead)
def delete(
    document_id: int,
    role: str = Depends(require_role([IIT])),
    db: Session = Depends(get_db),
) -> InstallationDocumentRead:
    result = installation_documents.delete(db, document_id=document_id)
    return result


@router.post(
    "/installations/{patient_id}/documents", response_model=InstallationDocumentRead
)
async def upload(
    patient_id: str,
    file: UploadFile,
    file_type: str | None = None,
    file_name: str | None = None,
    role: str = Depends(require_role([IIT])),
    db: Session = Depends(get_db),
) -> InstallationDocumentRead:
    contents = await file.read()
    result = maskable(installation_documents.create, role)(
        db,
        patient_id=patient_id,
        file=contents,
        file_type=file_type,
        file_name=file_name,
    )
    return result


@router.get(
    "/installations/{patient_id}/documents",
    response_model=list[InstallationDocumentRead],
)
async def read_many(
    patient_id: str,
    role: str = Depends(require_role([IIT, IMT, UNIMI])),
    db: Session = Depends(get_db),
) -> list[InstallationDocumentRead]:
    result = maskable(installation_documents.read_many, role)(db, patient_id=patient_id)
    return result
