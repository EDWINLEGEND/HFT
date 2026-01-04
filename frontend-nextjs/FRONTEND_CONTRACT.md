# Next.js Frontend - Phase 3 Contract

## Overview

This document defines how the Next.js frontend will consume the compliance analysis API.

---

## Backend API Contract

### Base URL
**Development**: `http://localhost:8000`

### Compliance Analysis Endpoint

**POST /api/v1/compliance/analyze**

---

## TypeScript Interfaces

### Request

```typescript
interface IndustrialApplication {
  industry_name: string;
  square_feet: string;
  water_source: string;
  drainage: string;
  air_pollution: string;
  waste_management: string;
  nearby_homes: string;
  water_level_depth: string;
}
```

### Response

```typescript
interface ComplianceReport {
  application_id?: string;
  status: "compliant" | "partial" | "non_compliant";
  confidence_score: number;  // 0.0-1.0
  issues: ComplianceIssue[];
  missing_documents: string[];
  recommendations: string[];
  regulation_coverage: number;  // 0.0-1.0
  generated_at: string;  // ISO 8601 timestamp
}

interface ComplianceIssue {
  issue_type: "missing_document" | "violation" | "ambiguity";
  severity: "low" | "medium" | "high";
  description: string;
  regulation_reference?: string;
  department?: string;
}
```

---

## UI Component Structure (Phase 4)

### 1. Compliance Status Display

**Location**: Where compliance report results will be shown

**Components Needed**:
- `ComplianceStatusBadge` - Visual status indicator
- `ConfidenceScore` - Progress bar showing confidence (0-100%)
- `RegulationCoverage` - Percentage of regulations reviewed

**Example**:
```typescript
// app/officer/page.tsx
// Phase 4: Display compliance status here
{report && (
  <div>
    <ComplianceStatusBadge status={report.status} />
    <ConfidenceScore score={report.confidence_score} />
    <p>Regulation Coverage: {Math.round(report.regulation_coverage * 100)}%</p>
  </div>
)}
```

---

### 2. Issues List Display

**Location**: Where flagged compliance issues will be shown

**Components Needed**:
- `IssueCard` - Individual issue with severity indicator
- `IssuesList` - Grouped by risk level (High → Medium → Low)
- `RegulationReference` - Clickable regulation citation

**Data Structure**:
```typescript
// Phase 4: Render issues here
{report.issues.map((issue, i) => (
  <IssueCard
    key={i}
    type={issue.issue_type}
    severity={issue.severity}
    description={issue.description}
    regulation={issue.regulation_reference}
    department={issue.department}
  />
))}
```

**Visual Design**:
- **High Risk**: Red left border, red badge
- **Medium Risk**: Yellow left border, yellow badge
- **Low Risk**: Blue left border, blue badge

---

### 3. Missing Documents Checklist

**Location**: Where missing document list will be shown

**Components Needed**:
- `DocumentChecklist` - List of missing documents
- `ChecklistItem` - Individual document with checkbox (for tracking)

**Example**:
```typescript
// Phase 4: Display missing documents here
{report.missing_documents.length > 0 && (
  <div>
    <h3>Missing Documents</h3>
    <ul>
      {report.missing_documents.map((doc, i) => (
        <li key={i}>❌ {doc}</li>
      ))}
    </ul>
  </div>
)}
```

---

### 4. Recommendations Display

**Location**: Where actionable recommendations will be shown

**Components Needed**:
- `RecommendationsList` - Ordered list of actions
- `RecommendationItem` - Individual recommendation with icon

**Example**:
```typescript
// Phase 4: Display recommendations here
{report.recommendations.length > 0 && (
  <div>
    <h3>Recommendations</h3>
    <ol>
      {report.recommendations.map((rec, i) => (
        <li key={i}>✓ {rec}</li>
      ))}
    </ol>
  </div>
)}
```

---

## API Client Implementation

### File: `lib/api.ts`

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function analyzeCompliance(
  application: IndustrialApplication
): Promise<ComplianceReport> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/compliance/analyze`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(application),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Analysis failed');
  }

  return response.json();
}
```

---

## Usage Example

### Officer Mode Page (`app/officer/page.tsx`)

```typescript
'use client';

import { useState } from 'react';
import { analyzeCompliance } from '@/lib/api';
import type { ComplianceReport, IndustrialApplication } from '@/lib/types';

export default function OfficerPage() {
  const [report, setReport] = useState<ComplianceReport | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (application: IndustrialApplication) => {
    setLoading(true);
    try {
      const result = await analyzeCompliance(application);
      setReport(result);
    } catch (error) {
      console.error('Analysis failed:', error);
      // Show error to user
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Officer Mode - Application Review</h1>
      
      {/* Phase 4: Application selection UI here */}
      
      {loading && <p>Analyzing application...</p>}
      
      {report && (
        <div>
          {/* Phase 4: Compliance status display here */}
          <ComplianceStatusBadge status={report.status} />
          
          {/* Phase 4: Issues list here */}
          <IssuesList issues={report.issues} />
          
          {/* Phase 4: Missing documents here */}
          <DocumentChecklist documents={report.missing_documents} />
          
          {/* Phase 4: Recommendations here */}
          <RecommendationsList recommendations={report.recommendations} />
        </div>
      )}
    </div>
  );
}
```

---

## Error Handling

### API Errors

```typescript
try {
  const report = await analyzeCompliance(application);
} catch (error) {
  if (error instanceof Error) {
    // Show user-friendly error
    if (error.message.includes('timeout')) {
      showError('Analysis timed out. Please try again.');
    } else if (error.message.includes('LLM')) {
      showError('AI service unavailable. Manual review required.');
    } else {
      showError('Analysis failed. Please contact support.');
    }
  }
}
```

### Fallback Handling

When backend returns `status: "partial"` with confidence 0.0:

```typescript
if (report.confidence_score === 0 && report.status === 'partial') {
  // This is a fallback response
  showWarning('Automated analysis unavailable. Manual review required.');
  // Display fallback message from report.issues[0].description
}
```

---

## Visual Design Guidelines

### Color Scheme

**Status Colors**:
- Compliant: Green (`#10B981`)
- Partially Compliant: Yellow (`#F59E0B`)
- Non-Compliant: Red (`#EF4444`)

**Risk Level Colors**:
- Low: Blue (`#3B82F6`)
- Medium: Yellow (`#F59E0B`)
- High: Red (`#EF4444`)

### Typography

- **Headers**: `font-bold text-2xl`
- **Issue Descriptions**: `text-base text-gray-700`
- **Regulation References**: `text-sm text-gray-500 italic`
- **Confidence Score**: `text-lg font-semibold`

---

## State Management

### Recommended Approach

Use React state for simple cases:
```typescript
const [report, setReport] = useState<ComplianceReport | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

For complex apps, consider Zustand or Context API.

---

## Testing

### Unit Tests

```typescript
describe('Compliance Analysis', () => {
  it('should analyze application and return report', async () => {
    const application: IndustrialApplication = {
      industry_name: 'Test Mill',
      square_feet: '5000',
      // ... other fields
    };

    const report = await analyzeCompliance(application);
    
    expect(report.status).toBeDefined();
    expect(report.confidence_score).toBeGreaterThanOrEqual(0);
    expect(report.confidence_score).toBeLessThanOrEqual(1);
    expect(Array.isArray(report.issues)).toBe(true);
  });

  it('should handle API errors gracefully', async () => {
    // Mock failed API call
    await expect(analyzeCompliance(invalidApp)).rejects.toThrow();
  });
});
```

---

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Phase 4 Roadmap

**Next Steps for Frontend**:
1. ✅ API contract defined (Phase 3)
2. ⏳ Create UI components (Phase 4)
3. ⏳ Implement application form
4. ⏳ Build compliance report display
5. ⏳ Add officer decision actions
6. ⏳ Implement applicant mode
7. ⏳ Add authentication

---

**Contract Version**: Phase 3
**Last Updated**: 2026-01-04
**Status**: Backend ready, UI components pending Phase 4
