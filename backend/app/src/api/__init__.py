from fastapi import APIRouter
from .endpoints import patients, auth

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(patients.router, prefix="/patients")
