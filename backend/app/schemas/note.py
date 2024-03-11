from pydantic import BaseModel
from typing import Optional

class NoteBase(BaseModel):
    install_notes: str

class NoteCreate(NoteBase):
    pass

class NoteUpdate(NoteBase):
    pass

class Note(NoteBase):
    install_num: int  # Assuming install_num is used as an ID here

    class Config:
        orm_mode = True
