# Next.js Frontend - Backend API Contract

## Overview

This document defines the contract between the Next.js frontend and the FastAPI backend for CivicAssist.

## Base URL

**Development**: `http://localhost:8000`
**Production**: TBD

## API Endpoints

### 1. System Endpoints

#### Health Check
```
GET /api/v1/health
```

**Response**:
```typescript
{
  status: "healthy";
  version: string;
  timestamp: string;
}
```

#### Version
```
GET /api/v1/version
```

**Response**:
```typescript
{
  api_version: string;
  app_name: string;
}
```

### 2. Regulation Endpoints (Phase 2)

#### Search Regulations
```
GET /api/v1/regulations/search
```

**Query Parameters**:
- `query` (required): string - Search query text
- `department` (optional): string - Filter by department
- `n_results` (optional): number - Results to return (1-20, default 5)

**Response**:
```typescript
interface RegulationSearchResponse {
  query: string;
  results: string[];  // Array of regulation text chunks
  metadatas: RegulationMetadata[];
  distances: number[];  // Similarity scores (lower is better)
  count: number;
}

interface RegulationMetadata {
  regulation_name: string;
  source_file: string;
  department: string;
  clause_id: string;
  chunk_index: number;
}
```

**Example**:
```typescript
const response = await fetch(
  'http://localhost:8000/api/v1/regulations/search?query=fire%20safety&n_results=5'
);
const data: RegulationSearchResponse = await response.json();
```

#### Ingest Regulations
```
POST /api/v1/regulations/ingest
```

**Request Body**: None

**Response**:
```typescript
interface IngestionResponse {
  success: boolean;
  message: string;
  total_files: number;
  successful: number;
  failed: number;
  total_chunks: number;
}
```

### 3. Compliance Endpoints (Phase 3 - Planned)

#### Analyze Compliance
```
POST /api/v1/compliance/analyze
```

**Request Body**:
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

**Response**:
```typescript
interface ComplianceReport {
  application_id?: string;
  status: "compliant" | "partial" | "non_compliant";
  confidence_score: number;  // 0-1
  issues: ComplianceIssue[];
  missing_documents: string[];
  recommendations: string[];
  regulation_coverage: number;  // 0-1
  generated_at: string;
}

interface ComplianceIssue {
  issue_type: "missing_document" | "violation" | "ambiguity";
  severity: "low" | "medium" | "high";
  description: string;
  regulation_reference?: string;
  department?: string;
}
```

### 4. Chat Endpoints (Phase 3 - Planned)

#### Chat
```
POST /api/v1/chat
```

**Request Body**:
```typescript
interface ChatRequest {
  messages: ChatMessage[];
}

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}
```

**Response**:
```typescript
interface ChatResponse {
  message: string;
}
```

## TypeScript API Client

### Recommended Structure (`lib/api.ts`)

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export class CivicAssistAPI {
  // Regulation Search
  static async searchRegulations(
    query: string,
    options?: {
      department?: string;
      n_results?: number;
    }
  ): Promise<RegulationSearchResponse> {
    const params = new URLSearchParams({
      query,
      ...(options?.department && { department: options.department }),
      ...(options?.n_results && { n_results: options.n_results.toString() }),
    });

    const response = await fetch(
      `${API_BASE_URL}/api/v1/regulations/search?${params}`
    );

    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Ingest Regulations
  static async ingestRegulations(): Promise<IngestionResponse> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/regulations/ingest`,
      { method: 'POST' }
    );

    if (!response.ok) {
      throw new Error(`Ingestion failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Phase 3: Compliance Analysis
  static async analyzeCompliance(
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
      throw new Error(`Analysis failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Phase 3: Chat
  static async chat(messages: ChatMessage[]): Promise<ChatResponse> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/chat`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      }
    );

    if (!response.ok) {
      throw new Error(`Chat failed: ${response.statusText}`);
    }

    return response.json();
  }
}
```

## Error Handling

All endpoints return standard HTTP error responses:

```typescript
interface ErrorResponse {
  detail: string;
}
```

**Status Codes**:
- `200` - Success
- `400` - Bad Request (invalid parameters)
- `500` - Internal Server Error

**Example Error Handling**:
```typescript
try {
  const results = await CivicAssistAPI.searchRegulations("fire safety");
} catch (error) {
  console.error("Search failed:", error);
  // Show user-friendly error message
}
```

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:3000` (Next.js dev server)
- `http://localhost:8501` (Streamlit - legacy)

## Environment Variables

Create `.env.local` in Next.js project:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Usage in Components

### Example: Regulation Search Component

```typescript
'use client';

import { useState } from 'react';
import { CivicAssistAPI } from '@/lib/api';
import type { RegulationSearchResponse } from '@/lib/types';

export function RegulationSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<RegulationSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await CivicAssistAPI.searchRegulations(query);
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search regulations..."
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>

      {results && (
        <div>
          <h3>Found {results.count} results</h3>
          {results.results.map((text, i) => (
            <div key={i}>
              <p>{text}</p>
              <small>
                {results.metadatas[i].regulation_name} - 
                {results.metadatas[i].department}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Testing

### Manual Testing

```bash
# Test regulation search
curl "http://localhost:8000/api/v1/regulations/search?query=fire%20safety&n_results=3"

# Test ingestion
curl -X POST http://localhost:8000/api/v1/regulations/ingest
```

### Integration Testing (Phase 3)

```typescript
describe('CivicAssist API', () => {
  it('should search regulations', async () => {
    const results = await CivicAssistAPI.searchRegulations('fire safety');
    expect(results.count).toBeGreaterThan(0);
    expect(results.results).toBeInstanceOf(Array);
  });

  it('should handle search errors', async () => {
    await expect(
      CivicAssistAPI.searchRegulations('')
    ).rejects.toThrow();
  });
});
```

---

**Contract Version**: Phase 2
**Last Updated**: 2026-01-04
**Status**: Regulation endpoints implemented, Compliance/Chat pending Phase 3
