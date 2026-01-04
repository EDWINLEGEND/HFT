import logging
from typing import Dict, Any, List
import io
import json
from pydantic import ValidationError
from app.models.schemas import IndustrialApplication
from app.services.llm_service import get_llm_service
from pypdf import PdfReader

logger = logging.getLogger(__name__)

class DocumentService:
    """
    Service for handling document processing, extraction, and validation.
    """
    
    def __init__(self):
        self.llm_service = get_llm_service()
    
    def extract_text(self, file_content: bytes, filename: str) -> str:
        """
        Extract text from a document file (PDF or Text).
        """
        if filename.lower().endswith('.pdf'):
            return self._extract_from_pdf(file_content)
        else:
            # Assume text file
            return file_content.decode('utf-8', errors='ignore')
            
    def _extract_from_pdf(self, file_content: bytes) -> str:
        try:
            reader = PdfReader(io.BytesIO(file_content))
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            return text
        except Exception as e:
            logger.error(f"PDF extraction failed: {e}")
            raise ValueError("Could not extract text from PDF")

    def parse_application_details(self, text: str) -> Dict[str, Any]:
        """
        Use LLM to parse raw text into structured IndustrialApplication fields.
        """
        system_prompt = """You are a precise data extraction engine.
        Your task is to extract specific industrial application details from the input text and return them as a JSON object.
        
        REQUIRED JSON STRUCTURE:
        {
            "industry_name": "string (name of the company or unit)",
            "square_feet": "string (total area)",
            "water_source": "string (e.g., Municipal supply, Well)",
            "drainage": "string (effluent treatment details)",
            "air_pollution": "string (control measures like stacks, scrubbers)",
            "waste_management": "string (solid/liquid waste disposal plan)",
            "nearby_homes": "string (distance to nearest residence)",
            "water_level_depth": "string (groundwater depth)"
        }
        
        RULES:
        1. Output ONLY valid JSON. Do not include markdown formatting like ```json or ```.
        2. If a field is not found, use "Not specified".
        3. Be concise.
        """
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Extract details from this text:\n\n{text[:3000]}"} # Limit context
        ]
        
        try:
            # Use LLM to extract
            response_text = self.llm_service.chat_completion(
                messages=messages,
                temperature=0.1,  # Low temperature for extraction
                max_tokens=1000,
                response_format="json"
            )
            
            # Robust Cleaning
            cleaned_text = response_text.strip()
            # Remove markdown code blocks if present
            if "```json" in cleaned_text:
                cleaned_text = cleaned_text.split("```json")[1].split("```")[0].strip()
            elif "```" in cleaned_text:
                cleaned_text = cleaned_text.split("```")[1].split("```")[0].strip()
            
            # Remove any leading/trailing characters that aren't brackets
            start_idx = cleaned_text.find('{')
            end_idx = cleaned_text.rfind('}')
            
            if start_idx == -1 or end_idx == -1:
                logger.error(f"No JSON brackets found in response: {cleaned_text}")
                raise ValueError("LLM did not return a JSON object")
                
            json_str = cleaned_text[start_idx:end_idx+1]
            data = json.loads(json_str)
            
            return data
            
        except Exception as e:
            logger.error(f"LLM extraction failed: {e}")
            logger.error(f"Response was: {response_text if 'response_text' in locals() else 'No response'}")
            raise ValueError(f"Failed to parse application details: {str(e)}")

    def validate_document(self, text: str, doc_type: str) -> Dict[str, Any]:
        """
        Validate if the document content matches the expected document type.
        """
        system_prompt = f"""You are a document verification expert.
        Analyze the text to determine if it is a valid '{doc_type}'.
        
        Return JSON:
        {{
            "is_valid": boolean,
            "confidence": float (0-1),
            "reason": "explanation"
        }}
        """
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Verify this document text:\n\n{text[:2000]}"} # Send first 2k chars
        ]
        
        try:
            response_text = self.llm_service.chat_completion(
                messages=messages,
                temperature=0.1,
                max_tokens=500
            )
            
             # Clean and parse JSON (using same logic as above)
            cleaned_text = response_text.strip()
            if "```json" in cleaned_text:
                cleaned_text = cleaned_text.split("```json")[1].split("```")[0].strip()
            elif "```" in cleaned_text:
                cleaned_text = cleaned_text.split("```")[1].split("```")[0].strip()
            
            return json.loads(cleaned_text)
        except Exception as e:
            logger.error(f"Document verification failed: {e}")
            return {"is_valid": False, "confidence": 0, "reason": "Verification process failed"}

# Singleton
_doc_service = None

def get_document_service():
    global _doc_service
    if _doc_service is None:
        _doc_service = DocumentService()
    return _doc_service
