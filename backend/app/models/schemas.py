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
