"""
LLM Service - Language Model Inference
Handles LLM inference calls (local LLM via HTTP with OpenAI fallback).

Responsibilities:
- Manage LLM API connections (LM Studio / Ollama)
- Format prompts and messages
- Handle timeouts and errors
- Validate JSON output
- Implement safety fallbacks (Local → OpenAI → Safe Default)

Reference: Inspired by OLD/RagBot/inference.py (lines 43-93)

Phase 5: HARDENED - Fallback strategy, cost controls, failure detection
"""

from typing import List, Dict, Any, Optional
import logging
import requests
import json
from app.core.config import settings

logger = logging.getLogger(__name__)


# Safe default response when all LLMs fail
SAFE_DEFAULT_RESPONSE = {
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
        "explanation": "Automated analysis unavailable. All AI services failed. Manual review required."
    }],
    "checklist": ["Submit application for manual review by compliance officer"]
}


class LLMService:
    """
    Service for interacting with Large Language Models.
    
    Fallback Strategy (Phase 5):
    1. Primary: Local LLM (Mistral-7B via LM Studio/Ollama)
    2. Fallback: OpenAI (gpt-4o-mini) - if enabled
    3. Final: Safe default response
    
    Safety Controls:
    - Hard token limits (2000 max)
    - Timeout handling (30s)
    - JSON validation
    - Cost logging for OpenAI
    - No retries (fail fast)
    """
    
    def __init__(
        self, 
        api_url: str = None,
        model_name: str = None,
        temperature: float = 0.3,
        max_tokens: int = 2000,
        timeout: int = 30
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
        
        # OpenAI fallback settings
        self.use_openai_fallback = settings.use_openai_fallback
        self.openai_api_key = settings.openai_api_key
        self.openai_model = settings.openai_model
        
        # Call tracking
        self.local_llm_calls = 0
        self.openai_calls = 0
        self.fallback_calls = 0
        
        logger.info(f"LLMService initialized with model: {self.model_name} at {self.api_url}")
        if self.use_openai_fallback:
            logger.info(f"OpenAI fallback ENABLED with model: {self.openai_model}")
        else:
            logger.info("OpenAI fallback DISABLED")
    
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
            self.local_llm_calls += 1
            logger.info(f"[LOCAL LLM] Call #{self.local_llm_calls} to {self.api_url}")
            
            response = requests.post(
                self.api_url,
                headers=headers,
                json=payload,
                timeout=self.timeout
            )
            
            if response.status_code != 200:
                logger.error(f"[LOCAL LLM] API returned status {response.status_code}: {response.text}")
                raise RuntimeError(f"LLM API error: {response.status_code}")
            
            result = response.json()
            content = result.get("choices", [{}])[0].get("message", {}).get("content", "")
            
            if not content:
                logger.error("[LOCAL LLM] Returned empty response")
                raise RuntimeError("Empty LLM response")
            
            logger.info(f"[LOCAL LLM] Response received ({len(content)} characters)")
            return content
            
        except requests.Timeout:
            logger.error(f"[LOCAL LLM] Request timed out after {self.timeout}s")
            raise RuntimeError("LLM request timeout")
        except requests.RequestException as e:
            logger.error(f"[LOCAL LLM] Request failed: {e}")
            raise RuntimeError(f"LLM request failed: {str(e)}")
        except Exception as e:
            logger.error(f"[LOCAL LLM] Unexpected error: {e}")
            raise RuntimeError(f"LLM error: {str(e)}")
    
    def chat_completion_openai(
        self,
        messages: List[Dict[str, str]],
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None
    ) -> str:
        """
        Generate a chat completion using OpenAI API (fallback).
        
        COST ESTIMATE: ~$0.0001-0.0005 per call with gpt-4o-mini
        
        Args:
            messages: List of message dictionaries
            temperature: Sampling temperature
            max_tokens: Maximum tokens
            
        Returns:
            Generated text response
            
        Raises:
            RuntimeError: If OpenAI call fails
        """
        if not self.openai_api_key:
            raise RuntimeError("OpenAI API key not configured")
        
        payload = {
            "model": self.openai_model,
            "messages": messages,
            "temperature": temperature if temperature is not None else self.temperature,
            "max_tokens": max_tokens if max_tokens is not None else self.max_tokens,
            "response_format": {"type": "json_object"}
        }
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.openai_api_key}"
        }
        
        try:
            self.openai_calls += 1
            logger.warning(f"[OPENAI FALLBACK] Call #{self.openai_calls} - COST INCURRED")
            logger.warning(f"[OPENAI FALLBACK] Estimated cost: $0.0001-0.0005 per call")
            
            response = requests.post(
                "https://api.openai.com/v1/chat/completions",
                headers=headers,
                json=payload,
                timeout=self.timeout
            )
            
            if response.status_code != 200:
                logger.error(f"[OPENAI FALLBACK] API returned status {response.status_code}")
                raise RuntimeError(f"OpenAI API error: {response.status_code}")
            
            result = response.json()
            content = result.get("choices", [{}])[0].get("message", {}).get("content", "")
            
            if not content:
                logger.error("[OPENAI FALLBACK] Returned empty response")
                raise RuntimeError("Empty OpenAI response")
            
            logger.info(f"[OPENAI FALLBACK] Response received ({len(content)} characters)")
            return content
            
        except Exception as e:
            logger.error(f"[OPENAI FALLBACK] Failed: {e}")
            raise RuntimeError(f"OpenAI error: {str(e)}")
    
    def generate_compliance_analysis(
        self, 
        application_details: Dict[str, Any], 
        relevant_regulations: List[str]
    ) -> Dict[str, Any]:
        """
        Generate a structured compliance analysis report with fallback strategy.
        
        Fallback Priority:
        1. Local LLM (Mistral-7B)
        2. OpenAI (gpt-4o-mini) - if enabled
        3. Safe default response
        
        Args:
            application_details: Dictionary of application information
            relevant_regulations: List of relevant regulation texts
            
        Returns:
            Structured compliance analysis as dictionary
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
        
        # STRATEGY 1: Try Local LLM
        try:
            logger.info("[STRATEGY 1] Attempting local LLM analysis")
            response_text = self.chat_completion(
                messages=messages,
                temperature=0.3,
                max_tokens=2000,
                response_format="json"
            )
            
            # Validate JSON
            result = self._validate_json_response(response_text)
            if result:
                logger.info("[STRATEGY 1] Local LLM analysis successful")
                return result
            else:
                logger.warning("[STRATEGY 1] Local LLM returned invalid JSON")
                raise RuntimeError("Invalid JSON from local LLM")
                
        except Exception as e:
            logger.warning(f"[STRATEGY 1] Local LLM failed: {e}")
            
            # STRATEGY 2: Try OpenAI Fallback (if enabled)
            if self.use_openai_fallback and self.openai_api_key:
                try:
                    logger.warning("[STRATEGY 2] Attempting OpenAI fallback")
                    response_text = self.chat_completion_openai(
                        messages=messages,
                        temperature=0.3,
                        max_tokens=2000
                    )
                    
                    # Validate JSON
                    result = self._validate_json_response(response_text)
                    if result:
                        logger.info("[STRATEGY 2] OpenAI fallback successful")
                        return result
                    else:
                        logger.error("[STRATEGY 2] OpenAI returned invalid JSON")
                        raise RuntimeError("Invalid JSON from OpenAI")
                        
                except Exception as openai_error:
                    logger.error(f"[STRATEGY 2] OpenAI fallback failed: {openai_error}")
            else:
                logger.info("[STRATEGY 2] OpenAI fallback disabled or not configured")
            
            # STRATEGY 3: Return Safe Default
            logger.error("[STRATEGY 3] All LLM strategies failed - returning safe default")
            self.fallback_calls += 1
            logger.error(f"[SAFE DEFAULT] Fallback call #{self.fallback_calls}")
            return SAFE_DEFAULT_RESPONSE.copy()
    
    def _validate_json_response(self, response_text: str) -> Optional[Dict[str, Any]]:
        """
        Validate and parse JSON response from LLM.
        
        Args:
            response_text: Raw text response from LLM
            
        Returns:
            Parsed JSON dict if valid, None otherwise
        """
        try:
            result = json.loads(response_text)
            
            # Validate required fields
            required_fields = ["overall_status", "confidence_score", "issues", "checklist"]
            for field in required_fields:
                if field not in result:
                    logger.error(f"Missing required field: {field}")
                    return None
            
            # Validate status
            valid_statuses = ["compliant", "partially_compliant", "non_compliant", "needs_human_review"]
            if result["overall_status"] not in valid_statuses:
                logger.error(f"Invalid status: {result['overall_status']}")
                return None
            
            logger.info("JSON response validation successful")
            return result
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON: {e}")
            logger.error(f"Response was: {response_text[:500]}")
            return None
        except Exception as e:
            logger.error(f"Validation error: {e}")
            return None
    
    def is_available(self) -> bool:
        """
        Check if the local LLM API is available.
        
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
    
    def get_stats(self) -> Dict[str, int]:
        """
        Get LLM call statistics.
        
        Returns:
            Dictionary with call counts
        """
        return {
            "local_llm_calls": self.local_llm_calls,
            "openai_calls": self.openai_calls,
            "fallback_calls": self.fallback_calls
        }


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
