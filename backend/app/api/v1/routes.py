"""
API v1 Routes - RESTful Endpoints
API route definitions for v1 endpoints.

Contains:
- /health - Health check endpoint
- /version - API version information
- /regulations/search - Search regulations by query (Phase 2)
- /regulations/ingest - Ingest regulation documents (Phase 2)
- /compliance/analyze - Placeholder for compliance analysis (stub)
- /chat - Placeholder for chatbot endpoint (stub)
"""

from fastapi import APIRouter, HTTPException, Query, File, UploadFile, Form
from datetime import datetime
from typing import Optional
from app.models.schemas import (
    ComplianceReport,
    IndustrialApplication,
    ChatRequest,
    ChatResponse,
    HealthResponse,
    VersionResponse,
    RegulationSearchRequest,
    RegulationSearchResponse,
    IngestionResponse,
    OfficerReviewRequest
)
from app.services.compliance_service import get_compliance_service
from app.services.chat_service import get_chat_service
from app.services.embedding_service import get_embedding_service
from app.services.vector_store_service import get_vector_store_service
from app.services.regulation_ingestion_service import get_ingestion_service
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


@router.get("/regulations/search", response_model=RegulationSearchResponse, tags=["Regulations"])
async def search_regulations(
    query: str = Query(..., description="Search query text"),
    industry_type: Optional[str] = Query(None, description="Filter by industry type"),
    department: Optional[str] = Query(None, description="Filter by department"),
    n_results: int = Query(5, ge=1, le=20, description="Number of results to return")
):
    """
    Search for relevant regulation chunks using semantic similarity.
    
    Phase 2: IMPLEMENTED - Full RAG retrieval without LLM reasoning.
    
    Args:
        query: Search query text
        industry_type: Optional industry type filter
        department: Optional department filter (e.g., "Environment", "Fire Safety")
        n_results: Number of results to return (1-20)
        
    Returns:
        RegulationSearchResponse with matching regulation chunks and metadata
        
    Raises:
        HTTPException: If search fails
    """
    try:
        # Get services
        embedding_service = get_embedding_service()
        vector_store = get_vector_store_service()
        
        # Generate query embedding
        query_embedding = embedding_service.encode(query)
        
        # Build metadata filter
        where_filter = None
        if department:
            where_filter = {"department": department}
        
        # Query vector store
        results = vector_store.query(
            query_embedding=query_embedding,
            n_results=n_results,
            where=where_filter
        )
        
        # Format response
        return RegulationSearchResponse(
            query=query,
            results=results["documents"],
            metadatas=results["metadatas"],
            distances=results["distances"],
            count=len(results["documents"])
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Regulation search failed: {str(e)}")


@router.post("/regulations/ingest", response_model=IngestionResponse, tags=["Regulations"])
async def ingest_regulations():
    """
    Ingest all regulation documents from the data/regulations directory.
    
    Phase 2: IMPLEMENTED - Document ingestion pipeline.
    
    This endpoint scans the regulations directory, extracts text from supported
    formats (PDF, DOCX, TXT), chunks the text, generates embeddings, and stores
    them in the vector database.
    
    Returns:
        IngestionResponse with ingestion statistics
        
    Raises:
        HTTPException: If ingestion fails
    """
    try:
        ingestion_service = get_ingestion_service()
        stats = ingestion_service.ingest_directory()
        
        return IngestionResponse(
            success=True,
            message=f"Ingested {stats['successful']} files successfully",
            total_files=stats["total_files"],
            successful=stats["successful"],
            failed=stats["failed"],
            total_chunks=stats["total_chunks"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Regulation ingestion failed: {str(e)}")


@router.post("/compliance/analyze", response_model=ComplianceReport, tags=["Compliance"])
async def analyze_compliance(application: IndustrialApplication):
    """
    Analyze an industrial application for regulatory compliance.
    
    This is a STUB endpoint for Phase 1-2. Actual compliance analysis will be
    implemented in Phase 3 with LLM integration.
    
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
    
    This is a STUB endpoint for Phase 1-2. Actual chatbot logic will be
    implemented in Phase 3 with LLM integration.
    
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


# Phase 4: Application Storage Endpoints

from app.services.application_service import ApplicationService
from app.models.schemas import ApplicationSubmission, SavedApplication
from typing import List

def get_application_service():
    return ApplicationService()

@router.post("/applications", response_model=SavedApplication, tags=["Applications"])
async def submit_application(submission: ApplicationSubmission):
    """
    Submit an industrial application for review.
    Saves the application details, AI analysis report, and optional justification.
    """
    try:
        service = get_application_service()
        
        # Calculate time saved (Mock calculation based on verified automation)
        # Average manual entry: 20 mins (1200s). AI Extraction: ~10s. Saved: ~1190s.
        time_saved = 1200.0 
        
        # Add to saved application logic (need to update service to accept this or set it here)
        # Since service.submit_application takes schema, we might need to modify schema or service.
        # But SavedApplication has the field. We can inject it into the returned object or modify service.
        # Let's verify service implementation. For now, we'll let service handle it or modify service.
        
        return service.submit_application(submission, time_saved=time_saved)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Application submission failed: {str(e)}")

# --- Document Processing Endpoints ---

@router.post("/documents/extract", tags=["Documents"])
async def extract_document_details(file: UploadFile = File(...)):
    """
    Upload a document (PDF/Text) to extract application details.
    Returns a JSON object with extracted fields to auto-fill the form.
    """
    try:
        from app.services.document_service import get_document_service
        import os
        import shutil
        
        service = get_document_service()
        
        # Save file to disk
        upload_dir = "data/uploads"
        os.makedirs(upload_dir, exist_ok=True)
        
        # Generate safe filename
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        safe_filename = f"{timestamp}_{file.filename.replace(' ', '_')}"
        file_path = os.path.join(upload_dir, safe_filename)
        
        # Write to disk
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Read content for extraction (reset file pointer if needed, but we saved it)
        with open(file_path, "rb") as f:
            contents = f.read()
            
        text = service.extract_text(contents, file.filename)
        data = service.parse_application_details(text)
        
        # Return local path (or URL path if serving statically)
        document_url = f"/uploads/{safe_filename}"
        
        # Add document_url to the data so frontend can use it
        data["document_url"] = document_url
        
        return {"filename": file.filename, "extracted_data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction failed: {str(e)}")

@router.post("/documents/validate", tags=["Documents"])
async def validate_document(
    doc_type: str = Form(...),
    file: UploadFile = File(...)
):
    """
    Validate if an uploaded document matches the required type.
    """
    try:
        from app.services.document_service import get_document_service
        service = get_document_service()
        
        contents = await file.read()
        text = service.extract_text(contents, file.filename)
        result = service.validate_document(text, doc_type)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Validation failed: {str(e)}")

@router.get("/applications", response_model=List[SavedApplication], tags=["Applications"])
async def get_applications():
    """
    Get all submitted applications for the Officer Dashboard.
    """
    try:
        service = get_application_service()
        return service.get_all_applications()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch applications: {str(e)}")

@router.get("/applications/{app_id}", response_model=SavedApplication, tags=["Applications"])
async def get_application_details(app_id: str):
    """
    Get full details of a specific application by ID.
    """
    try:
        service = get_application_service()
        app = service.get_application_by_id(app_id)
        if not app:
            raise HTTPException(status_code=404, detail="Application not found")
        return app
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch application: {str(e)}")

@router.post("/applications/{app_id}/review", response_model=SavedApplication, tags=["Applications"])
async def review_application(app_id: str, review: OfficerReviewRequest):
    """
    Officer reviews an application (Approve/Reject).
    """
    try:
        service = get_application_service()
        updated_app = service.review_application(app_id, review.dict())
        if not updated_app:
            raise HTTPException(status_code=404, detail="Application not found")
        return updated_app
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Review failed: {str(e)}")

@router.delete("/applications/{app_id}", tags=["Applications"])
async def delete_application(app_id: str):
    """
    Delete an application by ID.
    """
    try:
        service = get_application_service()
        success = service.delete_application(app_id)
        if not success:
            raise HTTPException(status_code=404, detail="Application not found")
        return {"message": "Application deleted successfully", "id": app_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Delete failed: {str(e)}")
