"""
Document Service - Document Processing
Handles document upload, parsing, and text extraction.

Responsibilities:
- PDF text extraction
- DOCX text extraction
- Document validation and preprocessing
- File type detection

Reference: Inspired by OLD/RagBot/store_documents.py (lines 22-53)

NOTE: This is a STUB for Phase 1. Actual implementation will be added in Phase 2.
"""

from typing import Optional
import logging

logger = logging.getLogger(__name__)


class DocumentService:
    """
    Service for document processing and text extraction.
    
    In future phases, this will:
    - Extract text from PDFs using PyMuPDF (fitz)
    - Extract text from DOCX using python-docx
    - Handle TXT files
    - Validate file formats and sizes
    - Clean and preprocess extracted text
    - Support multiple document formats
    """
    
    def __init__(self):
        """Initialize the document service."""
        self.supported_extensions = [".pdf", ".docx", ".txt"]
        logger.info("DocumentService initialized (stub)")
    
    def extract_text_from_pdf(self, pdf_path: str) -> str:
        """
        Extract text from a PDF file.
        
        Args:
            pdf_path: Path to the PDF file
            
        Returns:
            Extracted text content
            
        NOTE: Stub implementation - returns empty string for now
        """
        logger.warning("extract_text_from_pdf() called but not implemented (Phase 1 stub)")
        return ""
    
    def extract_text_from_docx(self, docx_path: str) -> str:
        """
        Extract text from a DOCX file.
        
        Args:
            docx_path: Path to the DOCX file
            
        Returns:
            Extracted text content
            
        NOTE: Stub implementation - returns empty string for now
        """
        logger.warning("extract_text_from_docx() called but not implemented (Phase 1 stub)")
        return ""
    
    def extract_text_from_txt(self, txt_path: str) -> str:
        """
        Extract text from a TXT file.
        
        Args:
            txt_path: Path to the TXT file
            
        Returns:
            Extracted text content
            
        NOTE: Stub implementation - returns empty string for now
        """
        logger.warning("extract_text_from_txt() called but not implemented (Phase 1 stub)")
        return ""
    
    def extract_text(self, file_path: str) -> str:
        """
        Extract text from any supported document format.
        
        Args:
            file_path: Path to the document
            
        Returns:
            Extracted text content
            
        Raises:
            ValueError: If file format is not supported
            
        NOTE: Stub implementation - returns empty string for now
        """
        logger.warning("extract_text() called but not implemented (Phase 1 stub)")
        return ""
    
    def is_supported_format(self, filename: str) -> bool:
        """
        Check if the file format is supported.
        
        Args:
            filename: Name of the file
            
        Returns:
            True if format is supported, False otherwise
        """
        return any(filename.lower().endswith(ext) for ext in self.supported_extensions)


# Singleton instance
_document_service: Optional[DocumentService] = None


def get_document_service() -> DocumentService:
    """
    Get or create the singleton DocumentService instance.
    
    Returns:
        DocumentService instance
    """
    global _document_service
    if _document_service is None:
        _document_service = DocumentService()
    return _document_service
