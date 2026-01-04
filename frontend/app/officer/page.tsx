'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CivicAssistAPI, formatConfidence, formatCoverage, getStatusColor, getRiskColor, getRiskBadgeColor } from '@/lib/api';
import type { IndustrialApplication, ComplianceReport, ComplianceIssue } from '@/lib/types';

// Sample applications for demo
const SAMPLE_APPLICATIONS: Record<string, IndustrialApplication> = {
    'app-001': {
        industry_name: 'ABC Textile Manufacturing',
        square_feet: '5000',
        water_source: 'Municipal water supply',
        drainage: 'Connected to city drainage system',
        air_pollution: 'Electrostatic precipitators installed',
        waste_management: 'Segregated waste disposal with authorized vendor',
        nearby_homes: '500 meters',
        water_level_depth: '50 feet',
    },
    'app-002': {
        industry_name: 'XYZ Steel Processing',
        square_feet: '10000',
        water_source: 'Groundwater with NOC',
        drainage: 'Industrial drainage with treatment',
        air_pollution: 'Advanced filtration system',
        waste_management: 'Comprehensive hazardous waste management plan',
        nearby_homes: '1500 meters',
        water_level_depth: '60 feet',
    },
};

export default function OfficerMode() {
    const [selectedApp, setSelectedApp] = useState<string>('');
    const [report, setReport] = useState<ComplianceReport | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedIssue, setSelectedIssue] = useState<ComplianceIssue | null>(null);

    const handleAnalyze = async () => {
        if (!selectedApp) return;

        setLoading(true);
        setError(null);
        setReport(null);
        setSelectedIssue(null);

        try {
            const application = SAMPLE_APPLICATIONS[selectedApp];
            const result = await CivicAssistAPI.analyzeCompliance(application);
            setReport(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Analysis failed');
        } finally {
            setLoading(false);
        }
    };

    const handleCopyChecklist = () => {
        if (!report) return;
        const checklist = report.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n');
        navigator.clipboard.writeText(checklist);
        alert('Checklist copied to clipboard!');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm">← Back to Home</Link>
                    <h1 className="text-2xl font-bold text-gray-900 mt-1">⚖️ Officer Mode</h1>
                    <p className="text-gray-600 text-sm">Application Review & Decision Support</p>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Human-in-the-Loop Notice */}
                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded">
                    <p className="text-green-900">
                        <strong>Advisory System:</strong> All AI outputs are recommendations only.
                        Final approval decisions remain with you, the qualified officer.
                    </p>
                </div>

                {/* Application Selector */}
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Select Application to Review</h2>
                    <div className="flex gap-4">
                        <select
                            value={selectedApp}
                            onChange={(e) => setSelectedApp(e.target.value)}
                            className="flex-1 border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
                        >
                            <option value="">-- Select an application --</option>
                            <option value="app-001">APP-001: ABC Textile Manufacturing</option>
                            <option value="app-002">APP-002: XYZ Steel Processing</option>
                        </select>
                        <button
                            onClick={handleAnalyze}
                            disabled={!selectedApp || loading}
                            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold px-6 py-2 rounded transition"
                        >
                            {loading ? 'Analyzing...' : '🔍 Analyze Application'}
                        </button>
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                        <p className="text-red-900"><strong>Error:</strong> {error}</p>
                    </div>
                )}

                {/* Results */}
                {report && (
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Main Report */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Overview Card */}
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Compliance Overview</h2>

                                <div className="grid md:grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Overall Status</label>
                                        <div className={`inline-block px-4 py-2 rounded border-2 font-semibold ${getStatusColor(report.status)}`}>
                                            {report.status.toUpperCase().replace('_', ' ')}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Confidence Score</label>
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 bg-gray-200 rounded-full h-3">
                                                <div
                                                    className="bg-blue-600 h-3 rounded-full"
                                                    style={{ width: formatConfidence(report.confidence_score) }}
                                                />
                                            </div>
                                            <span className="font-semibold text-lg">{formatConfidence(report.confidence_score)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-blue-50 p-4 rounded">
                                        <div className="text-sm text-gray-600">Regulation Coverage</div>
                                        <div className="text-2xl font-bold text-blue-900">{formatCoverage(report.regulation_coverage)}</div>
                                    </div>

                                    <div className="bg-purple-50 p-4 rounded">
                                        <div className="text-sm text-gray-600">Issues Found</div>
                                        <div className="text-2xl font-bold text-purple-900">{report.issues.length}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Issues List */}
                            {report.issues.length > 0 && (
                                <div className="bg-white p-6 rounded-lg shadow">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Flagged Issues</h2>
                                    <div className="space-y-3">
                                        {report.issues.map((issue, i) => (
                                            <div
                                                key={i}
                                                onClick={() => setSelectedIssue(issue)}
                                                className={`border-l-4 p-4 rounded cursor-pointer hover:shadow-md transition ${getRiskColor(issue.severity)} ${selectedIssue === issue ? 'ring-2 ring-blue-500' : ''}`}
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <span className={`text-xs px-2 py-1 rounded font-semibold ${getRiskBadgeColor(issue.severity)}`}>
                                                        {issue.severity.toUpperCase()} RISK
                                                    </span>
                                                    {issue.department && (
                                                        <span className="text-xs bg-gray-200 px-2 py-1 rounded">{issue.department}</span>
                                                    )}
                                                </div>
                                                <p className="font-medium text-gray-900 mb-1">{issue.description}</p>
                                                {issue.regulation_reference && (
                                                    <p className="text-sm text-gray-600">📖 {issue.regulation_reference}</p>
                                                )}
                                                <p className="text-xs text-blue-600 mt-2">Click to view details →</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Recommendations */}
                            {report.recommendations.length > 0 && (
                                <div className="bg-white p-6 rounded-lg shadow">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-xl font-bold text-gray-900">Recommended Actions</h2>
                                        <button
                                            onClick={handleCopyChecklist}
                                            className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded"
                                        >
                                            📋 Copy Checklist
                                        </button>
                                    </div>
                                    <ol className="space-y-2">
                                        {report.recommendations.map((rec, i) => (
                                            <li key={i} className="flex gap-3">
                                                <span className="font-semibold text-gray-600">{i + 1}.</span>
                                                <span className="text-gray-900">{rec}</span>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            )}
                        </div>

                        {/* Explainability Panel */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-lg shadow sticky top-4">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">📖 Issue Details</h2>

                                {selectedIssue ? (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Risk Level</label>
                                            <span className={`inline-block px-3 py-1 rounded font-semibold ${getRiskBadgeColor(selectedIssue.severity)}`}>
                                                {selectedIssue.severity.toUpperCase()}
                                            </span>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Issue Type</label>
                                            <p className="text-gray-900">{selectedIssue.issue_type.replace('_', ' ')}</p>
                                        </div>

                                        {selectedIssue.department && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-1">Department</label>
                                                <p className="text-gray-900">{selectedIssue.department}</p>
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Explanation</label>
                                            <p className="text-gray-900 leading-relaxed">{selectedIssue.description}</p>
                                        </div>

                                        {selectedIssue.regulation_reference && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-1">Regulation Reference</label>
                                                <div className="bg-blue-50 p-3 rounded border border-blue-200">
                                                    <p className="text-sm text-blue-900">{selectedIssue.regulation_reference}</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="pt-4 border-t">
                                            <p className="text-xs text-gray-600 italic">
                                                This issue was identified by analyzing the application against retrieved regulations.
                                                All citations are traceable to source documents.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500 py-8">
                                        <p>Click on an issue to view detailed explanation and regulation references.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {!report && !error && !loading && (
                    <div className="bg-gray-100 p-12 rounded-lg text-center text-gray-600">
                        <p className="text-lg">Select an application and click "Analyze Application" to begin review.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
