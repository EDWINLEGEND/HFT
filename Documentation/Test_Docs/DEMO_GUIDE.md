# CivicAssist - Demo Guide

## 🎯 Quick Demo (2 Minutes)

This guide will help you demonstrate CivicAssist's key features in under 2 minutes.

---

## Prerequisites

### 1. Start LM Studio
- Open LM Studio
- Load Mistral-7B (or any compatible model)
- Start the local server (port 1234)

### 2. Start Backend
```bash
cd backend
python main.py
```

### 3. Ingest Regulations (One-time)
```bash
curl -X POST http://localhost:8000/api/v1/regulations/ingest
```

### 4. Start Frontend
```bash
cd frontend
npm run dev
```

---

## Demo Script

### Part 1: Home Page (15 seconds)

**Navigate to**: http://localhost:3000

**Show**:
- Clean, professional interface
- Two user modes: Applicant and Officer
- Human-in-the-loop principles notice

**Say**:
> "CivicAssist helps government officers and applicants streamline industrial compliance verification. The system assists, never replaces, human decision-makers."

---

### Part 2: Applicant Mode (45 seconds)

**Click**: "Go to Applicant Mode"

**Fill Form** (use sample data):
- Industry name: `ABC Textile Mill`
- Square feet: `5000`
- Water source: `Municipal supply`
- Drainage: `City drainage`
- Air pollution: `Electrostatic precipitators`
- Waste management: `Segregated disposal`
- Nearby homes: `500 meters`
- Water level depth: `50 feet`

**Click**: "Run Pre-Submission Check"

**Show** (while loading):
> "The system retrieves relevant regulations from the vector database and uses AI to analyze compliance."

**Show** (results):
- Overall status (color-coded)
- Confidence score
- Missing documents
- Flagged issues with risk levels
- Actionable recommendations

**Say**:
> "Applicants get instant feedback on their application before official submission, reducing resubmission cycles."

---

### Part 3: Officer Mode (60 seconds)

**Click**: "Go to Officer Mode" (from home or back button)

**Select**: "APP-001: ABC Textile Manufacturing"

**Click**: "Analyze Application"

**Show** (overview):
- Overall status
- Confidence score (e.g., 85%)
- Regulation coverage (e.g., 92%)
- Issue count

**Say**:
> "Officers get AI-assisted insights to review applications more efficiently."

**Click**: Any issue in the list

**Show** (explainability panel):
- Risk level
- Department
- Plain-language explanation
- Regulation reference with citation

**Say**:
> "Every issue is explainable. Officers can see exactly which regulation was violated and why. This makes decisions judge-defensible."

**Click**: "Copy Checklist"

**Say**:
> "Officers can copy the checklist to share with applicants or for their records."

---

## Key Talking Points

### 1. Human-in-the-Loop
- System **assists**, never replaces officers
- All outputs are advisory only
- Final decisions remain with qualified humans

### 2. Explainability
- Every issue cites specific regulations
- Click-to-view detailed explanations
- Traceable to source documents

### 3. Safety
- Fail-safe design
- If AI fails, system returns "needs manual review"
- No auto-approval logic

### 4. Time Savings
- Applicants: Reduce resubmission cycles
- Officers: Review applications faster
- System: Handles routine checks automatically

---

## Technical Highlights

### Backend
- **RAG Architecture**: Retrieves relevant regulations using vector search
- **Local LLM**: Mistral-7B for compliance reasoning
- **Structured Output**: JSON schema validation
- **Safety Controls**: Timeouts, fallbacks, error handling

### Frontend
- **Next.js**: Modern, type-safe React framework
- **Explainability-First**: Click-to-view issue details
- **Color-Coded**: Risk levels and status indicators
- **Responsive**: Works on desktop and tablet

---

## Demo Variations

### Short Demo (1 minute)
1. Show home page (10s)
2. Run Applicant Mode analysis (30s)
3. Show Officer Mode explainability (20s)

### Full Demo (5 minutes)
1. Home page overview (30s)
2. Applicant Mode walkthrough (2min)
3. Officer Mode walkthrough (2min)
4. Technical architecture explanation (30s)

### Technical Deep Dive (10 minutes)
1. Show API documentation (http://localhost:8000/docs)
2. Explain RAG workflow
3. Demonstrate regulation search endpoint
4. Show LLM prompt engineering
5. Discuss safety controls

---

## Common Questions & Answers

### Q: Does this replace government officers?
**A**: No. CivicAssist **assists** officers by providing AI-generated insights. Final approval decisions remain with qualified human officers.

### Q: How accurate is the AI?
**A**: The system provides a confidence score with each analysis. Low confidence triggers manual review. All outputs are advisory and require human verification.

### Q: What if the AI makes a mistake?
**A**: The system is designed to fail safe. If the AI encounters an error or produces invalid output, it returns "needs manual review" instead of potentially incorrect information.

### Q: Can applicants get automatic approval?
**A**: No. The system only provides pre-submission checks for applicants. Official approvals must go through the normal government process with officer review.

### Q: How does explainability work?
**A**: Every issue flagged by the AI includes a citation to the specific regulation. Officers can click on any issue to view the regulation reference, document excerpt, and plain-language explanation.

### Q: What regulations are included?
**A**: Currently, the demo includes Kerala Industrial Safety Regulations 2023. The system can ingest any PDF, DOCX, or TXT regulation documents.

---

## Troubleshooting

### "Failed to fetch" error
- Ensure backend is running on port 8000
- Check that LM Studio is running
- Verify regulations have been ingested

### Analysis takes too long
- LLM inference can take 5-15 seconds
- Ensure LM Studio has sufficient resources
- Check backend logs for errors

### No issues found
- Verify regulations were ingested successfully
- Check that vector store has data
- Try a different sample application

---

## After the Demo

### Next Steps
1. Review documentation in `Documentation/Review_Docs/PROJECT_SUMMARY.md`
2. Explore API documentation at http://localhost:8000/docs
3. Read phase completion documents in `Documentation/Review_Docs/`
4. Review testing guide (`Documentation/Test_Docs/TESTING_GUIDE_PHASE3.md`)

### Feedback
- What features would be most valuable?
- Which workflows need improvement?
- What additional regulations should be included?

---

## Demo Checklist

Before demo:
- [ ] LM Studio running with model loaded
- [ ] Backend running on port 8000
- [ ] Regulations ingested
- [ ] Frontend running on port 3000
- [ ] Browser open to http://localhost:3000

During demo:
- [ ] Show home page
- [ ] Demonstrate Applicant Mode
- [ ] Demonstrate Officer Mode
- [ ] Highlight explainability feature
- [ ] Emphasize human-in-the-loop

After demo:
- [ ] Answer questions
- [ ] Share documentation links
- [ ] Discuss next steps

---

**Demo Guide Version**: 1.0
**Last Updated**: 2026-01-04
**Estimated Time**: 2-5 minutes
