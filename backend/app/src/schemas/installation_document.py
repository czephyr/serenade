from datetime import datetime

from pydantic import BaseModel, ConfigDict


class InstallationDocumentBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    document_id: int
    ts: datetime
    patient_id: int
    file_name: str | None
    file_type: str | None
    file_content: bytes


class InstallationDocumentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    document_id: int
    ts: datetime
    file_name: str | None
    file_type: str | None
