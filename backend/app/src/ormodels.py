from datetime import datetime

from sqlalchemy import BigInteger, ForeignKey, MetaData, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from typing_extensions import Annotated

bigint = Annotated[int, "bigint"]
_metadata = MetaData()


class Base(DeclarativeBase):
    metadata = _metadata
    type_annotation_map = {
        str: String().with_variant(String(255), "mysql", "mariadb"),
        bigint: BigInteger(),
    }


class Patient(Base):
    __tablename__ = "patients"

    ts: Mapped[datetime] = mapped_column(default=datetime.now)
    patient_id: Mapped[bigint] = mapped_column(primary_key=True)
    date_start: Mapped[datetime | None]
    date_end: Mapped[datetime | None]


class PatientFull(Patient):
    details: Mapped["PatientDetail"] = relationship(back_populates="patient")
    screenings: Mapped[list["PatientScreening"]] = relationship(
        back_populates="patient"
    )
    note: Mapped["PatientNote"] = relationship(back_populates="patient")
    contacts: Mapped[list["Contact"]] = relationship(back_populates="patient")
    installations: Mapped[list["InstallationDetail"]] = relationship(
        back_populates="patient"
    )
    tickets: Mapped[list["Ticket"]] = relationship(back_populates="patient")


class PatientDetail(Base):
    __tablename__ = "patient_details"

    patient_id: Mapped[bigint] = mapped_column(
        ForeignKey("patients.patient_id"), primary_key=True
    )

    first_name: Mapped[str]
    last_name: Mapped[str]
    home_address: Mapped[str | None]

    patient: Mapped[Patient] = relationship()


class PatientScreening(Base):
    __tablename__ = "patient_screenings"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    ts: Mapped[datetime] = mapped_column(default=datetime.now)
    patient_id: Mapped[bigint] = mapped_column(ForeignKey("patients.patient_id"))
    neuro_diag: Mapped[str | None]
    age_class: Mapped[str | None]

    patient: Mapped[Patient] = relationship()


class PatientNote(Base):
    __tablename__ = "patient_notes"

    patient_id: Mapped[bigint] = mapped_column(
        ForeignKey("patients.patient_id"), primary_key=True
    )
    codice_fiscale: Mapped[str] = mapped_column(unique=True)
    medical_notes: Mapped[str | None]

    patient: Mapped[Patient] = relationship()


class Contact(Base):
    __tablename__ = "contacts"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    patient_id: Mapped[bigint] = mapped_column(ForeignKey("patients.patient_id"))
    alias: Mapped[str | None]
    phone_no: Mapped[str]

    patient: Mapped[Patient] = relationship()


class InstallationDetail(Base):
    __tablename__ = "installation_details"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    ts: Mapped[datetime] = mapped_column(default=datetime.now)
    patient_id: Mapped[bigint] = mapped_column(ForeignKey("patients.patient_id"))

    apartment_type: Mapped[str | None]
    internet_type: Mapped[str | None]
    flatmates: Mapped[str | None]
    pets: Mapped[str | None]
    visitors: Mapped[str | None]
    smartphone_model: Mapped[str | None]
    house_map: Mapped[str | None]
    appliances: Mapped[str | None]
    issues_notes: Mapped[str | None]
    habits_notes: Mapped[str | None]
    other_notes: Mapped[str | None]

    patient: Mapped[Patient] = relationship()


class TicketMessage(Base):
    __tablename__ = "ticket_messages"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    ts: Mapped[datetime] = mapped_column(default=datetime.now)
    sender: Mapped[str]
    body: Mapped[str]
    ticket_id: Mapped[int] = mapped_column(ForeignKey("tickets.ticket_id"))

    ticket: Mapped["Ticket"] = relationship(back_populates="messages")


class Ticket(Base):
    __tablename__ = "tickets"

    ts: Mapped[datetime] = mapped_column(default=datetime.now)
    ticket_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    patient_id: Mapped[bigint] = mapped_column(ForeignKey("patients.patient_id"))
    date_closed: Mapped[datetime | None]

    patient: Mapped[Patient] = relationship()
    messages: Mapped[list[TicketMessage]] = relationship(back_populates="ticket")
