from datetime import datetime

from sqlalchemy import (TIMESTAMP, BigInteger, Column, ForeignKey, Integer,
                        String, Text)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

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

    ts: Mapped[datetime] = mapped_column(default=datetime.now)
    ticket_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    patient_id: Mapped[int] = mapped_column(ForeignKey("patients.patient_id"))
    date_closed: Mapped[datetime | None]

    patient: Mapped[Patient] = relationship()
    messages: Mapped[list["TicketMessage"]] = relationship(back_populates="ticket")


class TicketMessage(Base):
    __tablename__ = "ticket_messages"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    ts: Mapped[datetime] = mapped_column(default=datetime.now)
    sender: Mapped[str]
    body: Mapped[str]
    ticket_id: Mapped[int] = mapped_column(ForeignKey("tickets.ticket_id"))

    ticket: Mapped["Ticket"] = relationship(back_populates="messages")
