import requests
import os

API_URL = "http://localhost:8000/api/v1/documents/extract"
FILE_PATH = "sample_application_data.txt"

def test_extraction_endpoint():
    if not os.path.exists(FILE_PATH):
        print(f"❌ File not found: {FILE_PATH}")
        # Create a dummy one if missing for some reason
        with open(FILE_PATH, "w") as f:
            f.write("Industrial Application\nName: Test Ind\nArea: 500 sqft")
            
    print(f"Testing upload with {FILE_PATH}...")
    
    try:
        with open(FILE_PATH, "rb") as f:
            files = {"file": (FILE_PATH, f, "text/plain")}
            response = requests.post(API_URL, files=files, timeout=60)
            
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print("✅ Success:")
            print(response.json())
        else:
            print(f"❌ Failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Request failed: {e}")

if __name__ == "__main__":
    test_extraction_endpoint()
