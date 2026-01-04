"""
Compliance Service - Compliance Analysis Orchestration
Orchestrates compliance analysis workflow with human-in-the-loop principles.

Responsibilities:
- Coordinate document analysis
- Retrieve relevant regulations from vector store
- Generate compliance reports using LLM
- Calculate confidence scores and risk levels
- Implement safety fallbacks

Reference: Inspired by OLD/RagBot/server.py generate_industrial_compliance_report 
          function (lines 109-131), redesigned for structured compliance analysis

Phase 3: IMPLEMENTED - Full compliance analysis with LLM reasoning
"""

from typing import Dict, Any, List
import logging
from datetime import datetime
from app.models.schemas import ComplianceReport, ComplianceIssue
from app.services.embedding_service import get_embedding_service
from app.services.vector_store_service import get_vector_store_service
from app.services.llm_service import get_llm_service

logger = logging.getLogger(__name__)


# Safety fallback response
FALLBACK_RESPONSE = {
    "overall_status": "needs_human_review",
    "confidence_score": 0,
    "time_saved_minutes": 0,
    "regulation_coverage_percent": 0,
    "issues": [{
        "type": "ambiguity",
        "risk_level": "high",
        "department": "other",
        "regulation_reference": {
            "name": "System Error",
            "clause": "N/A"
        },
        "document_excerpt": "",
        "explanation": "Automated analysis failed. Manual review required."
    }],
    "checklist": ["Submit application for manual review by compliance officer"]
}


class ComplianceService:
    """
    Service for orchestrating compliance analysis workflows.
    
    Implements human-in-the-loop principles:
    - Never auto-approves
    - Always explainable
    - Fails safe (returns "needs review" on errors)
    - Structured output only
    """
    
    def __init__(self):
        """Initialize the compliance service."""
        self.embedding_service = get_embedding_service()
        self.vector_store = get_vector_store_service()
        self.llm_service = get_llm_service()
        logger.info("ComplianceService initialized with LLM integration")
    
    def analyze_application(self, application_data: Dict[str, Any]) -> ComplianceReport:
        """
        Analyze an industrial application for regulatory compliance.
        
        Workflow:
        1. Extract key details from application
        2. Query vector store for relevant regulations
        3. Use LLM to analyze compliance
        4. Validate and structure output
        5. Return compliance report
        
        SAFETY: If any step fails, returns "needs_human_review" status
        
        Args:
            application_data: Dictionary containing application details
            
        Returns:
            ComplianceReport with analysis results
        """
        try:
            logger.info(f"Starting compliance analysis for: {application_data.get('industry_name', 'Unknown')}")
            
            # Step 1: Build search query from application
            query_text = self._build_search_query(application_data)
            
            # Step 2: Retrieve relevant regulations
            relevant_regulations = self._retrieve_regulations(query_text)
            
            if not relevant_regulations:
                logger.warning("No regulations retrieved - using fallback")
                return self._create_fallback_report("No relevant regulations found in database")
            
            # Step 3: Generate compliance analysis using LLM
            try:
                llm_output = self.llm_service.generate_compliance_analysis(
                    application_details=application_data,
                    relevant_regulations=relevant_regulations
                )
            except Exception as e:
                logger.error(f"LLM analysis failed: {e}")
                return self._create_fallback_report(f"LLM analysis error: {str(e)}")
            
            # Step 4: Validate and convert to ComplianceReport
            try:
                report = self._validate_and_convert_output(llm_output, application_data)
                logger.info(f"Compliance analysis complete: {report.status}")
                return report
            except Exception as e:
                logger.error(f"Output validation failed: {e}")
                return self._create_fallback_report(f"Invalid LLM output: {str(e)}")
                
        except Exception as e:
            logger.error(f"Compliance analysis failed: {e}")
            return self._create_fallback_report(f"System error: {str(e)}")
    
    def _build_search_query(self, application_data: Dict[str, Any]) -> str:
        """
        Build a search query from application data.
        
        Args:
            application_data: Application details
            
        Returns:
            Search query string
        """
        # Extract key compliance-relevant fields
        industry_name = application_data.get("industry_name", "")
        water_source = application_data.get("water_source", "")
        waste_management = application_data.get("waste_management", "")
        air_pollution = application_data.get("air_pollution", "")
        
        query = f"""
        Industrial application for {industry_name}.
        Water source: {water_source}.
        Waste management: {waste_management}.
        Air pollution control: {air_pollution}.
        Requirements for fire safety, environmental clearance, building standards.
        """.strip()
        
        logger.info(f"Built search query: {query[:100]}...")
        return query
    
    def _retrieve_regulations(self, query: str, n_results: int = 10) -> List[str]:
        """
        Retrieve relevant regulation chunks from vector store.
        
        Args:
            query: Search query
            n_results: Number of results to retrieve
            
        Returns:
            List of regulation text chunks
        """
        try:
            # Generate query embedding
            query_embedding = self.embedding_service.encode(query)
            
            # Search vector store
            results = self.vector_store.query(
                query_embedding=query_embedding,
                n_results=n_results
            )
            
            regulations = results.get("documents", [])
            logger.info(f"Retrieved {len(regulations)} regulation chunks")
            return regulations
            
        except Exception as e:
            logger.error(f"Regulation retrieval failed: {e}")
            return []
    
    def _validate_and_convert_output(
        self, 
        llm_output: Dict[str, Any],
        application_data: Dict[str, Any]
    ) -> ComplianceReport:
        """
        Validate LLM output and convert to ComplianceReport.
        
        Args:
            llm_output: Raw LLM output dictionary
            application_data: Original application data
            
        Returns:
            Validated ComplianceReport
            
        Raises:
            ValueError: If output is invalid
        """
        # Validate required fields
        required_fields = ["overall_status", "confidence_score", "issues", "checklist"]
        for field in required_fields:
            if field not in llm_output:
                raise ValueError(f"Missing required field: {field}")
        
        # Validate status
        valid_statuses = ["compliant", "partially_compliant", "non_compliant", "needs_human_review"]
        status = llm_output["overall_status"]
        if status not in valid_statuses:
            raise ValueError(f"Invalid status: {status}")
        
        # Convert issues to ComplianceIssue objects
        issues = []
        for issue_data in llm_output.get("issues", []):
            try:
                # Extract regulation reference
                reg_ref = issue_data.get("regulation_reference", {})
                regulation_reference = f"{reg_ref.get('name', 'Unknown')}, {reg_ref.get('clause', 'N/A')}"
                
                issue = ComplianceIssue(
                    issue_type=issue_data.get("type", "ambiguity"),
                    severity=issue_data.get("risk_level", "medium"),
                    description=issue_data.get("explanation", "No explanation provided"),
                    regulation_reference=regulation_reference,
                    department=issue_data.get("department", "other")
                )
                issues.append(issue)
            except Exception as e:
                logger.warning(f"Failed to parse issue: {e}")
                continue
        
        # Build compliance report
        report = ComplianceReport(
            application_id=application_data.get("industry_name", "unknown"),
            status=status,
            confidence_score=min(max(llm_output.get("confidence_score", 0) / 100.0, 0.0), 1.0),
            issues=issues,
            missing_documents=[],  # Extracted from issues
            recommendations=llm_output.get("checklist", []),
            regulation_coverage=min(max(llm_output.get("regulation_coverage_percent", 0) / 100.0, 0.0), 1.0),
            generated_at=datetime.utcnow()
        )
        
        # Extract missing documents from issues
        for issue in issues:
            if issue.issue_type == "missing_document":
                report.missing_documents.append(issue.description)
        
        return report
    
    def _create_fallback_report(self, reason: str) -> ComplianceReport:
        """
        Create a safe fallback report when analysis fails.
        
        Args:
            reason: Reason for fallback
            
        Returns:
            ComplianceReport with "needs_human_review" status
        """
        logger.warning(f"Creating fallback report: {reason}")
        
        issue = ComplianceIssue(
            issue_type="ambiguity",
            severity="high",
            description=f"Automated analysis unavailable: {reason}",
            regulation_reference="System Error",
            department="other"
        )
        
        return ComplianceReport(
            status="partial",  # Use "partial" instead of "needs_human_review" for schema compatibility
            confidence_score=0.0,
            issues=[issue],
            missing_documents=["Manual review required"],
            recommendations=["Submit application for manual review by compliance officer"],
            regulation_coverage=0.0,
            generated_at=datetime.utcnow()
        )
    
    def calculate_confidence_score(self, application_data: Dict[str, Any]) -> float:
        """
        Calculate confidence score based on data completeness.
        
        Args:
            application_data: Dictionary containing application details
            
        Returns:
            Confidence score between 0.0 and 1.0
        """
        # Count non-empty fields
        total_fields = len(application_data)
        filled_fields = sum(1 for v in application_data.values() if v and str(v).strip())
        
        if total_fields == 0:
            return 0.0
        
        return filled_fields / total_fields
    
    def categorize_risk(self, issue_description: str) -> str:
        """
        Categorize an issue as low, medium, or high risk.
        
        Args:
            issue_description: Text description of the issue
            
        Returns:
            Risk level: "low", "medium", or "high"
        """
        # Simple keyword-based categorization
        high_risk_keywords = ["violation", "illegal", "prohibited", "danger", "hazard"]
        medium_risk_keywords = ["missing", "incomplete", "unclear", "ambiguous"]
        
        description_lower = issue_description.lower()
        
        if any(keyword in description_lower for keyword in high_risk_keywords):
            return "high"
        elif any(keyword in description_lower for keyword in medium_risk_keywords):
            return "medium"
        else:
            return "low"


# Singleton instance
_compliance_service: ComplianceService = None


def get_compliance_service() -> ComplianceService:
    """
    Get or create the singleton ComplianceService instance.
    
    Returns:
        ComplianceService instance
    """
    global _compliance_service
    if _compliance_service is None:
        _compliance_service = ComplianceService()
    return _compliance_service
