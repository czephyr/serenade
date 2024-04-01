from sqlalchemy.orm import Session
from typing import Optional

from models.notes import Note
from schemas.note import NoteCreate

def create_note(db: Session, note_create: NoteCreate):
    db_note = Note(
        install_num=note_create.install_num,
        install_notes=note_create.install_notes
    )
    db.add(db_note)
    db.commit()
    return db_note