from sqlalchemy import Column, LargeBinary, String, Text, TIMESTAMP
from sqlalchemy.orm import relationship
from db.base_class import Base  # Ensure correct import path

class Patient(Base):
    __tablename__ = 'patients'

    patient_id = Column(LargeBinary, unique=True)
    first_name = Column(String(255))
    last_name = Column(String(255))
    cf = Column(String(255), primary_key=True)
    address = Column(Text)
    contact = Column(String(255))
    medical_notes = Column(String(255))
    install_num = Column(LargeBinary, unique=True)
    install_time = Column(TIMESTAMP)

    # Relationships (adjust according to your actual application logic and requirements)
    notes = relationship("Note", backref="patient")
    tickets = relationship("Ticket", backref="patient")