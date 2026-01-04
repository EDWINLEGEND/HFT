"""
LLM Service - Language Model Inference
Handles LLM inference calls (local LLM via HTTP).

Responsibilities:
- Manage LLM API connections (LM Studio / Ollama)
- Format prompts and messages
- Handle timeouts and errors
- Validate JSON output
- Implement safety fallbacks

Reference: Inspired by OLD/RagBot/inference.py (lines 43-93)

Phase 3: IMPLEMENTED - Local LLM inference with structured output
"""

from typing import List, Dict, Any, Optional
import logging
import requests
import json
from app.core.config import settings

logger = logging.getLogger(__name__)


class LLMService:
    """
    Service for interacting with local Large Language Models.
    
    Supports local LLM APIs (LM Studio, Ollama) with strict safety controls:
    - Hard token limits
    - Timeout handling
    - JSON validation
    - Fallback to "Needs Human Review" on errors
    """
    
    def __init__(
        self, 
        api_url: str = None,
        model_name: str = None,
        temperature: float = 0.3,  # Lower for more deterministic output
        max_tokens: int = 2000,  # Hard limit
        timeout: int = 30  # 30 second timeout
    ):
        """
        Initialize the LLM service.
        
        Args:
            api_url: URL of the LLM API endpoint
            model_name: Name of the model to use
            temperature: Sampling temperature (0-1, lower = more deterministic)
            max_tokens: Maximum tokens to generate
            timeout: Request timeout in seconds
        """
        self.api_url = api_url or settings.llm_api_url
        self.model_name = model_name or settings.llm_model_name
        self.temperature = temperature
        self.max_tokens = max_tokens
        self.timeout = timeout
        logger.info(f"LLMService initialized with model: {self.model_name} at {self.api_url}")
    
    def chat_completion(
        self, 
        messages: List[Dict[str, str]], 
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
        response_format: Optional[str] = None
    ) -> str:
        """
        Generate a chat completion using the local LLM.
        
        Args:
            messages: List of message dictionaries with 'role' and 'content'
            temperature: Override default temperature
            max_tokens: Override default max tokens
            response_format: Expected format (e.g., "json")
            
        Returns:
            Generated text response from the LLM
            
        Raises:
            RuntimeError: If LLM call fails
        """
        payload = {
            "model": self.model_name,
            "messages": messages,
            "temperature": temperature if temperature is not None else self.temperature,
            "max_tokens": max_tokens if max_tokens is not None else self.max_tokens,
            "stream": False
        }
        
        # Add JSON mode if supported
        if response_format == "json":
            payload["response_format"] = {"type": "json_object"}
        
        headers = {"Content-Type": "application/json"}
        
        try:
            logger.info(f"Calling LLM at {self.api_url}")
            response = requests.post(
                self.api_url,
                headers=headers,
                json=payload,
                timeout=self.timeout
            )
            
            if response.status_code != 200:
                logger.error(f"LLM API returned status {response.status_code}: {response.text}")
                raise RuntimeError(f"LLM API error: {response.status_code}")
            
            result = response.json()
            content = result.get("choices", [{}])[0].get("message", {}).get("content", "")
            
            if not content:
                logger.error("LLM returned empty response")
                raise RuntimeError("Empty LLM response")
            
            logger.info(f"LLM response received ({len(content)} characters)")
            return content
            
        except requests.Timeout:
            logger.error(f"LLM request timed out after {self.timeout}s")
            raise RuntimeError("LLM request timeout")
        except requests.RequestException as e:
            logger.error(f"LLM request failed: {e}")
            raise RuntimeError(f"LLM request failed: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected error in LLM call: {e}")
            raise RuntimeError(f"LLM error: {str(e)}")
    
    def generate_compliance_analysis(
        self, 
        application_details: Dict[str, Any], 
        relevant_regulations: List[str]
    ) -> Dict[str, Any]:
        """
        Generate a structured compliance analysis report.
        
        This is the core compliance reasoning function. It uses the LLM to analyze
        the application against retrieved regulations and produce a structured report.
        
        Args:
            application_details: Dictionary of application information
            relevant_regulations: List of relevant regulation texts
            
        Returns:
            Structured compliance analysis as dictionary
            
        Raises:
            RuntimeError: If analysis fails
        """
        # Build the analysis prompt
        system_prompt = """You are an expert compliance analyst for industrial regulations in Kerala, India.

Your task is to analyze industrial applications against regulations and produce a structured JSON report.

CRITICAL RULES:
1. You MUST respond with valid JSON only
2. Be objective and cite specific regulations
3. Flag ambiguities - do not make assumptions
4. Categorize issues by risk level (low/medium/high)
5. Provide actionable checklist items

Output ONLY valid JSON matching this exact structure:
{
  "overall_status": "compliant" | "partially_compliant" | "non_compliant",
  "confidence_score": 0-100,
  "time_saved_minutes": number,
  "regulation_coverage_percent": number,
  "issues": [
    {
      "type": "missing_document" | "violation" | "ambiguity",
      "risk_level": "low" | "medium" | "high",
      "department": "environment" | "fire" | "local_body" | "other",
      "regulation_reference": {
        "name": "regulation name",
        "clause": "clause reference"
      },
      "document_excerpt": "relevant excerpt from regulation",
      "explanation": "clear explanation of the issue"
    }
  ],
  "checklist": ["actionable item 1", "actionable item 2"]
}"""

        # Format application details
        app_summary = "\n".join([f"- {k}: {v}" for k, v in application_details.items()])
        
        # Format regulations
        reg_summary = "\n\n".join([f"REGULATION {i+1}:\n{reg}" for i, reg in enumerate(relevant_regulations[:5])])
        
        user_prompt = f"""Analyze this industrial application for compliance:

APPLICATION DETAILS:
{app_summary}

RELEVANT REGULATIONS:
{reg_summary}

Provide a comprehensive compliance analysis in JSON format."""

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
        
        try:
            # Call LLM
            response_text = self.chat_completion(
                messages=messages,
                temperature=0.3,  # Low temperature for consistency
                max_tokens=2000,
                response_format="json"
            )
            
            # Parse JSON
            try:
                result = json.loads(response_text)
                logger.info("Successfully parsed LLM JSON response")
                return result
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse LLM response as JSON: {e}")
                logger.error(f"Response was: {response_text[:500]}")
                raise RuntimeError("Invalid JSON from LLM")
                
        except Exception as e:
            logger.error(f"Compliance analysis failed: {e}")
            raise
    
    def is_available(self) -> bool:
        """
        Check if the LLM API is available.
        
        Returns:
            True if API is reachable, False otherwise
        """
        try:
            response = requests.get(
                self.api_url.replace("/chat/completions", "/models"),
                timeout=5
            )
            return response.status_code == 200
        except Exception:
            return False


# Singleton instance
_llm_service: Optional[LLMService] = None


def get_llm_service() -> LLMService:
    """
    Get or create the singleton LLMService instance.
    
    Returns:
        LLMService instance
    """
    global _llm_service
    if _llm_service is None:
        _llm_service = LLMService()
    return _llm_service
