from sqlalchemy import Column, BigInteger, String, Text, TIMESTAMP
from sqlalchemy.orm import relationship
from db.base_class import Base  # Ensure correct import path
from .notes import Note


class Patient(Base):
    __tablename__ = 'patients'

    patient_id = Column(BigInteger, unique=True)
    first_name = Column(String(255))
    last_name = Column(String(255))
    cf = Column(String(255), primary_key=True)
    address = Column(Text)
    contact = Column(String(255))
    medical_notes = Column(String(255))
    install_num = Column(BigInteger, unique=True)
    creation_time = Column(TIMESTAMP)

    # Relationships (adjust according to your actual application logic and requirements)
    notes = relationship("Note", backref="patient")
    tickets = relationship("Ticket", backref="patient")