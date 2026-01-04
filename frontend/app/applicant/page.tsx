'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { CivicAssistAPI, formatConfidence, getStatusColor, getRiskColor, getRiskBadgeColor } from '@/lib/api';
import type { IndustrialApplication, ComplianceReport, ApplicationSubmission } from '@/lib/types';

export default function ApplicantMode() {
    const [formData, setFormData] = useState<IndustrialApplication>({
        industry_name: '',
        square_feet: '',
        water_source: '',
        drainage: '',
        air_pollution: '',
        waste_management: '',
        nearby_homes: '',
        water_level_depth: '',
    });

    const [report, setReport] = useState<ComplianceReport | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Submission State
    const [submissionReason, setSubmissionReason] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

    const handleSubmitAnalysis = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setReport(null);
        setSubmitSuccess(null);

        try {
            const result = await CivicAssistAPI.analyzeCompliance(formData);
            setReport(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Analysis failed');
        } finally {
            setLoading(false);
        }
    };

    const handleApplicationSubmit = async () => {
        if (!report) return;

        // Validation: If not compliant, reason is required
        if (report.status !== 'compliant' && !submissionReason.trim()) {
            alert("Please provide a reason or mitigation plan for the remaining issues.");
            return;
        }

        setSubmitting(true);
        try {
            const submission: ApplicationSubmission = {
                application_data: formData,
                compliance_report: report,
                submission_reason: submissionReason
            };

            const savedApp = await CivicAssistAPI.submitApplication(submission);
            setSubmitSuccess(savedApp.id);
            alert(`Application Submitted Successfully! ID: ${savedApp.id}`);
        } catch (err) {
            alert(`Submission Failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <Header currentRole="applicant" />

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Advisory Notice */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
                    <p className="text-blue-900">
                        <strong>Advisory Only:</strong> This self-check is for informational purposes.
                        Results are not official approvals. Submit your application through official channels.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Application Form */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Application Details</h2>
                        <form onSubmit={handleSubmitAnalysis} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Industry Name *</label>
                                <input
                                    type="text"
                                    name="industry_name"
                                    value={formData.industry_name}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
                                    placeholder="e.g., ABC Textile Mill"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Square Footage *</label>
                                <input
                                    type="text"
                                    name="square_feet"
                                    value={formData.square_feet}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    placeholder="e.g., 5000"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Water Source *</label>
                                <input
                                    type="text"
                                    name="water_source"
                                    value={formData.water_source}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    placeholder="e.g., Municipal supply"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Drainage System *</label>
                                <input
                                    type="text"
                                    name="drainage"
                                    value={formData.drainage}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    placeholder="e.g., Connected to city drainage"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Air Pollution Control *</label>
                                <textarea
                                    name="air_pollution"
                                    value={formData.air_pollution}
                                    onChange={handleChange}
                                    required
                                    rows={2}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    placeholder="e.g., Electrostatic precipitators installed"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Waste Management Plan *</label>
                                <textarea
                                    name="waste_management"
                                    value={formData.waste_management}
                                    onChange={handleChange}
                                    required
                                    rows={2}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    placeholder="e.g., Segregated disposal with authorized vendor"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Distance to Nearest Homes *</label>
                                <input
                                    type="text"
                                    name="nearby_homes"
                                    value={formData.nearby_homes}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    placeholder="e.g., 500 meters"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Water Level Depth *</label>
                                <input
                                    type="text"
                                    name="water_level_depth"
                                    value={formData.water_level_depth}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    placeholder="e.g., 50 feet"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded transition"
                            >
                                {loading ? 'Analyzing...' : '🔍 Run Pre-Submission Check'}
                            </button>
                        </form>
                    </div>

                    {/* Results Panel */}
                    <div>
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
                                <p className="text-red-900"><strong>Error:</strong> {error}</p>
                            </div>
                        )}

                        {submitSuccess && (
                            <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-6 rounded text-center">
                                <h3 className="text-xl font-bold text-green-900 mb-2">Application Submitted! 🎉</h3>
                                <p className="text-green-800">Your application has been forwarded for official review.</p>
                                <p className="text-sm text-green-700 mt-2"><strong>Submission ID:</strong> {submitSuccess}</p>
                            </div>
                        )}

                        {report && !submitSuccess && (
                            <div className="bg-white p-6 rounded-lg shadow space-y-6">
                                <h2 className="text-xl font-bold text-gray-900">Compliance Analysis Results</h2>

                                {/* Status */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Overall Status</label>
                                    <div className={`inline-block px-4 py-2 rounded border-2 font-semibold ${getStatusColor(report.status)}`}>
                                        {report.status.toUpperCase().replace('_', ' ')}
                                    </div>
                                </div>

                                {/* Confidence Score */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Confidence Score</label>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 bg-gray-200 rounded-full h-4">
                                            <div
                                                className="bg-blue-600 h-4 rounded-full"
                                                style={{ width: formatConfidence(report.confidence_score) }}
                                            />
                                        </div>
                                        <span className="font-semibold">{formatConfidence(report.confidence_score)}</span>
                                    </div>
                                </div>

                                {/* Missing Documents */}
                                {report.missing_documents.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">❌ Missing Documents</h3>
                                        <ul className="space-y-1">
                                            {report.missing_documents.map((doc, i) => (
                                                <li key={i} className="text-sm text-gray-700">• {doc}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Issues */}
                                {report.issues.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">⚠️ Flagged Issues</h3>
                                        <div className="space-y-3">
                                            {report.issues.map((issue, i) => (
                                                <div key={i} className={`border-l-4 p-3 rounded ${getRiskColor(issue.severity)}`}>
                                                    <div className="flex items-start justify-between mb-1">
                                                        <span className={`text-xs px-2 py-1 rounded font-semibold ${getRiskBadgeColor(issue.severity)}`}>
                                                            {issue.severity.toUpperCase()}
                                                        </span>
                                                        {issue.department && (
                                                            <span className="text-xs text-gray-600">{issue.department}</span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm font-medium text-gray-900 mt-2">{issue.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Recommendations */}
                                {report.recommendations.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">✅ Recommended Actions</h3>
                                        <ol className="space-y-2">
                                            {report.recommendations.map((rec, i) => (
                                                <li key={i} className="text-sm text-gray-700">
                                                    {i + 1}. {rec}
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                )}

                                {/* OFFICIAL SUBMISSION SECTION */}
                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">📢 Proceed to Submission</h3>

                                    {report.status !== 'compliant' && (
                                        <div className="mb-4">
                                            <div className="bg-yellow-50 p-3 rounded mb-2 border border-yellow-200 text-sm text-yellow-800">
                                                <strong>Note:</strong> Your application is not fully compliant. You must provide a reason or mitigation plan to proceed.
                                            </div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Reason for Submission / Mitigation Plan *
                                            </label>
                                            <textarea
                                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                                rows={3}
                                                placeholder="Explain why you are submitting despite issues, or your plan to fix them..."
                                                value={submissionReason}
                                                onChange={(e) => setSubmissionReason(e.target.value)}
                                            />
                                        </div>
                                    )}

                                    <button
                                        onClick={handleApplicationSubmit}
                                        disabled={submitting}
                                        className={`w-full font-bold py-3 rounded transition shadow-lg ${report.status === 'compliant'
                                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                                : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                                            }`}
                                    >
                                        {submitting ? 'Submitting...' : '📤 Submit Application for Review'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {!report && !error && !loading && (
                            <div className="bg-gray-100 p-8 rounded-lg text-center text-gray-600">
                                <p>Fill out the form and click "Run Pre-Submission Check" to analyze your application.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
