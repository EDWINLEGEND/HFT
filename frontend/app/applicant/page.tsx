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
import { ArrowRight, CheckCircle, AlertTriangle, FileText, Upload, Sparkles, Send, Search } from "lucide-react";

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

    const currentAppType = APP_TYPES.find(t => t.id === appType);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header currentRole="applicant" />

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Steps Indicator */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <Badge variant={!extracted ? "default" : "secondary"} className="px-3 py-1">1. Upload Application</Badge>
                        <ArrowRight className="w-4 h-4" />
                        <Badge variant={extracted && !report ? "default" : (report ? "secondary" : "outline")} className="px-3 py-1">2. Review & Analyze</Badge>
                        <ArrowRight className="w-4 h-4" />
                        <Badge variant={report ? "default" : "outline"} className="px-3 py-1 text-white">3. Submit</Badge>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">

                    {/* LEFT COLUMN: UPLOAD & FORM */}
                    <div className="space-y-6">
                        {/* 1. App Type Selector */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Select Application Type</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Select value={appType} onValueChange={setAppType}>
                                    <SelectTrigger className="w-full">
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
                        <Card className="border-blue-100 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20">
                            <CardHeader>
                                <CardTitle className="flex items-center text-blue-900 dark:text-blue-200">
                                    <Sparkles className="w-5 h-5 mr-2" /> Auto-Fill from Document
                                </CardTitle>
                                <CardDescription>
                                    Upload your project proposal (PDF/Text) to automatically fill the application details below.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FileUploader
                                    label="Project Proposal / Application Letter"
                                    onFileSelect={handleExtractionUpload}
                                    disabled={extracting}
                                />
                                {extracting && <p className="text-blue-600 text-sm mt-2 flex items-center animate-pulse"><Sparkles className="w-4 h-4 mr-1" /> Running AI Extraction...</p>}
                                {extracted && <p className="text-green-600 text-sm mt-2 font-semibold flex items-center"><CheckCircle className="w-4 h-4 mr-1" /> Data Extracted Successfully!</p>}
                            </CardContent>
                        </Card>

                        {/* 3. The Form (Auto-filled but editable) */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Application Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmitAnalysis} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="industry_name">Industry Name</Label>
                                            <Input id="industry_name" name="industry_name" value={formData.industry_name} onChange={handleChange} required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="square_feet">Square Feet</Label>
                                            <Input id="square_feet" name="square_feet" value={formData.square_feet} onChange={handleChange} required />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="water_source">Water Source</Label>
                                            <Input id="water_source" name="water_source" value={formData.water_source} onChange={handleChange} required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="drainage">Drainage</Label>
                                            <Input id="drainage" name="drainage" value={formData.drainage} onChange={handleChange} required />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="air_pollution">Air Pollution Control</Label>
                                        <Textarea id="air_pollution" name="air_pollution" value={formData.air_pollution} onChange={handleChange} required rows={2} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="waste_management">Waste Management</Label>
                                        <Textarea id="waste_management" name="waste_management" value={formData.waste_management} onChange={handleChange} required rows={2} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="nearby_homes">Nearest Homes</Label>
                                            <Input id="nearby_homes" name="nearby_homes" value={formData.nearby_homes} onChange={handleChange} required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="water_level_depth">Water Level</Label>
                                            <Input id="water_level_depth" name="water_level_depth" value={formData.water_level_depth} onChange={handleChange} required />
                                        </div>
                                    </div>

                                    <Button type="submit" className="w-full" disabled={loading}>
                                        {loading ? <span className="flex items-center"><Sparkles className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</span> : <span className="flex items-center"><Search className="mr-2 h-4 w-4" /> Analyze Compliance</span>}
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
                            <Card className="border-t-4 border-t-primary animate-in fade-in zoom-in-95 duration-300">
                                <CardHeader>
                                    <CardTitle>Analysis Results</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Status Badge */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground font-medium">Status:</span>
                                        <Badge className={`uppercase ${getStatusColor(report.status)}`}>
                                            {report.status.replace('_', ' ')}
                                        </Badge>
                                    </div>

                                    {/* Missing Docs Alert */}
                                    {report.missing_documents.length > 0 && (
                                        <Alert variant="destructive">
                                            <AlertTriangle className="h-4 w-4" />
                                            <AlertTitle>Missing Documents detected by AI</AlertTitle>
                                            <AlertDescription>
                                                <ul className="list-disc pl-5 mt-1">
                                                    {report.missing_documents.map((d, i) => <li key={i}>{d}</li>)}
                                                </ul>
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    {/* Issues List */}
                                    <div className="space-y-3">
                                        {report.issues.map((issue, i) => (
                                            <div key={i} className={`p-3 rounded border-l-4 text-sm bg-muted/30 ${getRiskColor(issue.severity)}`}>
                                                <div className="flex justify-between items-center mb-1">
                                                    <Badge variant="outline" className={getRiskBadgeColor(issue.severity)}>{issue.severity.toUpperCase()}</Badge>
                                                    <span className="text-xs text-muted-foreground">{issue.department}</span>
                                                </div>
                                                <p className="font-medium mt-1">{issue.description}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* SUBMISSION AREA */}
                                    <div className="pt-4 border-t">
                                        <h3 className="text-sm font-bold mb-2">Final Submission</h3>

                                        {report.status !== 'compliant' && (
                                            <div className="mb-4">
                                                <Label className="mb-2 block">Mitigation Plan / Reason (Required for partial compliance) *</Label>
                                                <Textarea
                                                    placeholder="Explain your plan to address issues..."
                                                    value={submissionReason}
                                                    onChange={(e) => setSubmissionReason(e.target.value)}
                                                />
                                            </div>
                                        )}

                                        <Button
                                            onClick={handleApplicationSubmit}
                                            disabled={submitting}
                                            className="w-full"
                                            variant={report.status === 'compliant' ? 'default' : 'secondary'}
                                        >
                                            {submitting ? 'Submitting...' : <span className="flex items-center">📤 Final Submission</span>}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
