import sys
import os
import asyncio

# Add project root to path
sys.path.append(os.getcwd())

from app.services.document_service import get_document_service

async def main():
    try:
        service = get_document_service()
        
        # Read sample text
        with open("../sample_application_data.txt", "r", encoding="utf-8") as f:
            text_content = f.read()
            
        print("--- RAW TEXT CONTENT ---")
        print(text_content[:200])
        print("...\n")
        
        print("--- EXTRACTING ---")
        # Test just the parsing logic (mocking the extraction part since we have text)
        data = service.parse_application_details(text_content)
        
        print("--- RESULT ---")
        import json
        print(json.dumps(data, indent=2))
        
        # Verify keys
        required = ["industry_name", "square_feet", "water_source"]
        missing = [k for k in required if k not in data]
        if missing:
            print(f"\n❌ FAILED: Missing keys: {missing}")
        else:
            print("\n✅ SUCCESS: All critical keys found.")
            
    except Exception as e:
        print(f"\n❌ CRASHED: {e}")

if __name__ == "__main__":
    asyncio.run(main())
