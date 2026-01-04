'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import FileUploader from '@/components/FileUploader';
import { CivicAssistAPI, getStatusColor, getRiskColor, getRiskBadgeColor } from '@/lib/api';
import type { IndustrialApplication, ComplianceReport, ApplicationSubmission } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, CheckCircle, AlertTriangle, FileText, Sparkles, Send, Search, Info, RefreshCw, Clock, Languages } from "lucide-react";
import { Progress } from "@/components/ui/progress";

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

    // 🟡 PHASE 2: ENGAGEMENT STATE
    const [expandedHelp, setExpandedHelp] = useState<Set<number>>(new Set());
    const [isRechecking, setIsRechecking] = useState(false);

    // 🟡 PHASE 3: ADVANCED STATE
    const [useSimpleLanguage, setUseSimpleLanguage] = useState(true);

    const handleExtractionUpload = async (file: File) => {
        setExtracting(true);
        setError(null);
        try {
            const result = await CivicAssistAPI.extractDocumentDetails(file);
            console.log("Extraction Result:", result);
            setFormData(prev => ({
                ...prev,
                ...result.extracted_data,
                document_url: result.extracted_data.document_url // Store the URL
            }));
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

    // 🟡 PHASE 2: HELP TOGGLE
    const toggleHelp = (index: number) => {
        const newExpanded = new Set(expandedHelp);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedHelp(newExpanded);
    };

    // 🟡 PHASE 2: RE-CHECK FUNCTIONALITY
    const handleRecheck = async () => {
        setIsRechecking(true);
        setError(null);

        try {
            const result = await CivicAssistAPI.analyzeCompliance(formData);
            setReport(result);
            // Show success message (optional)
            alert('✅ Analysis updated! Check your progress.');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Re-check failed');
            alert('❌ Re-check failed. Please try again.');
        } finally {
            setIsRechecking(false);
        }
    };

    // 🟡 PHASE 2: PROGRESS CALCULATION
    const calculateProgress = () => {
        if (!report) return 0;

        const requiredDocs = ['Fire Safety Certificate', 'Environmental Clearance', 'Building Plan Approval', 'Waste Management Plan', 'Water Source Authorization'];
        const docsUploaded = requiredDocs.length - report.missing_documents.length;
        const docScore = (docsUploaded / requiredDocs.length) * 50;

        const issueScore = report.issues.length === 0 ? 50 : Math.max(0, 50 - (report.issues.length * 5));

        return Math.min(100, Math.round(docScore + issueScore));
    };

    // 🟡 PHASE 3: LANGUAGE TOGGLE HELPER
    const getLanguageText = (simpleText: string, formalText: string) => {
        return useSimpleLanguage ? simpleText : formalText;
    };

    const currentAppType = APP_TYPES.find(t => t.id === appType);

    return (
        <div className="min-h-screen bg-gray-50 text-foreground">
            <Header currentRole="applicant" />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Steps Indicator */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center space-x-3 text-sm">
                        <Badge 
                            variant={!extracted ? "default" : "secondary"} 
                            className={`px-4 py-2 ${!extracted ? 'bg-[#00A9A0] text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            1. Upload Application
                        </Badge>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <Badge 
                            variant={extracted && !report ? "default" : (report ? "secondary" : "outline")} 
                            className={`px-4 py-2 ${extracted && !report ? 'bg-[#00A9A0] text-white' : report ? 'bg-gray-200 text-gray-700' : 'bg-white border-gray-300 text-gray-500'}`}
                        >
                            2. Review & Analyze
                        </Badge>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <Badge 
                            variant={report ? "default" : "outline"} 
                            className={`px-4 py-2 ${report ? 'bg-[#00A9A0] text-white' : 'bg-white border-gray-300 text-gray-500'}`}
                        >
                            3. Submit
                        </Badge>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">

                    {/* LEFT COLUMN: UPLOAD & FORM */}
                    <div className="space-y-6">
                        {/* 1. App Type Selector */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold text-gray-900">Select Application Type</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Select value={appType} onValueChange={setAppType}>
                                    <SelectTrigger className="w-full border-gray-300 focus:border-[#00A9A0] focus:ring-[#00A9A0]">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {APP_TYPES.map(t => (
                                            <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </CardContent>
                        </Card>

                        {/* 2. Main Document Upload (Scraping) */}
                        <Card className="border-[#E6F7F6] bg-[#E6F7F6]/50">
                            <CardHeader>
                                <CardTitle className="flex items-center text-[#008780] text-lg font-semibold">
                                    <Sparkles className="w-5 h-5 mr-2" /> Auto-Fill from Document
                                </CardTitle>
                                <CardDescription className="text-gray-600">
                                    Upload your project proposal (PDF/Text) to automatically fill the application details below.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FileUploader
                                    label="Project Proposal / Application Letter"
                                    onFileSelect={handleExtractionUpload}
                                    disabled={extracting}
                                />
                                {extracting && <p className="text-[#00A9A0] text-sm mt-2 flex items-center animate-pulse font-medium"><Sparkles className="w-4 h-4 mr-1" /> Running AI Extraction...</p>}
                                {extracted && <p className="text-green-700 text-sm mt-2 font-semibold flex items-center"><CheckCircle className="w-4 h-4 mr-1" /> Data Extracted Successfully!</p>}
                            </CardContent>
                        </Card>

                        {/* 3. The Form (Auto-filled but editable) */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold text-gray-900">Application Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmitAnalysis} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="industry_name" className="text-sm font-medium text-gray-700">Industry Name</Label>
                                            <Input id="industry_name" name="industry_name" value={formData.industry_name} onChange={handleChange} required className="border-gray-300 focus:border-[#00A9A0] focus:ring-[#00A9A0]" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="square_feet" className="text-sm font-medium text-gray-700">Square Feet</Label>
                                            <Input id="square_feet" name="square_feet" value={formData.square_feet} onChange={handleChange} required className="border-gray-300 focus:border-[#00A9A0] focus:ring-[#00A9A0]" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="water_source" className="text-sm font-medium text-gray-700">Water Source</Label>
                                            <Input id="water_source" name="water_source" value={formData.water_source} onChange={handleChange} required className="border-gray-300 focus:border-[#00A9A0] focus:ring-[#00A9A0]" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="drainage" className="text-sm font-medium text-gray-700">Drainage</Label>
                                            <Input id="drainage" name="drainage" value={formData.drainage} onChange={handleChange} required className="border-gray-300 focus:border-[#00A9A0] focus:ring-[#00A9A0]" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="air_pollution" className="text-sm font-medium text-gray-700">Air Pollution Control</Label>
                                        <Textarea id="air_pollution" name="air_pollution" value={formData.air_pollution} onChange={handleChange} required rows={2} className="border-gray-300 focus:border-[#00A9A0] focus:ring-[#00A9A0]" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="waste_management" className="text-sm font-medium text-gray-700">Waste Management</Label>
                                        <Textarea id="waste_management" name="waste_management" value={formData.waste_management} onChange={handleChange} required rows={2} className="border-gray-300 focus:border-[#00A9A0] focus:ring-[#00A9A0]" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="nearby_homes" className="text-sm font-medium text-gray-700">Nearest Homes</Label>
                                            <Input id="nearby_homes" name="nearby_homes" value={formData.nearby_homes} onChange={handleChange} required className="border-gray-300 focus:border-[#00A9A0] focus:ring-[#00A9A0]" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="water_level_depth" className="text-sm font-medium text-gray-700">Water Level</Label>
                                            <Input id="water_level_depth" name="water_level_depth" value={formData.water_level_depth} onChange={handleChange} required className="border-gray-300 focus:border-[#00A9A0] focus:ring-[#00A9A0]" />
                                        </div>
                                    </div>

                                    <Button type="submit" className="w-full bg-[#00A9A0] hover:bg-[#008780] text-white font-medium" disabled={loading} size="lg">
                                        {loading ? <span className="flex items-center"><Sparkles className="mr-2 h-5 w-5 animate-spin" /> Analyzing...</span> : <span className="flex items-center"><Search className="mr-2 h-5 w-5" /> Analyze Compliance</span>}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN: ADDITIONAL DOCS & RESULTS */}
                    <div className="space-y-6">

                        {/* 4. Required Documents Checklist (Validation) */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Required Documents Checklist</CardTitle>
                                <CardDescription>Please upload the following Supporting Documents for <strong>{currentAppType?.name}</strong>.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {currentAppType?.docs.map(doc => (
                                    <div key={doc} className="p-4 border rounded-lg bg-muted/50">
                                        <div className="flex justify-between items-start mb-2">
                                            <Label className="font-medium text-sm">{doc}</Label>
                                            {uploadedDocs[doc] && (
                                                <Badge variant={uploadedDocs[doc].valid ? "default" : "destructive"}>
                                                    {uploadedDocs[doc].valid ? 'Valid' : 'Invalid'}
                                                </Badge>
                                            )}
                                        </div>
                                        <FileUploader
                                            label=""
                                            onFileSelect={(f) => handleDocValidation(doc, f)}
                                        />
                                        {uploadedDocs[doc] && !uploadedDocs[doc].valid && (
                                            <p className="text-xs text-destructive mt-2">{uploadedDocs[doc].reason}</p>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* 5. Results & Final Submission */}
                        {error && (
                            <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {submitSuccess && (
                            <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                                <AlertTitle className="text-green-800 dark:text-green-300">Application Submitted! 🎉</AlertTitle>
                                <AlertDescription className="text-green-700 dark:text-green-400">
                                    Your application has been forwarded for official review.
                                    <div className="mt-2 font-mono text-xs p-2 bg-white dark:bg-black rounded border border-green-200 dark:border-green-800">
                                        ID: {submitSuccess}
                                    </div>
                                </AlertDescription>
                            </Alert>
                        )}

                        {report && !submitSuccess && (
                            <>
                                {/* 🟡 PHASE 3: VISUAL APPLICATION STATUS TIMELINE */}
                                <Card className="mb-4">
                                    <CardHeader>
                                        <CardTitle className="text-base font-semibold text-gray-900">Application Timeline</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between">
                                            {/* Draft */}
                                            <div className="flex flex-col items-center flex-1">
                                                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#00A9A0] text-white shadow-md">
                                                    <CheckCircle className="w-5 h-5" />
                                                </div>
                                                <p className="text-xs font-semibold mt-2 text-gray-900">Draft</p>
                                                <p className="text-xs text-gray-500">Completed</p>
                                            </div>
                                            <div className="flex-1 h-1 bg-[#00A9A0] mx-2" />

                                            {/* Self-Check */}
                                            <div className="flex flex-col items-center flex-1">
                                                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#00A9A0] text-white shadow-md">
                                                    <CheckCircle className="w-5 h-5" />
                                                </div>
                                                <p className="text-xs font-semibold mt-2 text-gray-900">Self-Check</p>
                                                <p className="text-xs text-gray-500">Completed</p>
                                            </div>
                                            <div className={`flex-1 h-1 mx-2 ${report.status === 'compliant' ? 'bg-[#00A9A0]' : 'bg-gray-300'}`} />

                                            {/* Ready to Submit */}
                                            <div className="flex flex-col items-center flex-1">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${report.status === 'compliant' ? 'bg-[#00A9A0] text-white' : 'bg-white border-2 border-gray-300 text-gray-400'
                                                    }`}>
                                                    {report.status === 'compliant' ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                                </div>
                                                <p className="text-xs font-semibold mt-2 text-gray-900">Ready</p>
                                                <p className="text-xs text-gray-500">
                                                    {report.status === 'compliant' ? 'Ready' : 'Pending'}
                                                </p>
                                            </div>
                                            <div className="flex-1 h-1 bg-gray-300 mx-2" />

                                            {/* Under Review */}
                                            <div className="flex flex-col items-center flex-1">
                                                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white border-2 border-gray-300 text-gray-400">
                                                    <Clock className="w-5 h-5" />
                                                </div>
                                                <p className="text-xs font-semibold mt-2 text-gray-900">Review</p>
                                                <p className="text-xs text-gray-500">Pending</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* 🟡 PHASE 3: SIMPLE LANGUAGE TOGGLE */}
                                <Card className="mb-4 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                                    <CardContent className="pt-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Languages className="w-5 h-5 text-purple-600" />
                                                <div>
                                                    <h3 className="font-semibold text-sm text-gray-900">Language Preference</h3>
                                                    <p className="text-xs text-gray-600">
                                                        {useSimpleLanguage ? 'Showing simple explanations' : 'Showing formal explanations'}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setUseSimpleLanguage(!useSimpleLanguage)}
                                                className="border-purple-300 text-purple-700 hover:bg-purple-50"
                                            >
                                                Switch to {useSimpleLanguage ? 'Formal' : 'Simple'}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* 🟡 PHASE 1: NO-AI DISCLAIMER */}
                                <Alert className="mb-4 bg-blue-50 border-blue-200">
                                    <FileText className="h-4 w-4 text-blue-600" />
                                    <AlertTitle className="text-blue-900 font-semibold">Important Notice</AlertTitle>
                                    <AlertDescription className="text-blue-800">
                                        This is guidance only. Final approval is done by government officers who will review your application manually.
                                    </AlertDescription>
                                </Alert>

                                {/* 🟡 PHASE 1: APPLICATION READINESS INDICATOR */}
                                {(() => {
                                    const highRiskCount = report.issues.filter(i => i.severity === 'high').length;
                                    const missingDocs = report.missing_documents.length;
                                    let readiness;

                                    if (highRiskCount > 0 || missingDocs > 0 || report.status === 'non_compliant') {
                                        readiness = { label: '❌ Not Ready', variant: 'destructive' as const, message: 'Critical issues must be resolved first.' };
                                    } else if (report.status === 'partial') {
                                        readiness = { label: '⚠️ Needs Fixes', variant: 'default' as const, message: 'Fix the issues below before submitting.' };
                                    } else {
                                        readiness = { label: '✅ Ready to Submit', variant: 'default' as const, message: 'Your application meets all requirements!' };
                                    }

                                    return (
                                        <Alert variant={readiness.variant} className="mb-4">
                                            <AlertTitle className="text-lg font-bold">{readiness.label}</AlertTitle>
                                            <AlertDescription>{readiness.message}</AlertDescription>
                                        </Alert>
                                    );
                                })()}

                                {/* 🟡 PHASE 1: PLAIN-LANGUAGE SUMMARY */}
                                <Card className="mb-4">
                                    <CardHeader>
                                        <CardTitle className="text-base">Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm">
                                            {(() => {
                                                if (report.status === 'compliant') {
                                                    return "Your application is complete and meets all requirements.";
                                                }

                                                const parts = [];
                                                const highIssues = report.issues.filter(i => i.severity === 'high');
                                                const missingDocs = report.missing_documents;

                                                if (highIssues.length > 0) {
                                                    const issues = highIssues.map(i => i.description.split('.')[0]).slice(0, 2).join(', ');
                                                    parts.push(`Critical issues: ${issues}`);
                                                }

                                                if (missingDocs.length > 0) {
                                                    parts.push(`Missing documents: ${missingDocs.slice(0, 3).join(', ')}`);
                                                }

                                                if (parts.length === 0 && report.issues.length > 0) {
                                                    parts.push("Some minor issues need attention");
                                                }

                                                return parts.join('. ') + '.';
                                            })()}
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* 🟡 PHASE 1: CONFIDENCE BANNER */}
                                {(() => {
                                    const confidence = report.confidence_score;
                                    let banner;

                                    if (confidence >= 0.8) {
                                        banner = { message: '✅ Your application meets most requirements.', className: 'bg-green-50 dark:bg-green-900/20 border-green-200' };
                                    } else if (confidence >= 0.6) {
                                        banner = { message: '⚠️ Some information may need clarification. Review carefully.', className: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200' };
                                    } else {
                                        banner = { message: '❌ Several issues detected. Review and fix before submission.', className: 'bg-red-50 dark:bg-red-900/20 border-red-200' };
                                    }

                                    return (
                                        <Alert className={`mb-4 ${banner.className}`}>
                                            <AlertDescription>{banner.message}</AlertDescription>
                                        </Alert>
                                    );
                                })()}

                                {/* 🟡 PHASE 2: VISUAL PROGRESS TRACKER */}
                                <Card className="mb-4">
                                    <CardHeader>
                                        <CardTitle className="text-base font-semibold text-gray-900">Application Progress</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {(() => {
                                            const progress = calculateProgress();
                                            const requiredDocs = ['Fire Safety Certificate', 'Environmental Clearance', 'Building Plan Approval', 'Waste Management Plan', 'Water Source Authorization'];
                                            const docsUploaded = requiredDocs.length - report.missing_documents.length;

                                            return (
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-sm text-gray-700">
                                                        <span>Documents: {docsUploaded} / {requiredDocs.length}</span>
                                                        <span className="font-bold text-[#00A9A0]">Compliance: {progress}%</span>
                                                    </div>
                                                    <Progress value={progress} className="h-2 bg-gray-200" />
                                                    <p className="text-xs text-gray-600 mt-2">
                                                        {progress === 100 ? '🎉 Excellent! Your application is ready.' :
                                                            progress >= 70 ? '👍 Good progress! A few more fixes needed.' :
                                                                progress >= 40 ? '⚠️ Making progress. Keep fixing issues.' :
                                                                    '🚨 Significant work needed. Focus on critical issues first.'}
                                                    </p>
                                                </div>
                                            );
                                        })()}
                                    </CardContent>
                                </Card>

                                {/* 🟡 PHASE 2: FIX & RE-CHECK LOOP */}
                                <Card className="mb-4 bg-gradient-to-r from-[#E6F7F6] to-[#CCEFED] border-[#00A9A0]/30">
                                    <CardContent className="pt-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-sm mb-1 text-gray-900">Made changes?</h3>
                                                <p className="text-xs text-gray-600">Re-run the analysis to see your updated progress</p>
                                            </div>
                                            <Button
                                                onClick={handleRecheck}
                                                disabled={isRechecking}
                                                className="ml-4 bg-[#00A9A0] hover:bg-[#008780] text-white"
                                            >
                                                {isRechecking ? (
                                                    <span className="flex items-center">
                                                        <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                                                        Re-checking...
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center">
                                                        <RefreshCw className="mr-2 h-4 w-4" />
                                                        Re-check Application
                                                    </span>
                                                )}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-t-4 border-t-[#00A9A0] animate-in fade-in zoom-in-95 duration-300">
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold text-gray-900">Analysis Results</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Status Badge */}
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-700 font-medium">Status:</span>
                                            <Badge className={`uppercase px-4 py-1.5 text-sm font-semibold ${getStatusColor(report.status)}`}>
                                                {report.status.replace('_', ' ')}
                                            </Badge>
                                        </div>

                                        {/* 🟡 PHASE 1: PRIORITY FIX LIST */}
                                        {report.issues.length > 0 && (
                                            <div className="space-y-4">
                                                {/* High Priority Issues */}
                                                {(() => {
                                                    const highIssues = report.issues.filter(i => i.severity === 'high');
                                                    if (highIssues.length === 0) return null;

                                                    return (
                                                        <div>
                                                            <Badge variant="destructive" className="mb-2">Must Fix Before Submission</Badge>
                                                            <div className="space-y-2">
                                                                {highIssues.map((issue, i) => (
                                                                    <div key={i}>
                                                                        <Alert variant="destructive">
                                                                            <AlertTriangle className="h-4 w-4" />
                                                                            <AlertDescription>{issue.description}</AlertDescription>
                                                                        </Alert>

                                                                        {/* 🟡 PHASE 2: WHY IS THIS REQUIRED? HELP TOGGLE */}
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => toggleHelp(i)}
                                                                            className="mt-1 h-7 text-xs text-muted-foreground"
                                                                        >
                                                                            {expandedHelp.has(i) ? '▼' : '▶'} Why is this required?
                                                                        </Button>
                                                                        {expandedHelp.has(i) && (
                                                                            <div className="mt-2 p-3 bg-muted/50 rounded-md border text-sm space-y-1">
                                                                                <div><strong>Department:</strong> {issue.department || 'General'}</div>
                                                                                <div><strong>Regulation:</strong> {issue.regulation_reference || 'N/A'}</div>
                                                                                <div className="pt-2 border-t">
                                                                                    <strong>Explanation:</strong> {getLanguageText(
                                                                                        `This requirement ensures compliance with safety and environmental standards.${issue.severity === 'high' ? ' This is a critical issue that must be resolved before approval.' : ''}`,
                                                                                        `This provision mandates adherence to statutory safety and environmental protocols as prescribed under applicable regulations.${issue.severity === 'high' ? ' This constitutes a critical deficiency requiring immediate remediation prior to application approval.' : ''}`
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    );
                                                })()}

                                                {/* Medium/Low Priority Issues */}
                                                {(() => {
                                                    const otherIssues = report.issues.filter(i => i.severity !== 'high');
                                                    if (otherIssues.length === 0) return null;

                                                    return (
                                                        <div>
                                                            <Badge variant="outline" className="mb-2">Recommended Fixes</Badge>
                                                            <div className="space-y-2">
                                                                {otherIssues.map((issue, i) => {
                                                                    const globalIdx = report.issues.filter(iss => iss.severity === 'high').length + i;
                                                                    return (
                                                                        <div key={i}>
                                                                            <div className={`p-3 rounded border-l-4 text-sm bg-muted/30 ${getRiskColor(issue.severity)}`}>
                                                                                <div className="flex justify-between items-center mb-1">
                                                                                    <Badge variant="outline" className={getRiskBadgeColor(issue.severity)}>{issue.severity.toUpperCase()}</Badge>
                                                                                    <span className="text-xs text-muted-foreground">{issue.department}</span>
                                                                                </div>
                                                                                <p className="font-medium mt-1">{issue.description}</p>
                                                                            </div>

                                                                            {/* 🟡 PHASE 2: WHY IS THIS REQUIRED? HELP TOGGLE */}
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() => toggleHelp(globalIdx)}
                                                                                className="mt-1 h-7 text-xs text-muted-foreground"
                                                                            >
                                                                                {expandedHelp.has(globalIdx) ? '▼' : '▶'} Why is this required?
                                                                            </Button>
                                                                            {expandedHelp.has(globalIdx) && (
                                                                                <div className="mt-2 p-3 bg-muted/50 rounded-md border text-sm space-y-1">
                                                                                    <div><strong>Department:</strong> {issue.department || 'General'}</div>
                                                                                    <div><strong>Regulation:</strong> {issue.regulation_reference || 'N/A'}</div>
                                                                                    <div className="pt-2 border-t">
                                                                                        <strong>Explanation:</strong> {getLanguageText(
                                                                                            `This requirement helps ensure your application meets all regulatory standards.${issue.severity === 'medium' ? ' While not critical, addressing this will improve your application.' : ''}`,
                                                                                            `This provision ensures conformity with established regulatory frameworks and administrative standards.${issue.severity === 'medium' ? ' While not classified as critical, resolution of this matter is recommended to strengthen the application.' : ''}`
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        )}

                                        {/* 🟡 PHASE 1: LIVE DOCUMENT CHECKLIST */}
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-base">Document Checklist</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                {['Fire Safety Certificate', 'Environmental Clearance', 'Building Plan Approval', 'Waste Management Plan', 'Water Source Authorization'].map(doc => {
                                                    const isMissing = report.missing_documents.includes(doc);
                                                    const isFlagged = report.issues.some(i => i.description.toLowerCase().includes(doc.toLowerCase()));

                                                    let status, Icon, color;
                                                    if (isMissing) {
                                                        status = 'MISSING';
                                                        Icon = AlertTriangle;
                                                        color = 'text-destructive';
                                                    } else if (isFlagged) {
                                                        status = 'INCOMPLETE';
                                                        Icon = AlertTriangle;
                                                        color = 'text-warning';
                                                    } else {
                                                        status = 'SUBMITTED';
                                                        Icon = CheckCircle;
                                                        color = 'text-green-600';
                                                    }

                                                    return (
                                                        <div key={doc} className="flex items-center gap-2 p-2 border-b last:border-0">
                                                            <Icon className={`w-4 h-4 ${color}`} />
                                                            <span className="flex-1 text-sm">{doc}</span>
                                                            <Badge variant={status === 'SUBMITTED' ? 'default' : 'destructive'} className="text-xs">
                                                                {status}
                                                            </Badge>
                                                        </div>
                                                    );
                                                })}
                                            </CardContent>
                                        </Card>

                                        {/* SUBMISSION AREA */}
                                        <div className="pt-4 border-t border-gray-200">
                                            <h3 className="text-sm font-bold mb-2 text-gray-900">Final Submission</h3>

                                            {report.status !== 'compliant' && (
                                                <div className="mb-4">
                                                    <Label className="mb-2 block text-sm font-medium text-gray-700">Mitigation Plan / Reason (Required for partial compliance) *</Label>
                                                    <Textarea
                                                        placeholder="Explain your plan to address issues..."
                                                        value={submissionReason}
                                                        onChange={(e) => setSubmissionReason(e.target.value)}
                                                        className="border-gray-300 focus:border-[#00A9A0] focus:ring-[#00A9A0]"
                                                    />
                                                </div>
                                            )}

                                            <Button
                                                onClick={handleApplicationSubmit}
                                                disabled={submitting}
                                                className={`w-full font-semibold ${report.status === 'compliant' ? 'bg-[#00A9A0] hover:bg-[#008780]' : 'bg-gray-500 hover:bg-gray-600'} text-white`}
                                                size="lg"
                                            >
                                                {submitting ? 'Submitting...' : <span className="flex items-center justify-center"><Send className="mr-2 h-5 w-5" /> Final Submission</span>}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
