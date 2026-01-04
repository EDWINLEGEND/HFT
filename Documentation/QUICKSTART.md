# CivicAssist - Quick Start Guide

## 🚀 Getting Started

This guide will help you run the complete Phase 5 CivicAssist system locally in under 5 minutes.

## Prerequisites

- **Python 3.8+** (for backend)
- **Node.js 18+** (for frontend)
- **Local LLM Tool** (LM Studio or Ollama) with Mistral-7B loaded

## Installation

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Create .env file from example
cp .env.example .env
# (Optional) Edit .env to add OPENAI_API_KEY if testing fallback

# Main Terminal: Run the server
python main.py
```

The backend API will start at **http://localhost:8000**

### 2. Ingest Regulations (One-time)

In a separate terminal:
```bash
curl -X POST http://localhost:8000/api/v1/regulations/ingest
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run the Next.js app
npm run dev
```

The frontend UI will open at **http://localhost:3000**

## 🧪 Verification

### Test Backend
Visit http://localhost:8000/docs to see the interactive API documentation.

### Test Frontend
Open http://localhost:3000 and verify you see:
- Landing page with Applicant/Officer modes
- Professional Next.js interface

## 📂 Project Structure

```
HFT/
├── backend/            # FastAPI Backend
├── frontend/           # Next.js Frontend
├── Documentation/      # Project Documentation
│   ├── Review_Docs/    # Phase summaries, cleanup reports
│   └── Test_Docs/      # Testing guides, demo scripts
├── data/               # Vector store and regulations
└── OLD/                # Legacy code (reference only)
```

## 📚 Documentation Map

All documentation has been moved to the `Documentation/` folder:

### Getting Started
- **System Overview**: `Documentation/Review_Docs/PROJECT_SUMMARY.md`
- **Demo Script**: `Documentation/Test_Docs/DEMO_GUIDE.md`

### Testing & Reliability
- **Phase 5 Testing**: `Documentation/Test_Docs/TESTING_GUIDE_PHASE5.md`
- **Phase 3 Testing**: `Documentation/Test_Docs/TESTING_GUIDE_PHASE3.md`

### Implementation History
- **Phase 5 (Reliability)**: `Documentation/Review_Docs/PHASE5_COMPLETE.md`
- **Phase 4 (Frontend)**: `Documentation/Review_Docs/PHASE4_COMPLETE.md`
- **Frontend Cleanup**: `Documentation/Review_Docs/FRONTEND_CLEANUP.md`

## 🔧 Troubleshooting

### Backend Issues
- **Port 8000 in use**: Check running processes
- **LLM Connection Error**: Ensure LM Studio is running on port 1234
- **OpenAI Error**: Check API key in `.env` if fallback is enabled

### Frontend Issues
- **"Module not found"**: Run `npm install` again
- **API Connection Error**: Ensure backend is running and `NEXT_PUBLIC_API_URL` is set to http://localhost:8000

---

**System Version**: Phase 5 (Hardenec)
**Last Updated**: 2026-01-04
