from fastapi import FastAPI
from app.config import settings
from app.api.router import api_router

app = FastAPI(
    title=settings.app_name,
    description="${{ values.description }}",
    version="0.1",
)

# Unprefixed system health check for K8s probes
@app.get("/health", tags=["System"])
async def health_check():
    return {"status": "UP"}

# Versioned API routes (e.g., /api/v1/...)
app.include_router(api_router, prefix="/api/v1")


@app.get("/", tags=["Root"])
async def root():
    return {
        "message": f"Welcome to {settings.app_name}",
        "status": "healthy",
        "docs_url": "/docs",
    }