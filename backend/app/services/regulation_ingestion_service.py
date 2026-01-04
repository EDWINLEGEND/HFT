"""
Regulation Ingestion Service - Document Processing Pipeline
Handles ingestion of regulation documents into the vector store.

Responsibilities:
- Load regulation documents from /data/regulations
- Chunk text (300-500 tokens)
- Generate embeddings using SentenceTransformers
- Store embeddings in ChromaDB with metadata

Reference: Inspired by OLD/RagBot/store_documents.py, refactored for service-based ingestion

Phase 2: IMPLEMENTED - Full regulation ingestion pipeline
"""

from typing import List, Dict, Any, Optional, Tuple
import logging
import os
from pathlib import Path
import re

# Document parsing libraries
try:
    import fitz  # PyMuPDF
    PYMUPDF_AVAILABLE = True
except ImportError:
    PYMUPDF_AVAILABLE = False
    logging.warning("PyMuPDF not available. PDF support disabled.")

try:
    import docx
    DOCX_AVAILABLE = True
except ImportError:
    DOCX_AVAILABLE = False
    logging.warning("python-docx not available. DOCX support disabled.")

from app.services.embedding_service import get_embedding_service
from app.services.vector_store_service import get_vector_store_service

logger = logging.getLogger(__name__)


class RegulationIngestionService:
    """
    Service for ingesting regulation documents into the vector store.
    
    Supports PDF, DOCX, and TXT files. Chunks documents into manageable pieces
    and stores them with metadata for retrieval.
    """
    
    def __init__(
        self,
        regulations_dir: str = "../data/regulations",
        chunk_size: int = 400,  # Target tokens (roughly 300-500 words)
        chunk_overlap: int = 50
    ):
        """
        Initialize the ingestion service.
        
        Args:
            regulations_dir: Directory containing regulation documents
            chunk_size: Target size for text chunks (in tokens/words)
            chunk_overlap: Overlap between chunks to preserve context
        """
        self.regulations_dir = regulations_dir
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.embedding_service = get_embedding_service()
        self.vector_store = get_vector_store_service()
        self.supported_extensions = [".pdf", ".docx", ".txt"]
    
    def extract_text_from_pdf(self, pdf_path: str) -> str:
        """
        Extract text from a PDF file using PyMuPDF.
        
        Args:
            pdf_path: Path to the PDF file
            
        Returns:
            Extracted text content
        """
        if not PYMUPDF_AVAILABLE:
            raise RuntimeError("PyMuPDF not installed. Cannot process PDF files.")
        
        text = ""
        try:
            doc = fitz.open(pdf_path)
            for page in doc:
                text += page.get_text() + "\n"
            doc.close()
            logger.info(f"Extracted {len(text)} characters from PDF: {pdf_path}")
        except Exception as e:
            logger.error(f"Error extracting text from PDF {pdf_path}: {e}")
            raise
        
        return text.strip()
    
    def extract_text_from_docx(self, docx_path: str) -> str:
        """
        Extract text from a DOCX file.
        
        Args:
            docx_path: Path to the DOCX file
            
        Returns:
            Extracted text content
        """
        if not DOCX_AVAILABLE:
            raise RuntimeError("python-docx not installed. Cannot process DOCX files.")
        
        text = ""
        try:
            doc = docx.Document(docx_path)
            for para in doc.paragraphs:
                text += para.text + "\n"
            logger.info(f"Extracted {len(text)} characters from DOCX: {docx_path}")
        except Exception as e:
            logger.error(f"Error extracting text from DOCX {docx_path}: {e}")
            raise
        
        return text.strip()
    
    def extract_text_from_txt(self, txt_path: str) -> str:
        """
        Extract text from a TXT file.
        
        Args:
            txt_path: Path to the TXT file
            
        Returns:
            Extracted text content
        """
        try:
            with open(txt_path, "r", encoding="utf-8") as file:
                text = file.read()
            logger.info(f"Extracted {len(text)} characters from TXT: {txt_path}")
            return text.strip()
        except Exception as e:
            logger.error(f"Error reading TXT {txt_path}: {e}")
            raise
    
    def extract_text(self, file_path: str) -> str:
        """
        Extract text from any supported document format.
        
        Args:
            file_path: Path to the document
            
        Returns:
            Extracted text content
            
        Raises:
            ValueError: If file format is not supported
        """
        ext = Path(file_path).suffix.lower()
        
        if ext == ".pdf":
            return self.extract_text_from_pdf(file_path)
        elif ext == ".docx":
            return self.extract_text_from_docx(file_path)
        elif ext == ".txt":
            return self.extract_text_from_txt(file_path)
        else:
            raise ValueError(f"Unsupported file format: {ext}")
    
    def chunk_text(self, text: str, metadata: Dict[str, Any]) -> List[Tuple[str, Dict[str, Any]]]:
        """
        Chunk text into smaller pieces for embedding.
        
        Uses simple sentence-based chunking with overlap to preserve context.
        
        Args:
            text: Full text to chunk
            metadata: Base metadata to attach to each chunk
            
        Returns:
            List of (chunk_text, chunk_metadata) tuples
        """
        # Split into sentences (simple approach)
        sentences = re.split(r'(?<=[.!?])\s+', text)
        
        chunks = []
        current_chunk = []
        current_length = 0
        
        for sentence in sentences:
            sentence_length = len(sentence.split())
            
            if current_length + sentence_length > self.chunk_size and current_chunk:
                # Save current chunk
                chunk_text = " ".join(current_chunk)
                chunk_metadata = metadata.copy()
                chunk_metadata["chunk_index"] = len(chunks)
                chunks.append((chunk_text, chunk_metadata))
                
                # Start new chunk with overlap
                overlap_sentences = current_chunk[-3:] if len(current_chunk) > 3 else current_chunk
                current_chunk = overlap_sentences + [sentence]
                current_length = sum(len(s.split()) for s in current_chunk)
            else:
                current_chunk.append(sentence)
                current_length += sentence_length
        
        # Add final chunk
        if current_chunk:
            chunk_text = " ".join(current_chunk)
            chunk_metadata = metadata.copy()
            chunk_metadata["chunk_index"] = len(chunks)
            chunks.append((chunk_text, chunk_metadata))
        
        logger.info(f"Created {len(chunks)} chunks from text")
        return chunks
    
    def ingest_document(
        self,
        file_path: str,
        regulation_name: Optional[str] = None,
        department: Optional[str] = None,
        clause_id: Optional[str] = None
    ) -> int:
        """
        Ingest a single document into the vector store.
        
        Args:
            file_path: Path to the document file
            regulation_name: Name of the regulation (defaults to filename)
            department: Department responsible (e.g., "Environment", "Fire Safety")
            clause_id: Specific clause identifier
            
        Returns:
            Number of chunks ingested
        """
        # Extract text
        text = self.extract_text(file_path)
        
        if not text:
            logger.warning(f"No text extracted from {file_path}")
            return 0
        
        # Prepare metadata
        if regulation_name is None:
            regulation_name = Path(file_path).stem
        
        base_metadata = {
            "regulation_name": regulation_name,
            "source_file": Path(file_path).name,
            "department": department or "General",
            "clause_id": clause_id or "N/A"
        }
        
        # Chunk text
        chunks = self.chunk_text(text, base_metadata)
        
        if not chunks:
            logger.warning(f"No chunks created from {file_path}")
            return 0
        
        # Generate embeddings
        chunk_texts = [chunk[0] for chunk in chunks]
        chunk_metadatas = [chunk[1] for chunk in chunks]
        
        logger.info(f"Generating embeddings for {len(chunk_texts)} chunks...")
        embeddings = self.embedding_service.encode_batch(chunk_texts)
        
        # Generate unique IDs
        base_id = Path(file_path).stem
        ids = [f"{base_id}_chunk_{i}" for i in range(len(chunks))]
        
        # Store in vector database
        self.vector_store.add_documents(
            documents=chunk_texts,
            embeddings=embeddings,
            metadatas=chunk_metadatas,
            ids=ids
        )
        
        logger.info(f"Successfully ingested {len(chunks)} chunks from {file_path}")
        return len(chunks)
    
    def ingest_directory(self, directory: Optional[str] = None) -> Dict[str, Any]:
        """
        Ingest all supported documents from a directory.
        
        Args:
            directory: Directory to scan (defaults to self.regulations_dir)
            
        Returns:
            Dictionary with ingestion statistics
        """
        if directory is None:
            directory = self.regulations_dir
        
        if not os.path.exists(directory):
            raise FileNotFoundError(f"Directory not found: {directory}")
        
        # Find all supported files
        files = []
        for ext in self.supported_extensions:
            files.extend(Path(directory).rglob(f"*{ext}"))
        
        if not files:
            logger.warning(f"No supported documents found in {directory}")
            return {
                "total_files": 0,
                "successful": 0,
                "failed": 0,
                "total_chunks": 0
            }
        
        logger.info(f"Found {len(files)} documents to ingest")
        
        successful = 0
        failed = 0
        total_chunks = 0
        
        for file_path in files:
            try:
                # Extract department from subdirectory if present
                parts = file_path.parts
                regulations_idx = parts.index("regulations") if "regulations" in parts else -1
                department = parts[regulations_idx + 1] if regulations_idx >= 0 and regulations_idx + 1 < len(parts) else None
                
                chunks = self.ingest_document(
                    str(file_path),
                    department=department
                )
                total_chunks += chunks
                successful += 1
            except Exception as e:
                logger.error(f"Failed to ingest {file_path}: {e}")
                failed += 1
        
        stats = {
            "total_files": len(files),
            "successful": successful,
            "failed": failed,
            "total_chunks": total_chunks
        }
        
        logger.info(f"Ingestion complete: {stats}")
        return stats


# Singleton instance
_ingestion_service: Optional[RegulationIngestionService] = None


def get_ingestion_service() -> RegulationIngestionService:
    """
    Get or create the singleton RegulationIngestionService instance.
    
    Returns:
        RegulationIngestionService instance
    """
    global _ingestion_service
    if _ingestion_service is None:
        _ingestion_service = RegulationIngestionService()
    return _ingestion_service
