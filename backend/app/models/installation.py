from sqlalchemy import create_engine, Column, BigInteger, Integer, String, Text, LargeBinary, TIMESTAMP
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from ..db.base_class import Base

class Installation(Base):
    __tablename__ = 'installation'

    id = Column(Integer, primary_key=True, autoincrement=True)
    home_map = Column(LargeBinary)  # For storing PDF as binary data
    smart_plug_appliances = Column(Text)  # List of home appliances connected to smart plugs
    technical_problems_notes = Column(Text)  # Notes on technical problems
    subject_specific_habits_notes = Column(Text)  # Non-identifying notes about the subject
    cognitive_tests_timing_notes = Column(Text)  # Notes on preferred times for triggering cognitive tests
    created_at = Column(TIMESTAMP, default=func.current_timestamp())
    updated_at = Column(TIMESTAMP, default=func.current_timestamp(), onupdate=func.current_timestamp())

    patient_non_id = Column(BigInteger, ForeignKey('patients_non.patient_id'), unique=True)

    # Define a one-to-one relationship
    patient_non = relationship("PatientNon", back_populates="installation", uselist=False)
