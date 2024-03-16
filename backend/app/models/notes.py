from sqlalchemy import Column, BigInteger, String, ForeignKey
from sqlalchemy.orm import relationship
from db.base_class import Base  # Ensure correct import path
class Note(Base):
    __tablename__ = 'notes'

    install_num = Column(BigInteger, ForeignKey('patients.install_num'), primary_key=True)
    install_notes = Column(String(255))