from pydantic import BaseModel, ConfigDict

from datetime import datetime


class NoteBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    creation_time: datetime
    install_notes: str
    install_num: int


class NoteCreate(BaseModel):
    install_notes: str
    install_num: int
