from sqlalchemy import TIMESTAMP, BigInteger, Column, ForeignKey, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()


class Patient(Base):
    __tablename__ = "patients"

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


class Ticket(Base):
    __tablename__ = "tickets"

    ticket_id = Column(Integer, primary_key=True, autoincrement=True)
    install_num = Column(BigInteger, ForeignKey(Patient.install_num))
    ticket_open_time = Column(TIMESTAMP)
    ticket_close_time = Column(TIMESTAMP)
    status = Column(String(255))

    # Relationship back to the patient (using backref for simplicity)
    messages = relationship("TicketMessage", back_populates="ticket")


class TicketMessage(Base):
    __tablename__ = "ticket_messages"

    message_id = Column(Integer, primary_key=True, autoincrement=True)
    message_time = Column(TIMESTAMP)
    sender = Column(String(255))
    ticket_id = Column(Integer, ForeignKey("tickets.ticket_id"))

    ticket = relationship("Ticket", back_populates="messages")


