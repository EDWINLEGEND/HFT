'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import FileUploader from '@/components/FileUploader'; // New component
import { CivicAssistAPI, formatConfidence, getStatusColor, getRiskColor, getRiskBadgeColor } from '@/lib/api';
import type { IndustrialApplication, ComplianceReport, ApplicationSubmission } from '@/lib/types';

const APP_TYPES = [
    { id: 'manufacturing', name: 'Manufacturing / Industrial Unit', docs: ['Site Plan', 'Pollution Control Consent'] },
    { id: 'startup', name: 'Startup Registration', docs: ['Certificate of Incorporation', 'Founders Agreement'] },
    { id: 'food_processing', name: 'Food Processing Unit', docs: ['FSSAI License', 'Waste Management Plan'] }
];

export default function ApplicantMode() {
    // 1. Application Type State
    const [appType, setAppType] = useState(APP_TYPES[0].id);

    // 2. Form Data State
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

    // 3. Document State
    const [uploadedDocs, setUploadedDocs] = useState<Record<string, { valid: boolean; reason?: string }>>({});
    const [extracted, setExtracted] = useState(false);
    const [extracting, setExtracting] = useState(false);

    // 4. Analysis & Submission State
    const [report, setReport] = useState<ComplianceReport | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submissionReason, setSubmissionReason] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

    const handleExtractionUpload = async (file: File) => {
        setExtracting(true);
        setError(null);
        try {
            const result = await CivicAssistAPI.extractDocumentDetails(file);
            console.log("Extraction Result:", result);
            setFormData(prev => ({ ...prev, ...result.extracted_data }));
            setExtracted(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to extract details");
            console.error(err);
        } finally {
            setExtracting(false);
        }
    };

    const handleDocValidation = async (docName: string, file: File) => {
        try {
            const result = await CivicAssistAPI.validateDocument(file, docName);
            setUploadedDocs(prev => ({
                ...prev,
                [docName]: { valid: result.is_valid, reason: result.reason }
            }));
        } catch (err) {
            console.error(err);
        }
    };

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

    const currentAppType = APP_TYPES.find(t => t.id === appType);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <Header currentRole="applicant" />

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Steps Indicator */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className={`px-3 py-1 rounded-full ${!extracted ? 'bg-blue-600 text-white' : 'bg-green-100 text-green-700'}`}>1. Upload Application</span>
                        <span>→</span>
                        <span className={`px-3 py-1 rounded-full ${extracted && !report ? 'bg-blue-600 text-white' : (report ? 'bg-green-100 text-green-700' : 'bg-gray-200')}`}>2. Review & Analyze</span>
                        <span>→</span>
                        <span className={`px-3 py-1 rounded-full ${report ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>3. Submit</span>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">

                    {/* LEFT COLUMN: UPLOAD & FORM */}
                    <div className="space-y-6">
                        {/* 1. App Type Selector */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Select Application Type</h2>
                            <select
                                value={appType}
                                onChange={(e) => setAppType(e.target.value)}
                                className="w-full border p-2 rounded"
                            >
                                {APP_TYPES.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* 2. Main Document Upload (Scraping) */}
                        <div className="bg-white p-6 rounded-lg shadow bg-gradient-to-r from-blue-50 to-white border border-blue-100">
                            <h2 className="text-lg font-bold text-blue-900 mb-2">📄 Auto-Fill from Document</h2>
                            <p className="text-sm text-gray-600 mb-4">Upload your project proposal (PDF/Text) to automatically fill the application details below.</p>

                            <FileUploader
                                label="Project Proposal / Application Letter"
                                onFileSelect={handleExtractionUpload}
                                disabled={extracting}
                            />
                            {extracting && <p className="text-blue-600 text-sm mt-2 animate-pulse">Running AI Extraction...</p>}
                            {extracted && <p className="text-green-600 text-sm mt-2 font-semibold">✅ Data Extracted Successfully!</p>}
                        </div>

                        {/* 3. The Form (Auto-filled but editable) */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Application Details</h2>
                            <form onSubmit={handleSubmitAnalysis} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Industry Name</label>
                                        <input type="text" name="industry_name" value={formData.industry_name} onChange={handleChange} required className="w-full border p-2 rounded text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Square Feet</label>
                                        <input type="text" name="square_feet" value={formData.square_feet} onChange={handleChange} required className="w-full border p-2 rounded text-sm" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Water Source</label>
                                        <input type="text" name="water_source" value={formData.water_source} onChange={handleChange} required className="w-full border p-2 rounded text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Drainage</label>
                                        <input type="text" name="drainage" value={formData.drainage} onChange={handleChange} required className="w-full border p-2 rounded text-sm" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Air Pollution Control</label>
                                    <textarea name="air_pollution" value={formData.air_pollution} onChange={handleChange} required rows={2} className="w-full border p-2 rounded text-sm" />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Waste Management</label>
                                    <textarea name="waste_management" value={formData.waste_management} onChange={handleChange} required rows={2} className="w-full border p-2 rounded text-sm" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Nearest Homes</label>
                                        <input type="text" name="nearby_homes" value={formData.nearby_homes} onChange={handleChange} required className="w-full border p-2 rounded text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Water Level</label>
                                        <input type="text" name="water_level_depth" value={formData.water_level_depth} onChange={handleChange} required className="w-full border p-2 rounded text-sm" />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded transition shadow-md"
                                >
                                    {loading ? 'Analyzing Compliance...' : '🔍 Analyze Compliance'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: ADDITIONAL DOCS & RESULTS */}
                    <div className="space-y-6">

                        {/* 4. Required Documents Checklist (Validation) */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Required Documents Checklist</h2>
                            <p className="text-sm text-gray-500 mb-4">Please upload the following Supporting Documents for <strong>{currentAppType?.name}</strong>.</p>

                            <div className="space-y-4">
                                {currentAppType?.docs.map(doc => (
                                    <div key={doc} className="p-4 border rounded-lg bg-gray-50">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-medium text-sm text-gray-700">{doc}</span>
                                            {uploadedDocs[doc] && (
                                                <span className={`text-xs font-bold px-2 py-1 rounded ${uploadedDocs[doc].valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {uploadedDocs[doc].valid ? '✅ Valid' : '❌ Invalid'}
                                                </span>
                                            )}
                                        </div>
                                        <FileUploader
                                            label=""
                                            onFileSelect={(f) => handleDocValidation(doc, f)}
                                        />
                                        {uploadedDocs[doc] && !uploadedDocs[doc].valid && (
                                            <p className="text-xs text-red-600 mt-2">{uploadedDocs[doc].reason}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 5. Results & Final Submission */}
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                <p className="text-red-900"><strong>Error:</strong> {error}</p>
                            </div>
                        )}

                        {submitSuccess && (
                            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded text-center shadow-lg transform transition-all">
                                <h3 className="text-2xl font-bold text-green-900 mb-2">Application Submitted! 🎉</h3>
                                <p className="text-green-800">Your application has been forwarded for official review.</p>
                                <div className="mt-4 bg-white p-3 rounded border border-green-200 inline-block">
                                    <p className="text-sm text-green-700 font-mono">ID: {submitSuccess}</p>
                                </div>
                            </div>
                        )}

                        {report && !submitSuccess && (
                            <div className="bg-white p-6 rounded-lg shadow space-y-6 border-t-4 border-blue-500 animate-fade-in">
                                <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Analysis Results</h2>

                                {/* Status Badge */}
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 font-medium">Status:</span>
                                    <span className={`px-4 py-2 rounded-full font-bold uppercase text-sm border ${getStatusColor(report.status)}`}>
                                        {report.status.replace('_', ' ')}
                                    </span>
                                </div>

                                {/* Missing Docs Alert */}
                                {report.missing_documents.length > 0 && (
                                    <div className="bg-red-50 p-4 rounded text-sm text-red-800">
                                        <strong>Missing Documents detected by AI:</strong>
                                        <ul className="list-disc pl-5 mt-1">
                                            {report.missing_documents.map((d, i) => <li key={i}>{d}</li>)}
                                        </ul>
                                    </div>
                                )}

                                {/* Issues List */}
                                <div className="space-y-3">
                                    {report.issues.map((issue, i) => (
                                        <div key={i} className={`p-3 rounded border-l-4 text-sm ${getRiskColor(issue.severity)}`}>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className={`text-xs font-bold px-1 rounded ${getRiskBadgeColor(issue.severity)}`}>{issue.severity.toUpperCase()}</span>
                                                <span className="text-xs opacity-70">{issue.department}</span>
                                            </div>
                                            <p className="font-medium">{issue.description}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* SUBMISSION AREA */}
                                <div className="pt-4 border-t">
                                    <h3 className="text-sm font-bold text-gray-700 mb-2">Final Submission</h3>

                                    {report.status !== 'compliant' && (
                                        <div className="mb-3">
                                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                                Mitigation Plan / Reason (Required for partial compliance) *
                                            </label>
                                            <textarea
                                                className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
                                                rows={3}
                                                placeholder="Explain your plan to address issues..."
                                                value={submissionReason}
                                                onChange={(e) => setSubmissionReason(e.target.value)}
                                            />
                                        </div>
                                    )}

                                    <button
                                        onClick={handleApplicationSubmit}
                                        disabled={submitting}
                                        className={`w-full font-bold py-3 rounded transition shadow-lg text-white ${report.status === 'compliant' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                                            }`}
                                    >
                                        {submitting ? 'Submitting...' : '📤 Final Submission'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
