"""
Configuration management for CivicAssist backend.
Uses Pydantic Settings for environment variable loading and validation.
"""

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    Provides configuration for API, vector store, and LLM endpoints.
    """
    
    # API Configuration
    app_name: str = "CivicAssist API"
    app_version: str = "0.5.0"  # Phase 5
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    debug: bool = False
    
    # CORS Settings (Updated for Next.js)
    cors_origins: list = [
        "http://localhost:3000",  # Next.js dev server
        "http://localhost:8501",  # Streamlit (legacy)
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8501"
    ]
    
    # Vector Store Configuration
    vector_store_path: str = "./data/vector_store"
    collection_name: str = "regulations"
    
    # Embedding Model Configuration
    embedding_model_name: str = "all-MiniLM-L6-v2"
    
    # LLM Configuration (Phase 3)
    llm_api_url: str = "http://localhost:1234/v1/chat/completions"  # LM Studio default
    llm_model_name: str = "mistralai-mistral-7b-instruct-v0.2-smashed"  # Must match LM Studio model name
    llm_temperature: float = 0.3  # Lower for compliance analysis
    llm_max_tokens: int = 2000  # Hard limit for safety
    llm_timeout: int = 90  # 90 second timeout for slower models
    
    # OpenAI Fallback Configuration (Phase 5)
    use_openai_fallback: bool = False  # Set to True to enable OpenAI fallback
    openai_api_key: Optional[str] = None  # Set via environment variable
    openai_model: str = "gpt-4o-mini"  # Cost-effective model (~$0.0001-0.0005 per call)
    
    # Demo Mode (Phase 5)
    demo_mode: bool = False  # Set to True for demo hardening
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


# Global settings instance
settings = Settings()
