from sqlalchemy import Column, BigInteger, String, Text, TIMESTAMP
from sqlalchemy.orm import relationship
from ..db.base_class import Base  # Ensure correct import path
from sqlalchemy import Column, BigInteger, String, Text, Boolean, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship


# class Patient(Base):
#     __tablename__ = 'patients'

#     patient_id = Column(BigInteger, unique=True)
#     first_name = Column(String(255))
#     last_name = Column(String(255))
#     cf = Column(String(255), primary_key=True)
#     address = Column(Text)
#     contact = Column(String(255))
#     medical_notes = Column(String(255))
#     install_num = Column(BigInteger, unique=True)
#     creation_time = Column(TIMESTAMP)

#     # Relationships (adjust according to your actual application logic and requirements)
#     notes = relationship("Note", backref="patient")
#     tickets = relationship("Ticket", backref="patient")

class Patient(Base):
    __tablename__ = 'patients'

    patient_id = Column(BigInteger, unique=True)
    age_range = Column(String(255))  # e.g., "65-74", "75-84", "85+"
    full_name = Column(String(255))
    cf = Column(String(255), primary_key=True)
    address = Column(Text)
    phone_number = Column(String(255))
    contact = Column(String(255))
    medical_notes = Column(Text)

    # Define a one-to-one relationship to PatientNon
    non_identifying_data = relationship("PatientNon", back_populates="patient", uselist=False)

class PatientNon(Base):
    __tablename__ = 'patients_non'

    patient_id = Column(BigInteger, ForeignKey('patients.patient_id'), unique=True)
    install_num = Column(BigInteger, unique=True)
    neurodegen = Column(Boolean)
    apartment_type = Column(String(255))  # e.g., "two-room", "three-room"
    wifi = Column(Boolean)
    other_subjects_in_home = Column(Text)
    smartphone_model = Column(String(255))
    creation_time = Column(TIMESTAMP)

    # Link back to the Patient model for a one-to-one relationship
    patient = relationship("Patient", back_populates="patients_non",uselist=False)
    installation = relationship("Installation", back_populates="patient_non", uselist=False)