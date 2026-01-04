# CivicAssist - Quick Start Guide

## 🚀 Getting Started

This guide will help you run CivicAssist locally in under 5 minutes.

## Prerequisites

- Python 3.8 or higher
- pip package manager

## Installation

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
python -m pip install -r requirements.txt

# Run the server
python main.py
```

The backend API will start at **http://localhost:8000**

### 2. Frontend Setup

Open a **new terminal**, then:

```bash
# Navigate to frontend directory
cd frontend/ui

# Install dependencies (if not already installed)
python -m pip install streamlit

# Run the Streamlit app
python -m streamlit run app.py
```

The frontend UI will open automatically in your browser at **http://localhost:8501**

## Verification

### Test Backend
Visit http://localhost:8000/docs to see the interactive API documentation.

### Test Health Endpoint
```bash
curl http://localhost:8000/api/v1/health
```

Expected response:
```json
{
  "status": "healthy",
  "version": "0.1.0",
  "timestamp": "2026-01-04T..."
}
```

### Test Frontend
The Streamlit UI should show:
- Landing page with CivicAssist branding
- Sidebar with navigation options
- Three pages: Home, Applicant Mode, Officer Mode

## Exploring the Application

### Applicant Mode
1. Click "📝 Applicant Mode" in the sidebar
2. Try uploading a sample document (placeholder in Phase 1)
3. View the sample compliance report

### Officer Mode
1. Click "⚖️ Officer Mode" in the sidebar
2. Select a sample application
3. Explore the compliance analysis tabs:
   - Overview
   - Issues (with severity levels)
   - Documents checklist
   - Recommendations

## Project Structure

```
HFT/
├── backend/          # FastAPI backend (port 8000)
├── frontend/ui/      # Streamlit frontend (port 8501)
├── data/             # Data storage directories
├── OLD/              # Previous implementation (reference only)
└── PRD.md            # Product requirements
```

## Important Notes

### Phase 1 Status
- ✅ UI and API structure are complete
- ✅ All endpoints are defined
- ⏳ Actual AI/RAG functionality will be added in Phase 2

### What Works Now
- Backend health checks
- Frontend navigation
- UI mockups and layouts
- Sample data visualization

### What's Coming in Phase 2
- Document processing
- AI-powered compliance analysis
- ChromaDB integration
- LLM integration
- Real chatbot functionality

## Troubleshooting

### Backend won't start
- Ensure port 8000 is not in use
- Check Python version: `python --version`
- Reinstall dependencies: `pip install -r requirements.txt`

### Frontend won't start
- Ensure port 8501 is not in use
- Try: `python -m streamlit run app.py` instead of just `streamlit run app.py`
- Clear Streamlit cache: Delete `.streamlit` folder if it exists

### "Module not found" errors
- Make sure you're in the correct directory (backend/ or frontend/ui/)
- Reinstall dependencies

## Next Steps

1. ✅ Verify both backend and frontend are running
2. ✅ Explore the UI and understand the user flows
3. ✅ Review the API documentation at /docs
4. ⏳ Wait for Phase 2 implementation
5. ⏳ Add actual regulation documents to `data/regulations/`

## Documentation

- **Backend README**: `backend/README.md`
- **Frontend README**: `frontend/ui/README.md`
- **Phase 1 Summary**: `PHASE1_COMPLETE.md`
- **Product Requirements**: `PRD.md`

## Support

If you encounter issues:
1. Check the terminal logs for error messages
2. Review the README files in backend/ and frontend/ui/
3. Refer to `PHASE1_COMPLETE.md` for architecture details

---

Happy exploring! 🎉
