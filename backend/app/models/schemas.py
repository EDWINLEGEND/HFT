"""
Pydantic models for request/response validation.
Inspired by OLD/RagBot/server.py (lines 30-48)
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime


class IndustrialApplication(BaseModel):
    """
    Schema for industrial approval application submission.
    Contains all relevant details about the proposed industry.
    """
    industry_name: str = Field(..., description="Name of the industrial unit")
    square_feet: str = Field(..., description="Total area in square feet")
    water_source: str = Field(..., description="Primary water source")
    drainage: str = Field(..., description="Drainage system details")
    air_pollution: str = Field(..., description="Air pollution control measures")
    waste_management: str = Field(..., description="Waste management plan")
    nearby_homes: str = Field(..., description="Distance to nearest residential area")
    water_level_depth: str = Field(..., description="Groundwater level depth")
    
    class Config:
        json_schema_extra = {
            "example": {
                "industry_name": "ABC Textile Mill",
                "square_feet": "5000",
                "water_source": "Municipal supply",
                "drainage": "Connected to city drainage",
                "air_pollution": "Electrostatic precipitators installed",
                "waste_management": "Proper waste segregation and disposal",
                "nearby_homes": "500 meters",
                "water_level_depth": "50 feet"
            }
        }


class ComplianceIssue(BaseModel):
    """Individual compliance issue with traceability."""
    issue_type: str = Field(..., description="Type of issue: missing_document, violation, ambiguity")
    severity: str = Field(..., description="Risk level: low, medium, high")
    description: str = Field(..., description="Plain-language explanation of the issue")
    regulation_reference: Optional[str] = Field(None, description="Specific regulation clause")
    department: Optional[str] = Field(None, description="Responsible department")


class ComplianceReport(BaseModel):
    """
    Comprehensive compliance analysis response.
    Includes status, issues, recommendations, and traceability.
    """
    application_id: Optional[str] = None
    status: str = Field(..., description="Overall compliance status: compliant, partial, non_compliant")
    confidence_score: float = Field(..., ge=0.0, le=1.0, description="Confidence in analysis (0-1)")
    issues: List[ComplianceIssue] = Field(default_factory=list)
    missing_documents: List[str] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)
    regulation_coverage: float = Field(..., ge=0.0, le=1.0, description="% of regulations reviewed")
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_schema_extra = {
            "example": {
                "status": "partial",
                "confidence_score": 0.85,
                "issues": [
                    {
                        "issue_type": "violation",
                        "severity": "high",
                        "description": "Distance to residential area is below minimum requirement",
                        "regulation_reference": "Kerala Industrial Policy 2023, Clause 4.2.1",
                        "department": "Local Body"
                    }
                ],
                "missing_documents": ["Fire safety certificate", "Environmental clearance"],
                "recommendations": ["Increase buffer zone to 1km", "Submit NOC from Fire Department"],
                "regulation_coverage": 0.92
            }
        }


class ChatMessage(BaseModel):
    """Single chat message in a conversation."""
    role: str = Field(..., description="Message role: system, user, or assistant")
    content: str = Field(..., description="Message content")


class ChatRequest(BaseModel):
    """
    Chat conversation request with message history.
    Inspired by OLD/RagBot/server.py /chat endpoint.
    """
    messages: List[ChatMessage] = Field(..., description="Conversation history")
    
    class Config:
        json_schema_extra = {
            "example": {
                "messages": [
                    {"role": "system", "content": "You are a helpful compliance assistant."},
                    {"role": "user", "content": "What documents are needed for a textile factory?"}
                ]
            }
        }


class ChatResponse(BaseModel):
    """Response from the chatbot."""
    message: str = Field(..., description="AI assistant's response")


class HealthResponse(BaseModel):
    """Health check response."""
    status: str = "healthy"
    version: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class VersionResponse(BaseModel):
    """API version information."""
    api_version: str
    app_name: str


# Phase 2: Regulation Search Schemas

class RegulationSearchRequest(BaseModel):
    """Request for searching regulations."""
    query: str = Field(..., description="Search query text")
    industry_type: Optional[str] = Field(None, description="Filter by industry type")
    department: Optional[str] = Field(None, description="Filter by department")
    n_results: int = Field(5, ge=1, le=20, description="Number of results to return")


class RegulationSearchResponse(BaseModel):
    """Response from regulation search with retrieved chunks."""
    query: str = Field(..., description="Original search query")
    results: List[str] = Field(..., description="List of matching regulation text chunks")
    metadatas: List[Dict[str, Any]] = Field(..., description="Metadata for each result")
    distances: List[float] = Field(..., description="Similarity distances (lower is better)")
    count: int = Field(..., description="Number of results returned")
    
    class Config:
        json_schema_extra = {
            "example": {
                "query": "fire safety requirements for textile factory",
                "results": [
                    "All textile manufacturing units must have fire extinguishers placed at intervals of 15 meters...",
                    "Emergency exits must be clearly marked and accessible at all times..."
                ],
                "metadatas": [
                    {
                        "regulation_name": "Kerala Fire Safety Code 2023",
                        "department": "Fire Safety",
                        "clause_id": "Section 4.2",
                        "chunk_index": 0
                    },
                    {
                        "regulation_name": "National Building Code",
                        "department": "Fire Safety",
                        "clause_id": "Chapter 5",
                        "chunk_index": 12
                    }
                ],
                "distances": [0.23, 0.31],
                "count": 2
            }
        }


class IngestionResponse(BaseModel):
    """Response from regulation document ingestion."""
    success: bool = Field(..., description="Whether ingestion was successful")
    message: str = Field(..., description="Human-readable status message")
    total_files: int = Field(..., description="Total files found")
    successful: int = Field(..., description="Number of files successfully ingested")
    failed: int = Field(..., description="Number of files that failed")
    total_chunks: int = Field(..., description="Total text chunks created and stored")
    
    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "message": "Ingested 5 files successfully",
                "total_files": 5,
                "successful": 5,
                "failed": 0,
                "total_chunks": 127
            }
        }


# Phase 4: Application Storage Schemas

class ApplicationSubmission(BaseModel):
    """Schema for submitting an application with its analysis."""
    application_data: IndustrialApplication
    compliance_report: ComplianceReport
    submission_reason: Optional[str] = Field(None, description="Reason for submission if not fully compliant")
    
    class Config:
        json_schema_extra = {
            "example": {
                "application_data": IndustrialApplication.Config.json_schema_extra["example"],
                "compliance_report": ComplianceReport.Config.json_schema_extra["example"],
                "submission_reason": "We are upgrading the treatment plant next month."
            }
        }


class SavedApplication(ApplicationSubmission):
    """Schema for a saved application with metadata."""
    id: str = Field(..., description="Unique application ID")
    submitted_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = Field("submitted", description="Current workflow status: submitted, under_review, approved, rejected")

