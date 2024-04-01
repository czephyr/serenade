from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from db.base_class import Base  # Ensure correct import path

class TicketMessage(Base):
    __tablename__ = 'ticket_messages'

    message_id = Column(Integer, primary_key=True, autoincrement=True)
    message_time = Column(TIMESTAMP)
    sender = Column(String(255))
    ticket_id = Column(Integer, ForeignKey('tickets.ticket_id'))
    
    ticket = relationship("Ticket", back_populates="messages")