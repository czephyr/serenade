from fastapi import APIRouter
from .endpoints import patients, notes, tickets, ticket_messages, auth

api_router = APIRouter()
api_router.include_router(auth.router, tags=["auth"])
api_router.include_router(patients.router, prefix="/patients", tags=["patients"])
api_router.include_router(notes.router, prefix="/notes", tags=["notes"])
api_router.include_router(tickets.router, prefix="/tickets", tags=["tickets"])
api_router.include_router(ticket_messages.router, prefix="/ticket_messages", tags=["ticket_messages"])
