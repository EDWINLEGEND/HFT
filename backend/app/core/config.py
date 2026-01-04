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
    app_version: str = "0.1.0"
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    debug: bool = False
    
    # CORS Settings
    cors_origins: list = ["http://localhost:8501", "http://127.0.0.1:8501"]
    
    # Vector Store Configuration
    vector_store_path: str = "./data/vector_store"
    collection_name: str = "regulations"
    
    # Embedding Model Configuration
    embedding_model_name: str = "all-MiniLM-L6-v2"
    
    # LLM Configuration
    llm_api_url: str = "http://localhost:1234/v1/chat/completions"
    llm_model_name: str = "amethyst-13b-mistral"
    llm_temperature: float = 0.7
    llm_max_tokens: int = -1
    
    # OpenAI Fallback (Optional)
    openai_api_key: Optional[str] = None
    openai_model: str = "gpt-4"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


# Global settings instance
settings = Settings()
