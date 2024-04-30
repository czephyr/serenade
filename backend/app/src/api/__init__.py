from fastapi import APIRouter

from .endpoints import installations, patients, tickets, documents, contacts

api_router = APIRouter()
api_router.include_router(patients.router, prefix="/patients")
api_router.include_router(installations.router, prefix="/installations")
api_router.include_router(documents.router)
api_router.include_router(tickets.router, prefix="/tickets")
api_router.include_router(contacts.router, prefix="/contacts")
