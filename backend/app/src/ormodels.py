from datetime import datetime

from sqlalchemy import BigInteger, ForeignKey, MetaData
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from typing_extensions import Annotated

bigint = Annotated[int, "bigint"]
_metadata = MetaData()


class Base(DeclarativeBase):
    metadata = _metadata
    type_annotation_map = {
        bigint: BigInteger(),
    }


class Patient(Base):
    __tablename__ = "patients"

    ts: Mapped[datetime] = mapped_column(default=datetime.now)
    patient_id: Mapped[str] = mapped_column(primary_key=True)
    date_join: Mapped[datetime | None]
    date_exit: Mapped[datetime | None]


class PatientFull(Patient):
    details: Mapped["PatientDetail"] = relationship(
        back_populates="patient", cascade="all,delete"
    )
    screening: Mapped["PatientScreening"] = relationship(
        back_populates="patient", cascade="all,delete"
    )
    note: Mapped["PatientNote"] = relationship(
        back_populates="patient", cascade="all,delete"
    )
    contacts: Mapped[list["Contact"]] = relationship(
        back_populates="patient", cascade="all,delete"
    )
    installations: Mapped["InstallationDetail"] = relationship(
        back_populates="patient", cascade="all,delete"
    )
    tickets: Mapped[list["Ticket"]] = relationship(
        back_populates="patient", cascade="all,delete"
    )


class PatientDetail(Base):
    __tablename__ = "patient_details"

    patient_id: Mapped[str] = mapped_column(
        ForeignKey("patients.patient_id"), primary_key=True
    )

    first_name: Mapped[str]
    last_name: Mapped[str]
    home_address: Mapped[str | None]

    patient: Mapped[Patient] = relationship(cascade="all,delete")


class PatientScreening(Base):
    __tablename__ = "patient_screenings"

    patient_id: Mapped[str] = mapped_column(
        ForeignKey("patients.patient_id"), primary_key=True
    )
    neuro_diag: Mapped[str | None]
    age_class: Mapped[str | None]

    patient: Mapped[Patient] = relationship(cascade="all,delete")


class PatientNote(Base):
    __tablename__ = "patient_notes"

    patient_id: Mapped[str] = mapped_column(
        ForeignKey("patients.patient_id"), primary_key=True
    )
    codice_fiscale: Mapped[str] = mapped_column(unique=True)
    medical_notes: Mapped[str | None]

    patient: Mapped[Patient] = relationship(cascade="all,delete")


class Contact(Base):
    __tablename__ = "contacts"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    patient_id: Mapped[str] = mapped_column(ForeignKey("patients.patient_id"))
    alias: Mapped[str | None]
    phone_no: Mapped[str | None]
    email: Mapped[str | None]

    patient: Mapped[Patient] = relationship(cascade="all,delete")


class InstallationDetail(Base):
    __tablename__ = "installation_details"

    ts: Mapped[datetime] = mapped_column(default=datetime.now)
    patient_id: Mapped[str] = mapped_column(
        ForeignKey("patients.patient_id"), primary_key=True
    )

    apartment_type: Mapped[str | None]
    internet_type: Mapped[str | None]
    flatmates: Mapped[str | None]
    pets: Mapped[str | None]
    visitors: Mapped[str | None]
    smartphone_model: Mapped[str | None]
    appliances: Mapped[str | None]
    issues_notes: Mapped[str | None]
    habits_notes: Mapped[str | None]
    other_notes: Mapped[str | None]
    date_start: Mapped[datetime | None]
    date_end: Mapped[datetime | None]

    patient: Mapped[Patient] = relationship(cascade="all,delete")
    documents: Mapped[list["InstallationDocument"]] = relationship(
        back_populates="installation", cascade="all,delete"
    )


class InstallationDocument(Base):
    __tablename__ = "installation_documents"

    document_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    ts: Mapped[datetime] = mapped_column(default=datetime.now)
    patient_id: Mapped[str] = mapped_column(
        ForeignKey("installation_details.patient_id")
    )

    file_name: Mapped[str | None]
    file_type: Mapped[str | None]
    file_content: Mapped[bytes]

    installation: Mapped[InstallationDetail] = relationship(cascade="all,delete")


class TicketMessage(Base):
    __tablename__ = "ticket_messages"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    ts: Mapped[datetime] = mapped_column(default=datetime.now)
    sender: Mapped[str]
    body: Mapped[str]
    ticket_id: Mapped[int] = mapped_column(ForeignKey("tickets.ticket_id"))

    ticket: Mapped["Ticket"] = relationship(
        back_populates="messages", cascade="all,delete"
    )


class Ticket(Base):
    __tablename__ = "tickets"

    ts: Mapped[datetime] = mapped_column(default=datetime.now)
    ticket_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    patient_id: Mapped[str] = mapped_column(ForeignKey("patients.patient_id"))
    date_closed: Mapped[datetime | None]
    category: Mapped[str | None]

    patient: Mapped[Patient] = relationship(cascade="all,delete")
    messages: Mapped[list[TicketMessage]] = relationship(
        back_populates="ticket", cascade="all,delete"
    )
