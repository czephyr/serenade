from fastapi import APIRouter

from .endpoints import auth, installations, patients, tickets

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(patients.router, prefix="/patients")
api_router.include_router(installations.router, prefix="/installations")
api_router.include_router(tickets.router, prefix="/tickets")
