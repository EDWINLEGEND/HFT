# CivicAssist Frontend

Next.js-based frontend for the CivicAssist industrial compliance system.

## Phase 4: Frontend Implementation Complete ✅

### Cleanup Summary

**Before Phase 4**:
- `/frontend` - Streamlit UI (legacy from Phase 1)
- `/frontend-nextjs` - Next.js app (created in Phase 2)

**After Phase 4**:
- `/frontend-nextjs` - Single Next.js application
- Old Streamlit files preserved in `/OLD/ui/` for reference

See `FRONTEND_CLEANUP.md` for details.

---

## Features

### 1. Home Page (`/`)
- Project overview
- Feature highlights
- Navigation to Applicant and Officer modes
- Human-in-the-loop principles explanation

### 2. Applicant Mode (`/applicant`)
- Application detail form (8 required fields)
- Pre-submission compliance check
- Results display:
  - Overall status with color coding
  - Confidence score progress bar
  - Missing documents list
  - Flagged issues with risk levels
  - Actionable recommendations
- **Advisory notice**: Results are not official approvals

### 3. Officer Mode (`/officer`)
- Application selector (sample applications)
- Full compliance analysis
- Overview metrics:
  - Overall status
  - Confidence score
  - Regulation coverage percentage
  - Issue count
- Issues list with risk levels and department tags
- **Explainability drill-down**:
  - Click any issue to view details
  - Regulation references
  - Plain-language explanations
  - Traceable citations
- Copyable checklist for missing documents

---

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API Client**: Fetch API
- **State Management**: React useState

---

## Installation

```bash
cd frontend-nextjs
npm install
```

---

## Running the Application

### Development Mode

```bash
npm run dev
```

The app will be available at **http://localhost:3000**

### Production Build

```bash
npm run build
npm start
```

---

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Project Structure

```
frontend-nextjs/
├── app/
│   ├── page.tsx              # Home page
│   ├── applicant/
│   │   └── page.tsx          # Applicant mode
│   ├── officer/
│   │   └── page.tsx          # Officer mode
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── lib/
│   ├── api.ts                # API client & helpers
│   └── types.ts              # TypeScript interfaces
├── public/                   # Static assets
├── package.json
├── tsconfig.json
└── README.md
```

---

## API Integration

### Backend Endpoints Used

1. **POST /api/v1/compliance/analyze**
   - Analyzes industrial application
   - Returns structured compliance report

### API Client (`lib/api.ts`)

```typescript
import { CivicAssistAPI } from '@/lib/api';

// Analyze compliance
const report = await CivicAssistAPI.analyzeCompliance(application);

// Search regulations (not used in Phase 4 UI)
const results = await CivicAssistAPI.searchRegulations(query);
```

---

## Design Principles

### 1. Clarity Over Aesthetics
- Clean, minimal design
- Focus on information hierarchy
- No unnecessary animations

### 2. Explainability First
- Every issue cites specific regulations
- Click-to-view detailed explanations
- Traceable to source documents

### 3. Judge-Friendly
- Professional appearance
- Clear risk categorization
- Defensible decision support

### 4. Human-in-the-Loop
- Prominent advisory notices
- "Advisory Only" labels
- No auto-approval language

---

## Color Coding

### Status Colors
- **Compliant**: Green
- **Partially Compliant**: Yellow
- **Non-Compliant**: Red

### Risk Levels
- **High**: Red border/badge
- **Medium**: Yellow border/badge
- **Low**: Blue border/badge

---

## User Flows

### Applicant Flow
1. Navigate to Applicant Mode
2. Fill application form
3. Click "Run Pre-Submission Check"
4. View results:
   - Status
   - Confidence
   - Missing documents
   - Issues
   - Recommendations
5. Use checklist to prepare official submission

### Officer Flow
1. Navigate to Officer Mode
2. Select application from dropdown
3. Click "Analyze Application"
4. Review overview metrics
5. Click on any issue to view details
6. Read regulation references
7. Copy checklist if needed
8. Make informed decision (outside system)

---

## Error Handling

### API Errors
- Network errors: User-friendly message
- Timeout errors: "Analysis timed out"
- LLM errors: "AI service unavailable"

### Fallback Handling
When backend returns `status: "partial"` with confidence 0.0:
- Warning banner displayed
- Message: "Automated analysis unavailable. Manual review required."

---

## Accessibility

- Semantic HTML
- Keyboard navigation support
- Color contrast compliance
- Screen reader friendly labels

---

## Testing

### Manual Testing

1. **Home Page**
   - Verify navigation links work
   - Check responsive layout

2. **Applicant Mode**
   - Submit valid application
   - Verify results display correctly
   - Test error handling (invalid data)

3. **Officer Mode**
   - Select each sample application
   - Click issues to view details
   - Copy checklist

### Integration Testing

```bash
# Ensure backend is running on port 8000
cd backend
python main.py

# In another terminal
cd frontend-nextjs
npm run dev

# Test full flow in browser
```

---

## Known Limitations (Phase 4)

- ❌ No authentication
- ❌ No chatbot UI
- ❌ No file upload
- ❌ No real application database
- ❌ Sample applications only

These are intentional for demo purposes.

---

## Next Steps (Future Phases)

1. Add authentication (officer login)
2. Implement file upload for documents
3. Add application database
4. Build chatbot interface
5. Add email notifications
6. Implement application status tracking

---

## Troubleshooting

### "Failed to fetch" error
- Ensure backend is running on port 8000
- Check CORS settings in backend config
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`

### Styles not loading
- Run `npm install` to ensure Tailwind is installed
- Check `tailwind.config.ts` configuration

### TypeScript errors
- Run `npm run build` to check for type errors
- Ensure all types are imported from `@/lib/types`

---

**Frontend Version**: Phase 4
**Last Updated**: 2026-01-04
**Status**: Complete - Ready for demo
