/**
 * API Client for CivicAssist Backend
 * Phase 4: Frontend Implementation
 */

import type {
    IndustrialApplication,
    ComplianceReport,
    RegulationSearchResponse,
    HealthResponse,
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
