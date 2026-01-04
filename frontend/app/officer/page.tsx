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

    if (loading) return <div className="p-8 text-center text-muted-foreground">Loading Dashboard...</div>;

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <Header showNav={true} activeTab="officer" />

            <main className="max-w-7xl mx-auto px-4 py-8">
                {viewMode === 'list' && (
                    <>
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold tracking-tight mb-2">
                                Officer/Reviewer Dashboard
                            </h1>
                            <p className="text-muted-foreground">Review and process industrial applications.</p>
                        </div>

                        <Card>
                            <CardContent className="p-0">
                                <div className="rounded-md border">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-muted/50 border-b">
                                            <tr>
                                                <th className="p-4 font-medium text-muted-foreground uppercase">Application ID</th>
                                                <th className="p-4 font-medium text-muted-foreground uppercase">Applicant</th>
                                                <th className="p-4 font-medium text-muted-foreground uppercase">Status</th>
                                                <th className="p-4 font-medium text-muted-foreground uppercase">AI Confidence</th>
                                                <th className="p-4 font-medium text-muted-foreground uppercase">Time Saved</th>
                                                <th className="p-4 font-medium text-muted-foreground uppercase">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {applications.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className="p-8 text-center text-muted-foreground">No applications found.</td>
                                                </tr>
                                            ) : (
                                                applications.map((app) => (
                                                    <tr key={app.id} className="hover:bg-muted/50 transition-colors">
                                                        <td className="p-4 font-mono text-xs">{app.id.slice(0, 8)}...</td>
                                                        <td className="p-4 font-medium">{app.application_data.industry_name}</td>
                                                        <td className="p-4">
                                                            <Badge variant="outline" className={`${getStatusColor(app.status)}`}>
                                                                {app.status.replace('_', ' ').toUpperCase()}
                                                            </Badge>
                                                        </td>
                                                        <td className="p-4">
                                                            {formatConfidence(app.compliance_report.confidence_score)}
                                                        </td>
                                                        <td className="p-4 font-medium text-green-600 dark:text-green-400">
                                                            {Math.round(app.time_saved_seconds / 60)} mins
                                                        </td>
                                                        <td className="p-4">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleViewApp(app)}
                                                                className="text-primary hover:text-primary"
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
                        <Button variant="ghost" onClick={handleBack} className="mb-4 pl-0 hover:bg-transparent hover:text-primary">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                        </Button>

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
                                        <div>
                                            <h4 className="text-sm font-semibold tracking-wide mb-3 flex items-center">
                                                <ShieldAlert className="w-4 h-4 mr-2" /> Compliance Issues
                                            </h4>
                                            {selectedApp.compliance_report.issues.length > 0 ? (
                                                <div className="space-y-3">
                                                    {selectedApp.compliance_report.issues.map((issue, idx) => (
                                                        <Alert key={idx} variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive-foreground">
                                                            <AlertTriangle className="h-4 w-4" />
                                                            <AlertTitle className="text-sm font-bold flex items-center gap-2">
                                                                {issue.severity.toUpperCase()} <span className="font-normal opacity-80">- {issue.issue_type}</span>
                                                            </AlertTitle>
                                                            <AlertDescription>
                                                                {issue.description}
                                                            </AlertDescription>
                                                        </Alert>
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

                                {/* Action Bar */}
                                <Card className="sticky bottom-0 shadow-lg border-t-2">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg">Officer Action</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {selectedApp.status === 'submitted' || selectedApp.status === 'under_review' ? (
                                            <div className="flex gap-4">
                                                <Button
                                                    onClick={() => handleAction('approve')}
                                                    disabled={processing}
                                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                                    size="lg"
                                                >
                                                    {processing ? 'Processing...' : <span className="flex items-center"><CheckCircle className="mr-2 h-4 w-4" /> Approve Application</span>}
                                                </Button>
                                                <Button
                                                    onClick={() => handleAction('reject')}
                                                    disabled={processing}
                                                    variant="destructive"
                                                    className="flex-1"
                                                    size="lg"
                                                >
                                                    {processing ? 'Processing...' : <span className="flex items-center"><XCircle className="mr-2 h-4 w-4" /> Reject / Send Back</span>}
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="text-center p-3 bg-muted rounded-lg text-muted-foreground font-medium">
                                                Application is currently <span className="font-bold uppercase text-foreground">{selectedApp.status.replace('_', ' ')}</span>
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
