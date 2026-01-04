# CivicAssist Frontend

Clean Streamlit-based frontend for the CivicAssist industrial compliance system.

## Structure

```
frontend/
└── ui/
    ├── app.py                          # Main Streamlit application
    ├── pages/
    │   ├── 1_🏠_Home.py                # Home page (redirects to main)
    │   ├── 2_📝_Applicant_Mode.py     # Applicant interface
    │   └── 3_⚖️_Officer_Mode.py       # Officer interface
    └── README.md
```

## What This Frontend Does

### Phase 1 (Current)
- ✅ Professional, modern UI design
- ✅ Role-based navigation (Applicant Mode / Officer Mode)
- ✅ Sidebar navigation with page links
- ✅ Placeholder workflows for document upload
- ✅ Sample compliance report visualization
- ✅ Officer decision support interface mockup

### What This Frontend Does NOT Do Yet
- ❌ No actual API calls to backend
- ❌ No document processing
- ❌ No real compliance analysis
- ❌ No data persistence

All pages are **well-designed placeholders** that demonstrate the intended user experience.

## Pages Overview

### Home (`app.py`)
- Landing page with feature showcase
- Navigation to Applicant Mode and Officer Mode
- Project overview and key benefits

### Applicant Mode (`2_📝_Applicant_Mode.py`)
- Document upload interface
- Pre-submission compliance check workflow
- Sample compliance report display
- Missing documents checklist

### Officer Mode (`3_⚖️_Officer_Mode.py`)
- Application selection and review
- AI-generated compliance analysis (mockup)
- Issue breakdown with severity levels
- Document checklist verification
- Decision support actions (Approve/Reject/Request Documents)
- Officer notes section

## Installation

```bash
cd frontend
pip install -r requirements.txt
```

## Running the Application

```bash
cd frontend/ui
streamlit run app.py
```

The application will open in your browser at `http://localhost:8501`

## Design Principles

### User Experience
- **Clean and Professional**: Modern, minimalist design
- **Role-Specific**: Separate interfaces for applicants and officers
- **Intuitive Navigation**: Clear sidebar menu and page flow
- **Visual Hierarchy**: Important information highlighted appropriately

### Layout
- **Wide Layout**: Maximum screen space utilization
- **Responsive**: Works on different screen sizes
- **Card-Based**: Information organized in visual cards
- **Tab-Based Reports**: Complex information organized in tabs

### Color Coding
- **Blue (#1E88E5)**: Primary brand color
- **Red/Error**: High-risk issues
- **Yellow/Warning**: Medium-risk issues
- **Green/Success**: Low-risk issues, completed items

## Reference

This frontend is inspired by `OLD/ui/` structure but redesigned with:
- Cleaner separation of pages
- More professional styling
- Better user flow
- Phase-aware placeholders
- Modern Streamlit best practices

## What Will Be Added in Later Phases

### Phase 2: Backend Integration
- Connect to FastAPI backend
- Real document upload and processing
- Actual compliance analysis display
- API error handling

### Phase 3: Enhanced Features
- Real-time progress indicators
- Document preview
- Downloadable reports
- Email notifications
- Application status tracking

### Phase 4: Advanced UI
- Interactive regulation explorer
- Visual compliance dashboard
- Multi-language support
- Accessibility improvements

## Configuration

The frontend expects the backend API to be available at:
- **Backend API:** `http://localhost:8000`
- **API Docs:** `http://localhost:8000/docs`

These can be configured in future phases via environment variables.

## Development Notes

### Streamlit Page Navigation
Streamlit uses a special file naming convention for multi-page apps:
- Files in `pages/` directory are automatically discovered
- Filenames starting with numbers control the order
- Emojis in filenames appear in the sidebar

### Session State
In future phases, we'll use `st.session_state` to:
- Track uploaded documents
- Store analysis results
- Maintain user context
- Handle authentication

### Best Practices
- Keep pages focused on single responsibilities
- Use components for reusable UI elements
- Maintain consistent styling across pages
- Provide clear user feedback
- Handle edge cases gracefully
