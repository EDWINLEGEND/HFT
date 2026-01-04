"""
API v1 Routes - RESTful Endpoints
API route definitions for v1 endpoints.

Contains:
- /health - Health check endpoint
- /version - API version information
- /compliance/analyze - Placeholder for compliance analysis (stub)
- /chat - Placeholder for chatbot endpoint (stub)
"""

from fastapi import APIRouter, HTTPException
from datetime import datetime
from app.models.schemas import (
    ComplianceReport,
    IndustrialApplication,
    ChatRequest,
    ChatResponse,
    HealthResponse,
    VersionResponse
)
from app.services.compliance_service import get_compliance_service
from app.services.chat_service import get_chat_service
from app.core.config import settings

router = APIRouter()


@router.get("/health", response_model=HealthResponse, tags=["System"])
async def health_check():
    """
    Health check endpoint to verify API is running.
    
    Returns:
        HealthResponse with status, version, and timestamp
    """
    return HealthResponse(
        status="healthy",
        version=settings.app_version,
        timestamp=datetime.utcnow()
    )


@router.get("/version", response_model=VersionResponse, tags=["System"])
async def get_version():
    """
    Get API version information.
    
    Returns:
        VersionResponse with API version and app name
    """
    return VersionResponse(
        api_version=settings.app_version,
        app_name=settings.app_name
    )


@router.post("/compliance/analyze", response_model=ComplianceReport, tags=["Compliance"])
async def analyze_compliance(application: IndustrialApplication):
    """
    Analyze an industrial application for regulatory compliance.
    
    This is a STUB endpoint for Phase 1. Actual compliance analysis will be
    implemented in Phase 2 with RAG and LLM integration.
    
    Args:
        application: IndustrialApplication data
        
    Returns:
        ComplianceReport with analysis results
        
    Raises:
        HTTPException: If analysis fails
    """
    try:
        compliance_service = get_compliance_service()
        report = compliance_service.analyze_application(application.dict())
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Compliance analysis failed: {str(e)}")


@router.post("/chat", response_model=ChatResponse, tags=["Chatbot"])
async def chat(chat_request: ChatRequest):
    """
    Process a chat conversation and return AI assistant's response.
    
    This is a STUB endpoint for Phase 1. Actual chatbot logic will be
    implemented in Phase 2 with LLM integration.
    
    Args:
        chat_request: ChatRequest with conversation history
        
    Returns:
        ChatResponse with assistant's reply
        
    Raises:
        HTTPException: If chat processing fails
    """
    try:
        chat_service = get_chat_service()
        response_message = chat_service.process_chat(chat_request.messages)
        return ChatResponse(message=response_message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat processing failed: {str(e)}")
