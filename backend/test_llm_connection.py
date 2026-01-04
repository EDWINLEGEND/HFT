import requests
import json

# Test LLM connection
url = "http://localhost:1234/v1/chat/completions"
payload = {
    "model": "mistralai-mistral-7b-instruct-v0.2-smashed",
    "messages": [{"role": "user", "content": "Say hello in one word"}],
    "max_tokens": 10,
    "temperature": 0.3
}

try:
    print("Testing LLM connection...")
    print(f"URL: {url}")
    print(f"Payload: {json.dumps(payload, indent=2)}")
    
    response = requests.post(url, json=payload, timeout=30)
    print(f"\nStatus Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"ERROR: {e}")
