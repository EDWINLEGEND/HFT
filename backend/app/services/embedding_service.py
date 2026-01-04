"""
Embedding Service - Text to Vector Conversion
Handles text-to-embedding conversion for semantic search.

Responsibilities:
- Load and manage sentence transformer models
- Convert text to vector embeddings
- Batch embedding generation

Reference: Inspired by OLD/RagBot/store_documents.py (lines 11-12, 88-89)

Phase 2: IMPLEMENTED - Full SentenceTransformers integration
"""

from typing import List, Optional
import logging
from sentence_transformers import SentenceTransformer
import numpy as np

logger = logging.getLogger(__name__)


class EmbeddingService:
    """
    Service for generating text embeddings using sentence transformers.
    
    Uses all-MiniLM-L6-v2 model which produces 384-dimensional embeddings.
    Model is loaded once and cached for performance.
    """
    
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        """
        Initialize the embedding service.
        
        Args:
            model_name: Name of the SentenceTransformer model to use
        """
        self.model_name = model_name
        self.model: Optional[SentenceTransformer] = None
        self._load_model()
    
    def _load_model(self) -> None:
        """Load the SentenceTransformer model."""
        try:
            logger.info(f"Loading embedding model: {self.model_name}")
            self.model = SentenceTransformer(self.model_name)
            logger.info(f"Embedding model loaded successfully. Dimension: {self.get_embedding_dimension()}")
        except Exception as e:
            logger.error(f"Failed to load embedding model: {e}")
            raise
    
    def encode(self, text: str) -> List[float]:
        """
        Convert a single text string to embedding vector.
        
        Args:
            text: Input text to encode
            
        Returns:
            List of floats representing the embedding vector (384 dimensions)
            
        Raises:
            ValueError: If text is empty
            RuntimeError: If model is not loaded
        """
        if not text or not text.strip():
            raise ValueError("Text cannot be empty")
        
        if self.model is None:
            raise RuntimeError("Embedding model not loaded")
        
        try:
            # Generate embedding
            embedding = self.model.encode(text, convert_to_numpy=True)
            return embedding.tolist()
        except Exception as e:
            logger.error(f"Error encoding text: {e}")
            raise
    
    def encode_batch(self, texts: List[str]) -> List[List[float]]:
        """
        Convert multiple texts to embedding vectors efficiently.
        
        Args:
            texts: List of input texts to encode
            
        Returns:
            List of embedding vectors
            
        Raises:
            ValueError: If texts list is empty
            RuntimeError: If model is not loaded
        """
        if not texts:
            raise ValueError("Texts list cannot be empty")
        
        if self.model is None:
            raise RuntimeError("Embedding model not loaded")
        
        try:
            # Filter out empty texts
            valid_texts = [t for t in texts if t and t.strip()]
            if not valid_texts:
                raise ValueError("All texts are empty")
            
            # Generate embeddings in batch (more efficient)
            embeddings = self.model.encode(valid_texts, convert_to_numpy=True, show_progress_bar=len(valid_texts) > 10)
            return embeddings.tolist()
        except Exception as e:
            logger.error(f"Error encoding batch: {e}")
            raise
    
    def get_embedding_dimension(self) -> int:
        """
        Get the dimension of the embedding vectors.
        
        Returns:
            Dimensionality of embeddings (384 for all-MiniLM-L6-v2)
        """
        if self.model is None:
            return 0
        return self.model.get_sentence_embedding_dimension()


# Singleton instance
_embedding_service: Optional[EmbeddingService] = None


def get_embedding_service() -> EmbeddingService:
    """
    Get or create the singleton EmbeddingService instance.
    
    Returns:
        EmbeddingService instance
    """
    global _embedding_service
    if _embedding_service is None:
        _embedding_service = EmbeddingService()
    return _embedding_service
