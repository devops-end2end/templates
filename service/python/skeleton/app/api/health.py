from fastapi import APIRouter
from app.config import settings

router = APIRouter()


@router.get("/")
async def health_check():
    return {
        "status": "ok",
        "app": settings.app_name,
        "environment": settings.environment,
    }
