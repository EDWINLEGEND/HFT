import sys
import os
import requests
import logging

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from app.core.config import settings
from app.services.embedding_service import get_embedding_service
from app.services.vector_store_service import get_vector_store_service

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def check_llm():
    print("\n--- CHECKING LLM (MISTRAL) ---")
    try:
        url = settings.llm_api_url
        print(f"Connecting to LLM at: {url}")
        
        # Simple health check (listing models or simple chat)
        # Most OpenAI-compatible endpoints support GET /v1/models
        models_url = url.replace("/chat/completions", "/models")
        resp = requests.get(models_url, timeout=5)
        
        if resp.status_code == 200:
            print("✅ LLM Service is REACHABLE.")
            models = resp.json()
            print(f"Available Models: {models}")
            
            # Try a simple inference
            print("Attempting simple inference...")
            chat_url = url
            payload = {
                "model": settings.llm_model_name,
                "messages": [{"role": "user", "content": "Hello, are you working?"}],
                "max_tokens": 10
            }
            chat_resp = requests.post(chat_url, json=payload, timeout=10)
            if chat_resp.status_code == 200:
                print(f"✅ Inference Successful: {chat_resp.json()['choices'][0]['message']['content']}")
            else:
                print(f"❌ Inference Failed: {chat_resp.status_code} - {chat_resp.text}")
        else:
            print(f"❌ LLM Service returned status {resp.status_code}")
            
    except Exception as e:
        print(f"❌ LLM Service is UNREACHABLE: {e}")
        print("-> Ensure LM Studio/Ollama is running on port 1234")

def check_embeddings():
    print("\n--- CHECKING EMBEDDINGS ---")
    try:
        service = get_embedding_service()
        text = "Test embedding generation"
        vector = service.encode(text)
        if len(vector) > 0:
            print(f"✅ Embedding Generation Successful (Vector Dim: {len(vector)})")
        else:
            print("❌ Embedding Generation Failed (Empty Vector)")
    except Exception as e:
        print(f"❌ Embedding Service Error: {e}")

def check_vector_store():
    print("\n--- CHECKING VECTOR STORE (REGULATIONS) ---")
    try:
        store = get_vector_store_service()
        count = store.collection.count()
        print(f"Total Regulations Indexed: {count}")
        
        if count > 0:
            print("✅ Vector Store is Populated.")
            # Retrieve test
            results = store.query(query_embedding=[0.1]*384, n_results=1) # Dim depends on model, assumed 384 for MiniLM
            print("✅ Retrieval Test Passed")
        else:
            print("⚠️ Vector Store is EMPTY. Regulations might not be indexed.")
            
    except Exception as e:
        print(f"❌ Vector Store Error: {e}")

if __name__ == "__main__":
    check_embeddings()
    check_vector_store()
    check_llm()
