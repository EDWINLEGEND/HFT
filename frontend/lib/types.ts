/**
 * TypeScript type definitions for CivicAssist API
 * Phase 4: Frontend Implementation
 */

// Application Types
export interface IndustrialApplication {
  industry_name: string;
  square_feet: string;
  water_source: string;
  drainage: string;
  air_pollution: string;
  waste_management: string;
  nearby_homes: string;
  water_level_depth: string;
  document_url?: string; // New field
}

// Compliance Report Types
export interface ComplianceIssue {
  issue_type: 'missing_document' | 'violation' | 'ambiguity';
  severity: 'low' | 'medium' | 'high';
  description: string;
  regulation_reference?: string;
  department?: string;
}

export interface ComplianceReport {
  application_id?: string;
  status: 'compliant' | 'partial' | 'non_compliant';
  confidence_score: number; // 0.0-1.0
  issues: ComplianceIssue[];
  missing_documents: string[];
  recommendations: string[];
  regulation_coverage: number; // 0.0-1.0
  generated_at: string;
}

// Application Persistence Types
export interface ApplicationSubmission {
  application_data: IndustrialApplication;
  compliance_report: ComplianceReport;
  submission_reason?: string;
}

export interface SavedApplication extends ApplicationSubmission {
  id: string;
  submitted_at: string;
  status: string;
  // Officer Review Fields
  officer_action?: string;
  officer_notes?: string;
  rejection_reason?: string;
  time_saved_seconds: number;
}

// Regulation Search Types
export interface RegulationMetadata {
  regulation_name: string;
  source_file: string;
  department: string;
  clause_id: string;
  chunk_index: number;
}

export interface RegulationSearchResponse {
  query: string;
  results: string[];
  metadatas: RegulationMetadata[];
  distances: number[];
  count: number;
}

// System Types
export interface HealthResponse {
  status: string;
  version: string;
  timestamp: string;
}

export interface VersionResponse {
  api_version: string;
  app_name: string;
}

// UI Helper Types
export type ComplianceStatus = 'compliant' | 'partial' | 'non_compliant';
export type RiskLevel = 'low' | 'medium' | 'high';
export type IssueType = 'missing_document' | 'violation' | 'ambiguity';
