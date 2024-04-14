from fastapi import APIRouter, Depends, HTTPException, Response, UploadFile, status
from sqlalchemy.exc import NoResultFound
from sqlalchemy.orm import Session

from ...api.deps import get_db, require_role
from ...core.roles import IIT, IMT, UNIMI
from ...crud import installation_documents
from ...schemas.installation_document import InstallationDocumentRead

router = APIRouter()


@router.get("/documents/{document_id}")
def download(
    document_id: int,
    current_user: dict = Depends(require_role([IIT, IMT, UNIMI])),
    db: Session = Depends(get_db),
) -> Response:
    try:
        result = installation_documents.download(db, document_id)
    except NoResultFound as excp:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail=f"No documents available",
        ) from excp
    else:
        response = Response(result)
        return response


@router.delete("/documents/{document_id}", response_model=InstallationDocumentRead)
def delete(
    document_id: int,
    current_user: dict = Depends(require_role([IIT, IMT, UNIMI])),
    db: Session = Depends(get_db),
) -> InstallationDocumentRead:
    try:
        result = installation_documents.delete(db, document_id)
    except NoResultFound as excp:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail=f"No documents available",
        ) from excp
    else:
        return result


@router.post(
    "/installations/{patient_id}/documents", response_model=InstallationDocumentRead
)
async def upload(
    patient_id: int,
    file: UploadFile,
    file_type: str | None = None,
    file_name: str | None = None,
    current_user: dict = Depends(require_role([IIT])),
    db: Session = Depends(get_db),
) -> InstallationDocumentRead:
    contents = await file.read()
    result = installation_documents.create(
        db,
        patient_id,
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
    patient_id: int,
    current_user: dict = Depends(require_role([IIT])),
    db: Session = Depends(get_db),
) -> list[InstallationDocumentRead]:
    result = installation_documents.read_many(db, patient_id)
    return result
