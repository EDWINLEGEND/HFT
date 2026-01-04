"""
CivicAssist Backend - FastAPI Application
Main entry point for the FastAPI application.

Features:
- FastAPI app initialization
- CORS middleware configuration
- API router registration for /api/v1
- Basic health and version endpoints

Reference: Inspired by OLD/RagBot/server.py but with cleaner structure
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import routes as v1_routes
from app.core.config import settings
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# Lifespan context manager
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan context manager.
    Handles startup and shutdown events.
    """
    # Startup
    logger.info(f"Starting {settings.app_name} v{settings.app_version}")
    logger.info("Phase 1: Foundation setup - no AI/RAG logic initialized")
    
    yield
    
    # Shutdown
    logger.info(f"Shutting down {settings.app_name}")


# Initialize FastAPI application
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="AI-assisted Government Workflow Automation for Industrial Compliance",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API v1 routes
app.include_router(
    v1_routes.router,
    prefix="/api/v1",
    tags=["v1"]
)

# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint - Welcome message and API information.
    """
    return {
        "message": "Welcome to CivicAssist API",
        "version": settings.app_version,
        "docs": "/docs",
        "health": "/api/v1/health"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.debug
    )
