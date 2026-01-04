/**
 * API Client for CivicAssist Backend
 * Phase 4: Frontend Implementation
 */

import type {
    IndustrialApplication,
    ComplianceReport,
    RegulationSearchResponse,
    HealthResponse,
    ApplicationSubmission,
    SavedApplication
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * CivicAssist API Client
 */
export class CivicAssistAPI {
    /**
     * Check API health
     */
    static async checkHealth(): Promise<HealthResponse> {
        const response = await fetch(`${API_BASE_URL}/api/v1/health`);

        if (!response.ok) {
            throw new Error(`Health check failed: ${response.statusText}`);
        }

        return response.json();
    }

    /**
     * Search regulations by query
     */
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

    /**
     * Analyze industrial application for compliance
     */
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
            const error = await response.json().catch(() => ({ detail: response.statusText }));
            throw new Error(error.detail || 'Analysis failed');
        }

        return response.json();
    }

    /**
     * Submit application for review
     */
    static async submitApplication(
        submission: ApplicationSubmission
    ): Promise<SavedApplication> {
        const response = await fetch(
            `${API_BASE_URL}/api/v1/applications`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submission),
            }
        );

        if (!response.ok) {
            throw new Error(`Submission failed: ${response.statusText}`);
        }

        return response.json();
    }

    static async extractDocumentDetails(file: File): Promise<{ filename: string; extracted_data: IndustrialApplication & { document_url?: string } }> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_BASE_URL}/api/v1/documents/extract`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `Extraction failed: ${response.statusText}`);
        }

        return response.json();
    }

    static async validateDocument(file: File, docType: string): Promise<{ is_valid: boolean; reason?: string }> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('doc_type', docType);

        const response = await fetch(`${API_BASE_URL}/api/v1/documents/validate`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Document validation failed');
        }

        return response.json();
    }

    /**
     * Get all applications for officer view
     */
    static async getApplications(): Promise<SavedApplication[]> {
        const response = await fetch(`${API_BASE_URL}/api/v1/applications`);

        if (!response.ok) {
            throw new Error(`Fetch failed: ${response.statusText}`);
        }

        return response.json();
    }

    static async getApplicationDetails(id: string): Promise<SavedApplication> {
        const response = await fetch(`${API_BASE_URL}/api/v1/applications/${id}`);
        if (!response.ok) throw new Error('Failed to fetch application details');
        return response.json();
    }

    static async reviewApplication(id: string, action: 'approve' | 'reject' | 'manual_review', notes?: string, reason?: string): Promise<SavedApplication> {
        const response = await fetch(`${API_BASE_URL}/api/v1/applications/${id}/review`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, notes, rejection_reason: reason })
        });
        if (!response.ok) throw new Error('Review failed');
        return response.json();
    }

    static async updateOverrides(id: string, overrides: Record<number, { accepted: boolean | null; reason?: string }>): Promise<SavedApplication> {
        const response = await fetch(`${API_BASE_URL}/api/v1/applications/${id}/overrides`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(overrides)
        });
        if (!response.ok) throw new Error('Override update failed');
        return response.json();
    }
}

/**
 * Format confidence score as percentage
 */
export function formatConfidence(score: number): string {
    return `${Math.round(score * 100)}%`;
}

/**
 * Format regulation coverage as percentage
 */
export function formatCoverage(coverage: number): string {
    return `${Math.round(coverage * 100)}%`;
}

/**
 * Get status color class
 */
export function getStatusColor(status: string): string {
    switch (status) {
        case 'compliant':
            return 'text-green-700 bg-green-100 border-green-300';
        case 'partial':
            return 'text-yellow-700 bg-yellow-100 border-yellow-300';
        case 'non_compliant':
            return 'text-red-700 bg-red-100 border-red-300';
        default:
            return 'text-gray-700 bg-gray-100 border-gray-300';
    }
}

/**
 * Get risk level color class
 */
export function getRiskColor(severity: string): string {
    switch (severity) {
        case 'high':
            return 'border-red-500 bg-red-50';
        case 'medium':
            return 'border-yellow-500 bg-yellow-50';
        case 'low':
            return 'border-blue-500 bg-blue-50';
        default:
            return 'border-gray-500 bg-gray-50';
    }
}

/**
 * Get risk level badge color
 */
export function getRiskBadgeColor(severity: string): string {
    switch (severity) {
        case 'high':
            return 'bg-red-100 text-red-800';
        case 'medium':
            return 'bg-yellow-100 text-yellow-800';
        case 'low':
            return 'bg-blue-100 text-blue-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}
