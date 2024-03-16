from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey, BigInteger
from sqlalchemy.orm import relationship
from db.base_class import Base  # Ensure correct import path
from .ticket_message import TicketMessage

class Ticket(Base):
    __tablename__ = 'tickets'

    ticket_id = Column(Integer, primary_key=True, autoincrement=True)
    install_num = Column(BigInteger, ForeignKey('patients.install_num'))
    ticket_open_time = Column(TIMESTAMP)
    ticket_close_time = Column(TIMESTAMP)
    status = Column(String(255))

    # Relationship back to the patient (using backref for simplicity)
    messages = relationship("TicketMessage", back_populates="ticket")