# Phase 5 Testing Guide - Reliability & Fallbacks

## Overview

This guide provides step-by-step instructions for testing the Phase 5 fallback strategy and reliability features.

---

## Prerequisites

1. Backend installed and configured
2. Regulations ingested
3. (Optional) OpenAI API key for fallback testing

---

## Test Suite

### Test 1: Local LLM Success (Happy Path)

**Objective**: Verify normal operation with local LLM

**Setup**:
1. Start LM Studio with Mistral-7B loaded
2. Ensure model is running on port 1234
3. Set `USE_OPENAI_FALLBACK=false` in `.env`

**Steps**:
```bash
cd backend
python main.py

# In another terminal
curl -X POST http://localhost:8000/api/v1/compliance/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "industry_name": "Test Mill",
    "square_feet": "5000",
    "water_source": "Municipal",
    "drainage": "City drainage",
    "air_pollution": "Filters installed",
    "waste_management": "Proper disposal",
    "nearby_homes": "500m",
    "water_level_depth": "50ft"
  }'
```

**Expected Logs**:
```
[LOCAL LLM] Call #1 to http://localhost:1234
[LOCAL LLM] Response received (1234 characters)
JSON response validation successful
[STRATEGY 1] Local LLM analysis successful
```

**Expected Response**:
- Valid compliance report
- `confidence_score` > 0
- Issues array populated
- Checklist provided

**Result**: ✅ PASS if normal compliance report returned

---

### Test 2: Local LLM Timeout

**Objective**: Verify timeout handling and fallback

**Setup**:
1. Overload LM Studio (run multiple concurrent requests)
2. OR set very low timeout in config

**Steps**:
```bash
# Same curl command as Test 1
# Wait for timeout (30 seconds)
```

**Expected Logs**:
```
[LOCAL LLM] Call #1 to http://localhost:1234
[LOCAL LLM] Request timed out after 30s
[STRATEGY 1] Local LLM failed: LLM request timeout
[STRATEGY 2] OpenAI fallback disabled or not configured
[STRATEGY 3] All LLM strategies failed - returning safe default
[SAFE DEFAULT] Fallback call #1
```

**Expected Response**:
```json
{
  "overall_status": "needs_human_review",
  "confidence_score": 0,
  "issues": [{
    "explanation": "Automated analysis unavailable. All AI services failed. Manual review required."
  }]
}
```

**Result**: ✅ PASS if safe default returned without crash

---

### Test 3: Local LLM Unavailable

**Objective**: Verify behavior when LM Studio is not running

**Setup**:
1. Stop LM Studio
2. Set `USE_OPENAI_FALLBACK=false`

**Steps**:
```bash
# Same curl command as Test 1
```

**Expected Logs**:
```
[LOCAL LLM] Call #1 to http://localhost:1234
[LOCAL LLM] Request failed: Connection refused
[STRATEGY 1] Local LLM failed: LLM request failed: Connection refused
[STRATEGY 2] OpenAI fallback disabled or not configured
[STRATEGY 3] All LLM strategies failed - returning safe default
```

**Expected Response**:
- Safe default response
- `confidence_score: 0`
- `overall_status: "needs_human_review"`

**Result**: ✅ PASS if safe default returned

---

### Test 4: OpenAI Fallback Success

**Objective**: Verify OpenAI fallback works when local LLM fails

**Setup**:
1. Stop LM Studio (or keep it stopped)
2. Set `USE_OPENAI_FALLBACK=true` in `.env`
3. Set `OPENAI_API_KEY=sk-your-key` in `.env`
4. Restart backend

**Steps**:
```bash
# Same curl command as Test 1
```

**Expected Logs**:
```
[LOCAL LLM] Call #1 to http://localhost:1234
[LOCAL LLM] Request failed: Connection refused
[STRATEGY 1] Local LLM failed: LLM request failed: Connection refused
[STRATEGY 2] Attempting OpenAI fallback
[OPENAI FALLBACK] Call #1 - COST INCURRED
[OPENAI FALLBACK] Estimated cost: $0.0001-0.0005 per call
[OPENAI FALLBACK] Response received (1456 characters)
JSON response validation successful
[STRATEGY 2] OpenAI fallback successful
```

**Expected Response**:
- Valid compliance report from OpenAI
- `confidence_score` > 0
- Issues array populated

**Result**: ✅ PASS if OpenAI returns valid report

**Cost**: ~$0.0003 per test

---

### Test 5: Invalid JSON from Local LLM

**Objective**: Verify JSON validation and fallback

**Setup**:
1. This test requires modifying the LLM to return invalid JSON
2. Alternative: Mock the LLM service to return invalid JSON

**Expected Behavior**:
- `Failed to parse JSON: {error}`
- `[STRATEGY 1] Local LLM returned invalid JSON`
- Fallback to Strategy 2 or 3

**Result**: ✅ PASS if fallback triggered

---

### Test 6: Missing Required Fields in JSON

**Objective**: Verify schema validation

**Setup**:
1. Mock LLM to return JSON missing `overall_status`

**Expected Logs**:
```
Missing required field: overall_status
[STRATEGY 1] Local LLM returned invalid JSON
```

**Result**: ✅ PASS if fallback triggered

---

### Test 7: All Strategies Fail

**Objective**: Verify safe default when everything fails

**Setup**:
1. Stop LM Studio
2. Set `USE_OPENAI_FALLBACK=true`
3. Set invalid `OPENAI_API_KEY` (or no key)

**Steps**:
```bash
# Same curl command as Test 1
```

**Expected Logs**:
```
[STRATEGY 1] Local LLM failed: Connection refused
[STRATEGY 2] Attempting OpenAI fallback
[OPENAI FALLBACK] Failed: OpenAI API key not configured
[STRATEGY 2] OpenAI fallback failed
[STRATEGY 3] All LLM strategies failed - returning safe default
[SAFE DEFAULT] Fallback call #1
```

**Expected Response**:
- Safe default response
- No crash

**Result**: ✅ PASS if safe default returned

---

### Test 8: Call Statistics

**Objective**: Verify call tracking works

**Setup**:
1. Run multiple analyses (mix of success and failures)

**Steps**:
```python
from app.services.llm_service import get_llm_service

llm = get_llm_service()
stats = llm.get_stats()
print(stats)
```

**Expected Output**:
```python
{
  'local_llm_calls': 5,
  'openai_calls': 2,
  'fallback_calls': 1
}
```

**Result**: ✅ PASS if statistics match actual calls

---

### Test 9: Cost Logging

**Objective**: Verify OpenAI cost warnings are logged

**Setup**:
1. Enable OpenAI fallback
2. Trigger OpenAI call

**Expected Logs**:
```
[OPENAI FALLBACK] Call #1 - COST INCURRED
[OPENAI FALLBACK] Estimated cost: $0.0001-0.0005 per call
```

**Result**: ✅ PASS if cost warnings appear

---

### Test 10: Repeated Demos

**Objective**: Verify system handles repeated calls without degradation

**Setup**:
1. Run 10 consecutive analyses
2. Monitor for memory leaks, slowdowns, or crashes

**Steps**:
```bash
for i in {1..10}; do
  echo "Test $i"
  curl -X POST http://localhost:8000/api/v1/compliance/analyze \
    -H "Content-Type: application/json" \
    -d '{"industry_name":"Test'$i'","square_feet":"5000",...}'
  sleep 2
done
```

**Expected**:
- All 10 requests succeed
- No crashes
- Consistent response times
- No memory leaks

**Result**: ✅ PASS if all requests succeed

---

## Failure Mode Matrix

| Scenario | Local LLM | OpenAI | Result |
|----------|-----------|--------|--------|
| Normal | ✅ Success | N/A | Local LLM response |
| LLM Timeout | ❌ Timeout | ✅ Success | OpenAI response |
| LLM Down | ❌ Connection refused | ✅ Success | OpenAI response |
| Invalid JSON | ❌ Invalid | ✅ Success | OpenAI response |
| Both Fail | ❌ Down | ❌ Down | Safe default |
| OpenAI Disabled | ❌ Down | N/A | Safe default |

---

## Performance Benchmarks

### Expected Response Times

| Scenario | Time |
|----------|------|
| Local LLM success | 5-15s |
| Local LLM timeout | 30s + fallback time |
| OpenAI fallback | 2-5s |
| Safe default | < 1s |

---

## Debugging Tips

### Check LLM Service Status

```python
from app.services.llm_service import get_llm_service

llm = get_llm_service()
print(f"Local LLM available: {llm.is_available()}")
print(f"OpenAI fallback enabled: {llm.use_openai_fallback}")
print(f"Statistics: {llm.get_stats()}")
```

### View Logs

```bash
# Watch backend logs in real-time
tail -f backend.log

# Filter for fallback events
grep "FALLBACK" backend.log

# Filter for errors
grep "ERROR" backend.log
```

### Test OpenAI Connection

```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

---

## Success Criteria

All tests must pass:
- ✅ Test 1: Local LLM Success
- ✅ Test 2: Local LLM Timeout
- ✅ Test 3: Local LLM Unavailable
- ✅ Test 4: OpenAI Fallback Success
- ✅ Test 7: All Strategies Fail
- ✅ Test 10: Repeated Demos

**System is demo-ready when all tests pass!**

---

## Cost Tracking

After testing, calculate OpenAI costs:

```python
from app.services.llm_service import get_llm_service

llm = get_llm_service()
stats = llm.get_stats()

openai_calls = stats['openai_calls']
estimated_cost = openai_calls * 0.0003  # $0.0003 average per call

print(f"OpenAI calls during testing: {openai_calls}")
print(f"Estimated cost: ${estimated_cost:.4f}")
```

---

**Testing Guide Version**: Phase 5
**Last Updated**: 2026-01-04
**Status**: Ready for reliability testing
