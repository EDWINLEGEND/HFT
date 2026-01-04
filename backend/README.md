# CivicAssist Backend

Clean FastAPI backend for the CivicAssist industrial compliance system.

## Architecture

This backend follows a **clean architecture** pattern with clear separation of concerns:

```
backend/
├── main.py                 # FastAPI application entry point
├── app/
│   ├── api/                # API layer (HTTP routes)
│   │   └── v1/
│   │       └── routes.py   # API v1 endpoints
│   ├── core/               # Core configuration
│   │   └── config.py       # Settings management
│   ├── services/           # Business logic layer
│   │   ├── embedding_service.py
│   │   ├── vector_store_service.py
│   │   ├── llm_service.py
│   │   ├── compliance_service.py
│   │   ├── chat_service.py
│   │   └── document_service.py
│   ├── models/             # Data models
│   │   └── schemas.py      # Pydantic models
│   └── utils/              # Utility functions
```

## What This Backend Does

### Phase 1 (Current)
- ✅ Provides RESTful API endpoints
- ✅ Health check and version information
- ✅ Request/response validation with Pydantic
- ✅ CORS configuration for frontend integration
- ✅ Clean service layer stubs with clear interfaces

### What This Backend Does NOT Do Yet
- ❌ No actual LLM calls
- ❌ No RAG implementation
- ❌ No ChromaDB document ingestion
- ❌ No embedding generation
- ❌ No compliance analysis logic
- ❌ No chatbot conversation logic

All service layers are **well-documented stubs** that define clear interfaces for future implementation.

## API Endpoints

### System Endpoints
- `GET /` - Root welcome message
- `GET /api/v1/health` - Health check
- `GET /api/v1/version` - API version info

### Compliance Endpoints (Stubs)
- `POST /api/v1/compliance/analyze` - Analyze industrial application

### Chatbot Endpoints (Stubs)
- `POST /api/v1/chat` - Chat with AI assistant

## Installation

```bash
cd backend
pip install -r requirements.txt
```

## Running the Server

```bash
# Development mode with auto-reload
uvicorn main:app --reload --port 8000

# Production mode
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Configuration

Configuration is managed via `app/core/config.py` using Pydantic Settings.

Create a `.env` file in the backend directory to override defaults:

```env
API_PORT=8000
DEBUG=true
LLM_API_URL=http://localhost:1234/v1/chat/completions
VECTOR_STORE_PATH=./data/vector_store
```

## Testing

Once the server is running, visit:
- **Interactive API Docs**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/api/v1/health

## What Will Be Added in Later Phases

### Phase 2: RAG Implementation
- ChromaDB integration for regulation storage
- SentenceTransformers for embeddings
- Semantic search functionality

### Phase 3: LLM Integration
- Local LLM inference (LM Studio)
- OpenAI fallback support
- Prompt engineering for compliance analysis

### Phase 4: Advanced Features
- Confidence scoring
- Risk categorization
- Multi-department tagging
- Regulation coverage tracking

## Reference

This backend is inspired by `OLD/RagBot/server.py` but redesigned with:
- Better separation of concerns
- Service layer pattern
- Type safety with Pydantic
- Extensible architecture
- Clear documentation
