'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { CivicAssistAPI, getStatusColor, formatConfidence } from '@/lib/api';
import type { SavedApplication } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, ExternalLink, Clock, FileText, CheckCircle, XCircle, AlertTriangle, ArrowRight, ShieldAlert } from "lucide-react";

export default function OfficerPage() {
    const [applications, setApplications] = useState<SavedApplication[]>([]);
    const [selectedApp, setSelectedApp] = useState<SavedApplication | null>(null);
    const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    // Review State
    const [rejectionReason, setRejectionReason] = useState('');
    const [replyNote, setReplyNote] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);

    // Phase 1 Feature State
    const [sortBy, setSortBy] = useState<'severity' | 'type' | 'department'>('severity');
    const [filterDept, setFilterDept] = useState<string | null>(null);
    const [groupByDept, setGroupByDept] = useState(false);
    const [officerNotes, setOfficerNotes] = useState('');
    const [expandedIssues, setExpandedIssues] = useState<Set<number>>(new Set());

    // Phase 2: Accept/Override Tracking
    interface IssueOverride {
        accepted: boolean | null;
        reason?: string;
    }
    const [issueOverrides, setIssueOverrides] = useState<Record<number, IssueOverride>>({});

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        try {
            const data = await CivicAssistAPI.getApplications();
            setApplications(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewApp = (app: SavedApplication) => {
        setSelectedApp(app);
        setViewMode('detail');
    };

    const handleBack = () => {
        setSelectedApp(null);
        setViewMode('list');
        loadApplications(); // Refresh list
    };

    const handleAction = async (action: 'approve' | 'reject' | 'manual_review') => {
        if (!selectedApp) return;

        if (action === 'reject' && !showRejectModal) {
            setShowRejectModal(true);
            return;
        }

        setProcessing(true);
        try {
            await CivicAssistAPI.reviewApplication(selectedApp.id, action, replyNote, rejectionReason);
            setShowRejectModal(false);
            handleBack(); // Return to list on success
        } catch (err) {
            alert('Action failed');
            console.error(err);
        } finally {
            setProcessing(false);
        }
    };

    // Helper to get PDF URL
    const getPdfUrl = (url?: string) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        return `${baseUrl}${url}`;
    };

    // Phase 1 Helper Functions
    const getHighRiskCount = (app: SavedApplication) => {
        return app.compliance_report.issues.filter(i => i.severity === 'high').length;
    };

    const getBlockingIssues = (app: SavedApplication) => {
        return app.compliance_report.issues.filter(
            i => i.severity === 'high' && i.issue_type === 'violation'
        );
    };

    const isBlockingApproval = (app: SavedApplication) => {
        return getBlockingIssues(app).length > 0 || app.compliance_report.status === 'non_compliant';
    };

    const getDepartments = (app: SavedApplication) => {
        const depts = new Set(app.compliance_report.issues.map(i => i.department || 'Other'));
        return Array.from(depts);
    };

    const filterAndSortIssues = (app: SavedApplication) => {
        let filtered = app.compliance_report.issues;

        // Filter by department
        if (filterDept) {
            filtered = filtered.filter(i => (i.department || 'Other') === filterDept);
        }

        // Sort
        const sorted = [...filtered].sort((a, b) => {
            if (sortBy === 'severity') {
                const severityOrder = { high: 0, medium: 1, low: 2 };
                return severityOrder[a.severity] - severityOrder[b.severity];
            } else if (sortBy === 'type') {
                return a.issue_type.localeCompare(b.issue_type);
            } else {
                return (a.department || 'Other').localeCompare(b.department || 'Other');
            }
        });

        return sorted;
    };

    const groupIssuesByDepartment = (app: SavedApplication) => {
        const filtered = filterAndSortIssues(app);
        if (!groupByDept) return { 'All Issues': filtered };

        return filtered.reduce((acc, issue) => {
            const dept = issue.department || 'Other';
            if (!acc[dept]) acc[dept] = [];
            acc[dept].push(issue);
            return acc;
        }, {} as Record<string, typeof filtered>);
    };

    const toggleIssueExpand = (index: number) => {
        const newExpanded = new Set(expandedIssues);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedIssues(newExpanded);
    };

    // Phase 2: Override Management Functions
    const handleAcceptIssue = (issueIdx: number) => {
        setIssueOverrides(prev => ({
            ...prev,
            [issueIdx]: { accepted: true, reason: undefined }
        }));
    };

    const handleOverrideIssue = (issueIdx: number) => {
        setIssueOverrides(prev => ({
            ...prev,
            [issueIdx]: { accepted: false, reason: prev[issueIdx]?.reason || '' }
        }));
    };

    const updateOverrideReason = (issueIdx: number, reason: string) => {
        setIssueOverrides(prev => ({
            ...prev,
            [issueIdx]: { ...prev[issueIdx], reason }
        }));
    };

    const getOverrideSummary = () => {
        if (!selectedApp) return { total: 0, accepted: 0, overridden: 0, pending: 0 };
        const total = selectedApp.compliance_report.issues.length;
        const accepted = Object.values(issueOverrides).filter(o => o.accepted === true).length;
        const overridden = Object.values(issueOverrides).filter(o => o.accepted === false).length;
        const pending = total - accepted - overridden;
        return { total, accepted, overridden, pending };
    };

    // Phase 3: Download PDF Report
    const handleDownloadReport = async () => {
        if (!selectedApp) return;

        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const response = await fetch(`${baseUrl}/api/v1/applications/${selectedApp.id}/report`);

            if (!response.ok) throw new Error('Download failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `application_${selectedApp.id}_report.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Report download failed:', error);
            alert('Failed to download report. Please try again.');
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500 font-medium">Loading Dashboard...</div>;

    return (
        <div className="min-h-screen bg-gray-50 text-foreground">
            <Header showNav={true} activeTab="officer" />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {viewMode === 'list' && (
                    <>
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold tracking-tight mb-2 text-gray-900">
                                Officer/Reviewer Dashboard
                            </h1>
                            <p className="text-gray-600">Review and process industrial applications.</p>
                        </div>

                        <Card>
                            <CardContent className="p-0">
                                <div className="rounded-lg border border-gray-200 overflow-hidden">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-100 border-b border-gray-200">
                                            <tr>
                                                <th className="p-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">Application ID</th>
                                                <th className="p-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">Applicant</th>
                                                <th className="p-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">Status</th>
                                                <th className="p-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">AI Confidence</th>
                                                <th className="p-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">Time Saved</th>
                                                <th className="p-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {applications.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className="p-8 text-center text-gray-500">No applications found.</td>
                                                </tr>
                                            ) : (
                                                applications.map((app) => (
                                                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="p-4 font-mono text-xs text-gray-600">{app.id.slice(0, 8)}...</td>
                                                        <td className="p-4 font-medium text-gray-900">{app.application_data.industry_name}</td>
                                                        <td className="p-4">
                                                            <Badge variant="outline" className={`${getStatusColor(app.status)}`}>
                                                                {app.status.replace('_', ' ').toUpperCase()}
                                                            </Badge>
                                                        </td>
                                                        <td className="p-4 text-gray-700">
                                                            {formatConfidence(app.compliance_report.confidence_score)}
                                                        </td>
                                                        <td className="p-4 font-semibold text-[#00A9A0]">
                                                            {Math.round(app.time_saved_seconds / 60)} mins
                                                        </td>
                                                        <td className="p-4">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleViewApp(app)}
                                                                className="text-[#00A9A0] hover:text-[#008780] hover:bg-[#E6F7F6]"
                                                            >
                                                                Review <ArrowRight className="ml-1 w-4 h-4" />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </>
                )}

                {viewMode === 'detail' && selectedApp && (
                    <div className="animate-in slide-in-from-right-10 duration-500">
                        <Button variant="ghost" onClick={handleBack} className="mb-4 pl-0 hover:bg-transparent text-[#00A9A0] hover:text-[#008780]">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                        </Button>

                        {/* 🔴 PHASE 1: AT-A-GLANCE FILE HEALTH SUMMARY */}
                        <Card className="mb-6 border-2 border-[#00A9A0]/20 shadow-lg sticky top-20 z-10 bg-white backdrop-blur">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Badge variant="outline" className={`text-lg px-3 py-1 font-semibold ${getStatusColor(selectedApp.compliance_report.status)}`}>
                                                {selectedApp.compliance_report.status.replace('_', ' ').toUpperCase()}
                                            </Badge>
                                            <Badge variant="secondary" className="flex items-center gap-1 bg-gray-100 text-gray-700">
                                                <Clock className="w-3 h-3" />
                                                {formatConfidence(selectedApp.compliance_report.confidence_score)} Confidence
                                            </Badge>
                                        </div>
                                        <div className="flex gap-2 flex-wrap">
                                            {getHighRiskCount(selectedApp) > 0 && (
                                                <Badge variant="destructive" className="font-bold">
                                                    {getHighRiskCount(selectedApp)} HIGH-RISK ISSUE{getHighRiskCount(selectedApp) > 1 ? 'S' : ''}
                                                </Badge>
                                            )}
                                            {getOverrideSummary().overridden > 0 && (
                                                <Badge variant="outline" className="border-orange-500 text-orange-700 font-bold">
                                                    {getOverrideSummary().overridden} Override{getOverrideSummary().overridden > 1 ? 's' : ''}
                                                </Badge>
                                            )}
                                            {getDepartments(selectedApp).map(dept => (
                                                <Badge key={dept} variant="outline" className="text-xs">
                                                    {dept}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        {isBlockingApproval(selectedApp) ? (
                                            <Alert variant="destructive" className="py-2 px-3">
                                                <AlertTriangle className="h-4 w-4" />
                                                <AlertTitle className="text-sm font-bold mb-0">BLOCKING APPROVAL</AlertTitle>
                                            </Alert>
                                        ) : (
                                            <Alert className="py-2 px-3 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                                                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                <AlertTitle className="text-sm font-bold mb-0 text-green-800 dark:text-green-300">No Blockers</AlertTitle>
                                            </Alert>
                                        )}
                                        {selectedApp.compliance_report.confidence_score < 0.6 && (
                                            <Alert variant="destructive" className="mt-2 py-2 px-3">
                                                <AlertTriangle className="h-4 w-4" />
                                                <AlertDescription className="text-xs">Manual review strongly recommended</AlertDescription>
                                            </Alert>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[85vh]">
                            {/* Left: Document Viewer */}
                            <Card className="flex flex-col h-full overflow-hidden">
                                <CardHeader className="py-3 px-4 bg-muted/50 border-b flex flex-row justify-between items-center space-y-0">
                                    <h3 className="font-semibold flex items-center"><FileText className="mr-2 h-4 w-4" /> Application Document</h3>
                                    <a
                                        href={getPdfUrl(selectedApp.application_data.document_url) || '#'}
                                        target="_blank"
                                        className="text-xs text-primary hover:underline flex items-center"
                                    >
                                        Open in New Tab <ExternalLink className="ml-1 h-3 w-3" />
                                    </a>
                                </CardHeader>
                                <div className="flex-1 bg-muted/20 relative">
                                    {selectedApp.application_data.document_url ? (
                                        <iframe
                                            src={getPdfUrl(selectedApp.application_data.document_url)!}
                                            className="w-full h-full"
                                            title="Document Viewer"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-muted-foreground">
                                            No document attached
                                        </div>
                                    )}
                                </div>
                            </Card>

                            {/* Right: Review Panel */}
                            <div className="flex flex-col h-full gap-6">
                                {/* AI Analysis Summary */}
                                <Card className="flex-1 overflow-y-auto">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle>{selectedApp.application_data.industry_name}</CardTitle>
                                                <CardDescription>Submitted: {new Date(selectedApp.submitted_at).toLocaleDateString()}</CardDescription>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <Badge variant="secondary" className="flex items-center">
                                                    <Clock className="w-3 h-3 mr-1" /> {Math.round(selectedApp.time_saved_seconds / 60)} mins saved
                                                </Badge>
                                                <Badge variant="outline" className={getStatusColor(selectedApp.compliance_report.status)}>
                                                    AI Status: {selectedApp.compliance_report.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* 🔴 PHASE 1: ISSUE FILTERING & SORTING */}
                                        <div>
                                            <div className="flex justify-between items-center mb-3">
                                                <h4 className="text-sm font-semibold tracking-wide flex items-center">
                                                    <ShieldAlert className="w-4 h-4 mr-2" /> Compliance Issues
                                                </h4>
                                                <div className="flex gap-2">
                                                    <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                                                        <SelectTrigger className="w-32 h-8 text-xs">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="severity">Sort: Risk</SelectItem>
                                                            <SelectItem value="type">Sort: Type</SelectItem>
                                                            <SelectItem value="department">Sort: Dept</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <Button
                                                        variant={groupByDept ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => setGroupByDept(!groupByDept)}
                                                        className="h-8 text-xs"
                                                    >
                                                        Group by Dept
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Department Filter Chips */}
                                            <div className="flex gap-2 mb-3 flex-wrap">
                                                <Button
                                                    variant={filterDept === null ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => setFilterDept(null)}
                                                    className="h-7 text-xs"
                                                >
                                                    All
                                                </Button>
                                                {getDepartments(selectedApp).map(dept => (
                                                    <Button
                                                        key={dept}
                                                        variant={filterDept === dept ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => setFilterDept(dept)}
                                                        className="h-7 text-xs"
                                                    >
                                                        {dept}
                                                    </Button>
                                                ))}
                                            </div>

                                            {/* 🔴 PHASE 1: DEPARTMENT-WISE BUCKETING & INLINE EXPLAINABILITY */}
                                            {selectedApp.compliance_report.issues.length > 0 ? (
                                                <div className="space-y-4">
                                                    {Object.entries(groupIssuesByDepartment(selectedApp)).map(([deptName, deptIssues]) => (
                                                        <div key={deptName}>
                                                            {groupByDept && (
                                                                <h5 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                                                    <Badge variant="outline">{deptName}</Badge>
                                                                    <span className="text-xs text-muted-foreground">({deptIssues.length} issue{deptIssues.length > 1 ? 's' : ''})</span>
                                                                </h5>
                                                            )}
                                                            <div className="space-y-3">
                                                                {deptIssues.map((issue, idx) => {
                                                                    const globalIdx = selectedApp.compliance_report.issues.indexOf(issue);
                                                                    return (
                                                                        <div key={globalIdx}>
                                                                            <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive-foreground">
                                                                                <AlertTriangle className="h-4 w-4" />
                                                                                <AlertTitle className="text-sm font-bold flex items-center gap-2">
                                                                                    {issue.severity.toUpperCase()} <span className="font-normal opacity-80">- {issue.issue_type}</span>
                                                                                </AlertTitle>
                                                                                <AlertDescription>
                                                                                    {issue.description}
                                                                                </AlertDescription>
                                                                            </Alert>

                                                                            {/* 🔴 PHASE 1: INLINE EXPLAINABILITY */}
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() => toggleIssueExpand(globalIdx)}
                                                                                className="mt-1 h-7 text-xs text-muted-foreground"
                                                                            >
                                                                                {expandedIssues.has(globalIdx) ? '▼' : '▶'} Why was this flagged?
                                                                            </Button>
                                                                            {expandedIssues.has(globalIdx) && (
                                                                                <div className="mt-2 p-3 bg-muted/50 rounded-md border text-sm space-y-1">
                                                                                    <div><strong>Regulation:</strong> {issue.regulation_reference || 'N/A'}</div>
                                                                                    <div><strong>Department:</strong> {issue.department || 'Other'}</div>
                                                                                    <div><strong>Type:</strong> {issue.issue_type}</div>
                                                                                    <div className="pt-2 border-t"><strong>AI Reasoning:</strong> {issue.description}</div>
                                                                                </div>
                                                                            )}

                                                                            {/* 🟡 PHASE 2: ACCEPT/OVERRIDE INDICATORS */}
                                                                            <div className="mt-3 p-3 bg-muted/20 rounded-md border">
                                                                                <Label className="text-xs font-semibold mb-2 block">Officer Decision</Label>
                                                                                <div className="flex gap-2">
                                                                                    <Button
                                                                                        variant={issueOverrides[globalIdx]?.accepted === true ? 'default' : 'outline'}
                                                                                        size="sm"
                                                                                        onClick={() => handleAcceptIssue(globalIdx)}
                                                                                        className="flex items-center gap-1"
                                                                                    >
                                                                                        <CheckCircle className="w-3 h-3" />
                                                                                        Accept AI Finding
                                                                                    </Button>
                                                                                    <Button
                                                                                        variant={issueOverrides[globalIdx]?.accepted === false ? 'destructive' : 'outline'}
                                                                                        size="sm"
                                                                                        onClick={() => handleOverrideIssue(globalIdx)}
                                                                                        className="flex items-center gap-1"
                                                                                    >
                                                                                        <XCircle className="w-3 h-3" />
                                                                                        Override
                                                                                    </Button>
                                                                                </div>
                                                                                {issueOverrides[globalIdx]?.accepted === false && (
                                                                                    <div className="mt-2">
                                                                                        <Label className="text-xs">Reason for Override *</Label>
                                                                                        <Input
                                                                                            placeholder="e.g., Regulation updated Dec 2024, special exemption granted..."
                                                                                            value={issueOverrides[globalIdx]?.reason || ''}
                                                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateOverrideReason(globalIdx, e.target.value)}
                                                                                            className="text-sm mt-1"
                                                                                        />
                                                                                        <p className="text-xs text-muted-foreground mt-1">
                                                                                            💡 This creates an audit trail for your decision
                                                                                        </p>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <Alert className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800">
                                                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                    <AlertTitle>Clean Report</AlertTitle>
                                                    <AlertDescription>No major compliance issues detected by AI.</AlertDescription>
                                                </Alert>
                                            )}
                                        </div>

                                        {/* 🔴 PHASE 1: LIVE DOCUMENT CHECKLIST */}
                                        <div>
                                            <h4 className="text-sm font-semibold tracking-wide mb-3 flex items-center">
                                                <FileText className="w-4 h-4 mr-2" /> Document Checklist
                                            </h4>
                                            <div className="space-y-2">
                                                {selectedApp.compliance_report.missing_documents.length > 0 ? (
                                                    selectedApp.compliance_report.missing_documents.map((doc, idx) => (
                                                        <div key={idx} className="flex items-center gap-2 p-2 bg-muted/30 rounded border">
                                                            <XCircle className="w-4 h-4 text-destructive" />
                                                            <span className="text-sm">{doc}</span>
                                                            <Badge variant="destructive" className="ml-auto text-xs">Missing</Badge>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                                                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                                                        <span className="text-sm text-green-800 dark:text-green-300">All required documents submitted</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-semibold tracking-wide mb-3">Extracted Data</h4>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div className="p-3 bg-muted/50 rounded-md border">
                                                    <span className="text-muted-foreground block text-xs mb-1">Water Source</span>
                                                    <span className="font-medium">{selectedApp.application_data.water_source}</span>
                                                </div>
                                                <div className="p-3 bg-muted/50 rounded-md border">
                                                    <span className="text-muted-foreground block text-xs mb-1">Waste Management</span>
                                                    <span className="font-medium">{selectedApp.application_data.waste_management}</span>
                                                </div>
                                                <div className="p-3 bg-muted/50 rounded-md border">
                                                    <span className="text-muted-foreground block text-xs mb-1">Location</span>
                                                    <span className="font-medium">{selectedApp.application_data.nearby_homes}</span>
                                                </div>
                                                <div className="p-3 bg-muted/50 rounded-md border">
                                                    <span className="text-muted-foreground block text-xs mb-1">Area</span>
                                                    <span className="font-medium">{selectedApp.application_data.square_feet}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* 🔴 PHASE 1: OFFICER NOTES & REMARKS (PRIVATE) */}
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <FileText className="w-4 h-4" /> Private Officer Notes
                                        </CardTitle>
                                        <CardDescription className="text-xs">
                                            These notes are private and not visible to the applicant
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Textarea
                                            value={officerNotes}
                                            onChange={(e) => setOfficerNotes(e.target.value)}
                                            placeholder="Record your observations, concerns, or judgment calls..."
                                            className="min-h-[80px] text-sm"
                                        />
                                        <p className="text-xs text-muted-foreground mt-2">
                                            💡 Use this for accountability and audit trails
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* Action Bar */}
                                <Card className="sticky bottom-0 shadow-lg border-t-2 border-t-[#00A9A0]">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg text-gray-900">Officer Action</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {selectedApp.status === 'submitted' || selectedApp.status === 'under_review' ? (
                                            <>
                                                {/* 🟡 PHASE 3: DOWNLOAD PDF REPORT */}
                                                <Button
                                                    variant="outline"
                                                    onClick={handleDownloadReport}
                                                    className="w-full mb-3 flex items-center justify-center gap-2 border-gray-300 hover:border-[#00A9A0] hover:bg-[#E6F7F6]"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                    Download PDF Report
                                                </Button>

                                                <div className="flex gap-4">
                                                    <Button
                                                        onClick={() => handleAction('approve')}
                                                        disabled={processing}
                                                        className="flex-1 bg-[#00A9A0] hover:bg-[#008780] text-white font-semibold shadow-md hover:shadow-lg"
                                                        size="lg"
                                                    >
                                                        {processing ? 'Processing...' : <span className="flex items-center"><CheckCircle className="mr-2 h-4 w-4" /> Approve Application</span>}
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleAction('reject')}
                                                        disabled={processing}
                                                        variant="destructive"
                                                        className="flex-1 font-semibold shadow-md hover:shadow-lg"
                                                        size="lg"
                                                    >
                                                        {processing ? 'Processing...' : <span className="flex items-center"><XCircle className="mr-2 h-4 w-4" /> Reject / Send Back</span>}
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center p-3 bg-gray-100 rounded-lg text-gray-700 font-medium">
                                                Application is currently <span className="font-bold uppercase text-gray-900">{selectedApp.status.replace('_', ' ')}</span>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                )}

                {/* Rejection Modal */}
                {showRejectModal && (
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                        <Card className="w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
                            <CardHeader>
                                <CardTitle className="text-destructive flex items-center">
                                    <AlertTriangle className="mr-2 h-5 w-5" /> Reject Application
                                </CardTitle>
                                <CardDescription>
                                    Please provide a reason and feedback for the applicant.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Reason for Rejection</Label>
                                    <Select
                                        value={rejectionReason}
                                        onValueChange={setRejectionReason}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a reason..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Incomplete Documents">Incomplete Documents</SelectItem>
                                            <SelectItem value="Zoning Violation">Zoning Violation</SelectItem>
                                            <SelectItem value="Pollution Norms Violation">Pollution Norms Violation</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Reply to Applicant</Label>
                                    <Textarea
                                        className="h-32"
                                        placeholder="Please explain what needs to be corrected..."
                                        value={replyNote}
                                        onChange={(e) => setReplyNote(e.target.value)}
                                    />
                                </div>
                            </CardContent>
                            <div className="p-6 pt-0 flex justify-end gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowRejectModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => handleAction('reject')}
                                    disabled={!rejectionReason || !replyNote}
                                >
                                    Send Rejection
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}
            </main>
        </div>
    );
}
