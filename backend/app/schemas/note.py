from pydantic import BaseModel

class NoteBase(BaseModel):
    install_notes: str
    install_num: int

class NoteCreate(NoteBase):
    pass

class NoteUpdate(NoteBase):
    pass

class Note(NoteBase):
    
    class Config:
        orm_mode = True
