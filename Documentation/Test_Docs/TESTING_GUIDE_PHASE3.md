# Phase 3 Testing Guide

## Prerequisites

### 1. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Set Up Local LLM

**Option A: LM Studio (Recommended)**
1. Download LM Studio from https://lmstudio.ai/
2. Load a model (e.g., `mistralai/Mistral-7B-Instruct-v0.2`)
3. Start the local server (default: `http://localhost:1234`)
4. Verify it's running

**Option B: Ollama**
```bash
ollama pull mistral
ollama serve
```

### 3. Ingest Sample Regulations

```bash
# Start backend server
cd backend
python main.py

# In another terminal, ingest regulations
curl -X POST http://localhost:8000/api/v1/regulations/ingest
```

**Expected Output**:
```json
{
  "success": true,
  "message": "Ingested 1 files successfully",
  "total_files": 1,
  "successful": 1,
  "failed": 0,
  "total_chunks": 15
}
```

---

## Test 1: Verify LLM Availability

### Check LLM Service

```bash
curl http://localhost:1234/v1/models
```

**Expected**: List of loaded models

### Test from Python

```python
from app.services.llm_service import get_llm_service

llm = get_llm_service()
print(f"LLM available: {llm.is_available()}")
```

---

## Test 2: Regulation Retrieval

### Search Regulations

```bash
curl "http://localhost:8000/api/v1/regulations/search?query=fire%20safety%20requirements&n_results=5"
```

**Expected Output**:
```json
{
  "query": "fire safety requirements",
  "results": [
    "All industrial units must maintain fire extinguishers at intervals not exceeding 15 meters...",
    "Every industrial building must have minimum two emergency exits on each floor...",
    ...
  ],
  "metadatas": [
    {
      "regulation_name": "kerala_industrial_safety_2023",
      "department": "General",
      "clause_id": "N/A",
      "chunk_index": 2
    }
  ],
  "distances": [0.234, 0.289, ...],
  "count": 5
}
```

---

## Test 3: Full Compliance Analysis

### Test Application

```bash
curl -X POST http://localhost:8000/api/v1/compliance/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "industry_name": "ABC Textile Manufacturing",
    "square_feet": "5000",
    "water_source": "Municipal water supply",
    "drainage": "Connected to city drainage system",
    "air_pollution": "Electrostatic precipitators installed",
    "waste_management": "Segregated waste disposal with authorized vendor",
    "nearby_homes": "500 meters",
    "water_level_depth": "50 feet"
  }'
```

### Expected Response Structure

```json
{
  "application_id": "ABC Textile Manufacturing",
  "status": "partially_compliant",
  "confidence_score": 0.85,
  "issues": [
    {
      "issue_type": "missing_document",
      "severity": "high",
      "description": "Fire safety certificate not mentioned in application",
      "regulation_reference": "Kerala Industrial Safety Regulations 2023, Section 2.3",
      "department": "fire"
    },
    {
      "issue_type": "ambiguity",
      "severity": "medium",
      "description": "Distance to residential area (500m) is at minimum threshold for medium industries",
      "regulation_reference": "Kerala Industrial Safety Regulations 2023, Section 4.1",
      "department": "local_body"
    }
  ],
  "missing_documents": [
    "Fire safety certificate not mentioned in application"
  ],
  "recommendations": [
    "Submit fire safety certificate from Fire Department",
    "Provide environmental clearance certificate",
    "Consider increasing buffer zone to residential area",
    "Submit water source NOC from Water Authority"
  ],
  "regulation_coverage": 0.92,
  "generated_at": "2026-01-04T15:30:00.000Z"
}
```

---

## Test 4: Safety Fallbacks

### Test 1: LLM Unavailable

**Stop LM Studio**, then:

```bash
curl -X POST http://localhost:8000/api/v1/compliance/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "industry_name": "Test Industry",
    "square_feet": "1000",
    "water_source": "Well",
    "drainage": "Septic",
    "air_pollution": "None",
    "waste_management": "Onsite",
    "nearby_homes": "100m",
    "water_level_depth": "30ft"
  }'
```

**Expected**: Fallback response with `status: "partial"` and confidence 0.0

```json
{
  "status": "partial",
  "confidence_score": 0.0,
  "issues": [
    {
      "issue_type": "ambiguity",
      "severity": "high",
      "description": "Automated analysis unavailable: LLM analysis error: ...",
      "regulation_reference": "System Error",
      "department": "other"
    }
  ],
  "missing_documents": ["Manual review required"],
  "recommendations": ["Submit application for manual review by compliance officer"],
  "regulation_coverage": 0.0
}
```

### Test 2: Empty Vector Store

**Delete vector store**, then analyze:

```bash
rm -rf data/vector_store/*
```

**Expected**: Fallback with "No relevant regulations found in database"

### Test 3: Invalid Application Data

```bash
curl -X POST http://localhost:8000/api/v1/compliance/analyze \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected**: 422 Validation Error (Pydantic validation)

---

## Test 5: JSON Validation

### Valid LLM Output

The LLM should return JSON matching this structure:

```json
{
  "overall_status": "partially_compliant",
  "confidence_score": 85,
  "time_saved_minutes": 45,
  "regulation_coverage_percent": 92,
  "issues": [
    {
      "type": "missing_document",
      "risk_level": "high",
      "department": "fire",
      "regulation_reference": {
        "name": "Kerala Industrial Safety Regulations 2023",
        "clause": "Section 2.3"
      },
      "document_excerpt": "No industrial unit shall operate without a valid Fire Safety Certificate",
      "explanation": "Fire safety certificate not mentioned in application"
    }
  ],
  "checklist": [
    "Submit fire safety certificate",
    "Obtain environmental clearance"
  ]
}
```

### Invalid Output Handling

If LLM returns invalid JSON or missing fields, the system should:
1. Log the error
2. Return fallback response
3. Not crash

---

## Test 6: Performance

### Measure Response Time

```bash
time curl -X POST http://localhost:8000/api/v1/compliance/analyze \
  -H "Content-Type: application/json" \
  -d @test_application.json
```

**Expected**:
- Regulation retrieval: < 1 second
- LLM inference: 5-15 seconds (depends on model and hardware)
- Total: < 20 seconds

### Timeout Handling

The LLM service has a 30-second timeout. If exceeded:
- Request is terminated
- Fallback response returned
- Error logged

---

## Test 7: Confidence Scoring

### High Confidence Application

```json
{
  "industry_name": "Well-Documented Factory",
  "square_feet": "10000",
  "water_source": "Municipal supply with NOC",
  "drainage": "City drainage with approval",
  "air_pollution": "Advanced filtration system installed",
  "waste_management": "Comprehensive plan with authorized disposal",
  "nearby_homes": "2000 meters",
  "water_level_depth": "60 feet"
}
```

**Expected**: `confidence_score > 0.8`

### Low Confidence Application

```json
{
  "industry_name": "Minimal Info Factory",
  "square_feet": "",
  "water_source": "",
  "drainage": "",
  "air_pollution": "",
  "waste_management": "",
  "nearby_homes": "",
  "water_level_depth": ""
}
```

**Expected**: `confidence_score < 0.3`

---

## Test 8: Department Tagging

### Verify Department Classification

Issues should be tagged with appropriate departments:
- `fire` - Fire safety issues
- `environment` - Environmental compliance
- `local_body` - Local regulations, buffer zones
- `other` - General or ambiguous

**Example**:
```json
{
  "issue_type": "missing_document",
  "department": "fire",
  "description": "Fire safety certificate required"
}
```

---

## Test 9: Risk Categorization

### Verify Risk Levels

- **High Risk**: Violations, safety hazards, legal issues
- **Medium Risk**: Missing documents, ambiguities
- **Low Risk**: Minor clarifications, recommendations

**Example**:
```json
{
  "severity": "high",
  "issue_type": "violation",
  "description": "Distance to residential area below minimum requirement"
}
```

---

## Test 10: Regulation Coverage

### Check Coverage Percentage

The `regulation_coverage` field should indicate:
- How many regulations were reviewed
- Percentage of relevant regulations covered

**Expected**: 0.8 - 1.0 for comprehensive analysis

---

## Debugging

### Enable Debug Logging

```python
# backend/main.py
import logging
logging.basicConfig(level=logging.DEBUG)
```

### Check Logs

```bash
# Watch backend logs
tail -f backend.log

# Key log messages to look for:
# - "Starting compliance analysis for: ..."
# - "Retrieved X regulation chunks"
# - "Calling LLM at ..."
# - "LLM response received (X characters)"
# - "Successfully parsed LLM JSON response"
# - "Compliance analysis complete: ..."
```

### Common Issues

**Issue**: "LLM request timeout"
- **Solution**: Increase timeout in config or use faster model

**Issue**: "No regulations retrieved"
- **Solution**: Run ingestion endpoint first

**Issue**: "Invalid JSON from LLM"
- **Solution**: Check LLM prompt, try different model, or adjust temperature

**Issue**: "Empty LLM response"
- **Solution**: Verify LLM is running, check API URL

---

## Success Criteria

✅ All tests pass
✅ LLM integration works
✅ Fallbacks trigger correctly
✅ JSON validation works
✅ Response time < 20 seconds
✅ Confidence scores are reasonable
✅ Department tagging is accurate
✅ Risk levels are appropriate

---

## Next Steps

After successful testing:
1. ✅ Phase 3 backend complete
2. ⏳ Build Next.js UI components (Phase 4)
3. ⏳ Connect frontend to backend
4. ⏳ Add authentication
5. ⏳ Deploy to production

---

**Testing Guide Version**: Phase 3
**Last Updated**: 2026-01-04
