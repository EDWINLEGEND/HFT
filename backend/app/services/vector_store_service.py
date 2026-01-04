"""
Vector Store Service - ChromaDB Operations
Manages ChromaDB vector database operations.

Responsibilities:
- Initialize and manage ChromaDB client
- Store document embeddings with metadata
- Query vector store for semantic retrieval
- Handle collection management

Reference: Inspired by OLD/RagBot/store_documents.py (lines 7-9, 91-96) 
          and OLD/RagBot/server.py (lines 16-22)

Phase 2: IMPLEMENTED - Full ChromaDB integration
"""

from typing import List, Dict, Any, Optional
import logging
import chromadb
from chromadb.config import Settings
import os

logger = logging.getLogger(__name__)


class VectorStoreService:
    """
    Service for managing ChromaDB vector store operations.
    
    Handles persistent storage of regulation documents with embeddings
    and provides semantic similarity search capabilities.
    """
    
    def __init__(self, db_path: str = "./data/vector_store", collection_name: str = "regulations"):
        """
        Initialize the vector store service.
        
        Args:
            db_path: Path to ChromaDB persistent storage
            collection_name: Name of the collection to use
        """
        self.db_path = db_path
        self.collection_name = collection_name
        self.client: Optional[chromadb.PersistentClient] = None
        self.collection: Optional[chromadb.Collection] = None
        self._initialize_client()
    
    def _initialize_client(self) -> None:
        """Initialize ChromaDB client and collection."""
        try:
            # Ensure directory exists
            os.makedirs(self.db_path, exist_ok=True)
            
            # Initialize persistent client
            logger.info(f"Initializing ChromaDB at {self.db_path}")
            self.client = chromadb.PersistentClient(path=self.db_path)
            
            # Get or create collection
            try:
                self.collection = self.client.get_collection(name=self.collection_name)
                logger.info(f"Loaded existing collection: {self.collection_name}")
            except Exception:
                self.collection = self.client.create_collection(
                    name=self.collection_name,
                    metadata={"description": "Industrial regulations and compliance documents"}
                )
                logger.info(f"Created new collection: {self.collection_name}")
            
            logger.info(f"ChromaDB initialized. Collection count: {self.get_collection_count()}")
        except Exception as e:
            logger.error(f"Failed to initialize ChromaDB: {e}")
            raise
    
    def add_documents(
        self, 
        documents: List[str], 
        embeddings: List[List[float]], 
        metadatas: Optional[List[Dict[str, Any]]] = None,
        ids: Optional[List[str]] = None
    ) -> None:
        """
        Add documents with their embeddings to the vector store.
        
        Args:
            documents: List of document texts
            embeddings: List of embedding vectors
            metadatas: Optional metadata for each document (regulation_name, clause_id, department)
            ids: Optional unique IDs for each document
            
        Raises:
            ValueError: If input lists have mismatched lengths
            RuntimeError: If collection is not initialized
        """
        if self.collection is None:
            raise RuntimeError("Collection not initialized")
        
        if len(documents) != len(embeddings):
            raise ValueError("Documents and embeddings must have same length")
        
        if metadatas and len(metadatas) != len(documents):
            raise ValueError("Metadatas must have same length as documents")
        
        try:
            # Generate IDs if not provided
            if ids is None:
                existing_count = self.get_collection_count()
                ids = [f"doc_{existing_count + i}" for i in range(len(documents))]
            
            # Add to collection
            self.collection.add(
                documents=documents,
                embeddings=embeddings,
                metadatas=metadatas,
                ids=ids
            )
            logger.info(f"Added {len(documents)} documents to collection")
        except Exception as e:
            logger.error(f"Error adding documents: {e}")
            raise
    
    def query(
        self, 
        query_embedding: List[float], 
        n_results: int = 5,
        where: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Query the vector store for similar documents.
        
        Args:
            query_embedding: Embedding vector of the query
            n_results: Number of results to return
            where: Optional metadata filter (e.g., {"department": "Environment"})
            
        Returns:
            Dictionary containing:
                - documents: List of matching document texts
                - distances: List of similarity distances
                - metadatas: List of metadata dicts
                - ids: List of document IDs
                
        Raises:
            RuntimeError: If collection is not initialized
        """
        if self.collection is None:
            raise RuntimeError("Collection not initialized")
        
        try:
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=n_results,
                where=where
            )
            
            logger.info(f"Query returned {len(results['documents'][0])} results")
            return {
                "documents": results["documents"][0] if results["documents"] else [],
                "distances": results["distances"][0] if results["distances"] else [],
                "metadatas": results["metadatas"][0] if results["metadatas"] else [],
                "ids": results["ids"][0] if results["ids"] else []
            }
        except Exception as e:
            logger.error(f"Error querying collection: {e}")
            raise
    
    def get_collection_count(self) -> int:
        """
        Get the number of documents in the collection.
        
        Returns:
            Number of documents stored
        """
        if self.collection is None:
            return 0
        try:
            return self.collection.count()
        except Exception:
            return 0
    
    def delete_collection(self) -> None:
        """
        Delete the entire collection.
        
        WARNING: This will remove all stored documents.
        """
        if self.client is None:
            return
        
        try:
            self.client.delete_collection(name=self.collection_name)
            logger.warning(f"Deleted collection: {self.collection_name}")
            # Reinitialize
            self._initialize_client()
        except Exception as e:
            logger.error(f"Error deleting collection: {e}")
            raise
    
    def get_by_ids(self, ids: List[str]) -> Dict[str, Any]:
        """
        Retrieve documents by their IDs.
        
        Args:
            ids: List of document IDs
            
        Returns:
            Dictionary with documents, metadatas, and ids
        """
        if self.collection is None:
            raise RuntimeError("Collection not initialized")
        
        try:
            results = self.collection.get(ids=ids)
            return results
        except Exception as e:
            logger.error(f"Error getting documents by IDs: {e}")
            raise


# Singleton instance
_vector_store_service: Optional[VectorStoreService] = None


def get_vector_store_service() -> VectorStoreService:
    """
    Get or create the singleton VectorStoreService instance.
    
    Returns:
        VectorStoreService instance
    """
    global _vector_store_service
    if _vector_store_service is None:
        _vector_store_service = VectorStoreService()
    return _vector_store_service
