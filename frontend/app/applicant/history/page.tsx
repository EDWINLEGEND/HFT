'use client';

import { useState, useEffect } from 'react';
import { CivicAssistAPI, getStatusColor, formatConfidence } from '@/lib/api';
import type { SavedApplication } from '@/lib/types';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from 'next/navigation';
import {
    Trash2,
    ExternalLink,
    Clock,
    FileText,
    History,
    AlertTriangle,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    LayoutGrid,
    Info
} from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


export default function HistoryPage() {
    const [applications, setApplications] = useState<SavedApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        try {
            const data = await CivicAssistAPI.getApplications();
            // Sort by Date Descending
            const sorted = data.sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());
            setApplications(sorted);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await CivicAssistAPI.deleteApplication(id);
            setApplications(prev => prev.filter(a => a.id !== id));
        } catch (err) {
            console.error('Failed to delete application', err);
        }
    };

    const handleClearAll = async () => {
        try {
            await Promise.all(applications.map(app => CivicAssistAPI.deleteApplication(app.id)));
            // Even if some fail, we assume intent was to clear all local view or we could re-fetch
            const remaining = await CivicAssistAPI.getApplications();
            setApplications(remaining);
            if (remaining.length === 0) {
                // Success feedback could go here
            }
        } catch (err) {
            console.error('Failed to clear all applications', err);
            // Fallback: re-fetch to show what's left
            loadApplications();
        }
    };

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    if (loading) return (
        <div className="flex h-full items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto p-8 animate-in fade-in duration-500 pb-24">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#171915] flex items-center gap-3">
                        <History className="w-8 h-8 text-[#505645]" />
                        Past <span className="font-serif italic">Applications</span>
                    </h1>
                    <p className="text-[#858A77] mt-1 text-lg">
                        Manage and review your saved drafts and submitted applications.
                    </p>
                </div>

                {applications.length > 0 && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300">
                                <Trash2 className="w-4 h-4 mr-2" /> Clear All History
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className='bg-white'>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete All Applications?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your entire application history.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleClearAll} className="bg-red-600 hover:bg-red-700 text-white">
                                    Delete All
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>

            {applications.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-[#D0D1C9]">
                    <div className="w-16 h-16 bg-[#F4F5F4] rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-[#858A77]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#171915] mb-2">No Past Applications</h3>
                    <p className="text-[#858A77] mb-6">Start a new application to see it here.</p>
                    <Button onClick={() => router.push('/applicant')} className="bg-[#505645] text-white hover:bg-[#404537] rounded-full">
                        Create New Application
                    </Button>
                </div>
            ) : (<div className="space-y-5">
                {/* Stats Row - Enhanced */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                    {/* Total Applications Card */}
                    <div className="group relative bg-gradient-to-br from-white to-[#F9F9F8] p-6 rounded-3xl border-2 border-[#D0D1C9] shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2.5 rounded-xl bg-[#E8E8E3]">
                                <LayoutGrid className="w-5 h-5 text-[#505645]" />
                            </div>
                            <p className="text-xs uppercase tracking-wider text-[#858A77] font-bold">Total</p>
                        </div>
                        <p className="text-4xl font-bold text-[#171915] mb-1">{applications.length}</p>
                        <p className="text-xs text-[#858A77]">Applications</p>
                    </div>

                    {/* In Draft Card */}
                    <div className="group relative bg-gradient-to-br from-yellow-50 to-white p-6 rounded-3xl border-2 border-yellow-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2.5 rounded-xl bg-yellow-100">
                                <Clock className="w-5 h-5 text-yellow-700" />
                            </div>
                            <p className="text-xs uppercase tracking-wider text-yellow-700 font-bold">In Draft</p>
                        </div>
                        <p className="text-4xl font-bold text-yellow-700 mb-1">
                            {applications.filter(a => a.status === 'pending').length}
                        </p>
                        <p className="text-xs text-yellow-600">Pending Review</p>
                    </div>

                    {/* Submitted Card */}
                    <div className="group relative bg-gradient-to-br from-green-50 to-white p-6 rounded-3xl border-2 border-green-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2.5 rounded-xl bg-green-100">
                                <CheckCircle className="w-5 h-5 text-green-700" />
                            </div>
                            <p className="text-xs uppercase tracking-wider text-green-700 font-bold">Submitted</p>
                        </div>
                        <p className="text-4xl font-bold text-green-700 mb-1">
                            {applications.filter(a => a.status !== 'pending').length}
                        </p>
                        <p className="text-xs text-green-600">Completed</p>
                    </div>
                </div>

                {/* Application Cards - Enhanced */}
                <div className="space-y-5">
                    {applications.map((app) => {
                        const isPending = app.status === 'pending';
                        const statusColor = isPending
                            ? { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' }
                            : { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' };

                        return (
                            <div
                                key={app.id}
                                className={`
                                        group bg-white border-2 rounded-3xl overflow-hidden transition-all duration-300
                                        ${expandedId === app.id
                                        ? 'shadow-2xl ring-2 ring-[#505645] scale-[1.01]'
                                        : 'border-[#D0D1C9] hover:shadow-xl hover:border-[#858A77]'}
                                    `}
                            >
                                {/* Header / Summary - Improved */}
                                <div
                                    onClick={() => toggleExpand(app.id)}
                                    className="p-7 cursor-pointer flex items-center justify-between bg-white relative z-10"
                                >
                                    <div className="flex items-center gap-5">
                                        {/* Icon with Status Indicator */}
                                        <div className="relative">
                                            <div className={`
                                                    w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-md
                                                    ${isPending ? 'bg-gradient-to-br from-yellow-100 to-yellow-50 text-yellow-700' : 'bg-gradient-to-br from-[#505645] to-[#404537] text-white'}
                                                `}>
                                                <FileText className="w-7 h-7" />
                                            </div>
                                            {/* Status Dot */}
                                            <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${isPending ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
                                        </div>

                                        {/* Application Info */}
                                        <div>
                                            <h3 className="text-xl font-bold text-[#171915] mb-1.5">
                                                {app.application_data.industry_name || 'Untitled Application'}
                                            </h3>
                                            <div className="flex items-center gap-3 text-sm text-[#858A77]">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    <span className="font-medium">{new Date(app.submitted_at).toLocaleDateString()}</span>
                                                </div>
                                                <span className="w-1 h-1 rounded-full bg-[#D0D1C9]"></span>
                                                <span className="font-medium">{app.application_data?.industry_type || 'Unknown Type'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status Badge + Chevron */}
                                    <div className="flex items-center gap-4">
                                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusColor.bg} border-2 ${statusColor.border}`}>
                                            <div className={`w-2 h-2 rounded-full ${isPending ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                                            <span className={`text-sm font-bold uppercase tracking-wide ${statusColor.text}`}>
                                                {app.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <ChevronDown className={`w-6 h-6 text-[#858A77] transition-transform duration-300 ${expandedId === app.id ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>

                                {/* Expanded Content - Redesigned with Professional UX */}
                                {expandedId === app.id && (
                                    <div className="border-t border-[#E8E8E3] bg-white animate-in slide-in-from-top-2 duration-300">
                                        {/* Content Grid with Adjusted Spacing */}
                                        <div className="p-7 grid grid-cols-1 lg:grid-cols-2 gap-8">

                                            {/* Left Column: Application Details */}
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-8 h-8 rounded-xl bg-[#505645] flex items-center justify-center shadow-sm">
                                                        <Info className="w-4 h-4 text-white" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xs uppercase tracking-wider text-[#858A77] font-bold mb-0.5">Application</h4>
                                                        <p className="text-base font-serif italic text-[#171915]">Details</p>
                                                    </div>
                                                </div>

                                                <div className="bg-[#F9F9F8] rounded-2xl p-5 border border-[#E8E8E3] space-y-4 h-[180px] flex flex-col justify-between">
                                                    <div className="flex justify-between items-start pb-3 border-b border-[#E8E8E3]">
                                                        <div>
                                                            <p className="text-xs uppercase tracking-wide text-[#858A77] font-semibold mb-1">Total Area</p>
                                                            <div className="flex items-baseline gap-1">
                                                                <p className="text-xl font-bold text-[#171915]">{app.application_data.square_feet || '-'}</p>
                                                                <p className="text-xs text-[#858A77]">sq ft</p>
                                                            </div>
                                                        </div>
                                                        <div className="p-2 bg-[#E8E8E3] rounded-lg">
                                                            <svg className="w-4 h-4 text-[#505645]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                                            </svg>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm text-[#858A77] font-medium">Project Type</span>
                                                            <span className="text-xs font-bold text-[#171915] bg-white px-3 py-1 rounded-lg border border-[#E8E8E3]">
                                                                {app.application_data.industry_type || 'Unknown'}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm text-[#858A77] font-medium">Documents</span>
                                                            <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-lg border border-[#E8E8E3]">
                                                                <FileText className="w-3.5 h-3.5 text-[#505645]" />
                                                                <span className="text-xs font-bold text-[#171915]">
                                                                    {app.application_data.documents?.length || 0} files
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Column: Compliance Snapshot */}
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-8 h-8 rounded-xl bg-[#505645] flex items-center justify-center shadow-sm">
                                                        <CheckCircle className="w-4 h-4 text-white" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xs uppercase tracking-wider text-[#858A77] font-bold mb-0.5">Compliance</h4>
                                                        <p className="text-base font-serif italic text-[#171915]">Snapshot</p>
                                                    </div>
                                                </div>

                                                {app.compliance_report ? (
                                                    <div className="bg-gradient-to-br from-[#505645] via-[#404537] to-[#505645] rounded-2xl p-6 shadow-lg relative overflow-hidden h-[180px] flex flex-col justify-between">
                                                        {/* Decorative Background Element */}
                                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>

                                                        <div className="relative z-10 flex-1 flex flex-col justify-center">
                                                            {/* Score Display (Compact) */}
                                                            <div className="flex items-center justify-between mb-4">
                                                                <p className="text-xs uppercase tracking-widest text-white/50 font-bold">Score</p>
                                                                <div className="flex items-baseline gap-1">
                                                                    <span className="text-5xl font-black font-serif italic text-white leading-none">
                                                                        {Math.round(app.compliance_report.confidence_score * 100)}
                                                                    </span>
                                                                    <span className="text-lg text-white/40 font-bold">/100</span>
                                                                </div>
                                                            </div>

                                                            {/* Progress Bar */}
                                                            <div className="space-y-2 mb-4">
                                                                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden backdrop-blur border border-white/20">
                                                                    <div
                                                                        className="bg-gradient-to-r from-green-300 via-green-400 to-green-300 h-full rounded-full transition-all duration-1000 shadow-lg"
                                                                        style={{ width: `${app.compliance_report.confidence_score * 100}%` }}
                                                                    ></div>
                                                                </div>
                                                            </div>

                                                            {/* Issues Summary */}
                                                            <div className="flex items-center justify-between pt-3 border-t border-white/20">
                                                                <div className="flex items-center gap-2">
                                                                    <AlertTriangle className="w-4 h-4 text-yellow-300" />
                                                                    <span className="text-xs font-semibold text-white">Issues Found</span>
                                                                </div>
                                                                <div className="px-3 py-1.5 bg-white/10 rounded-full backdrop-blur border border-white/20">
                                                                    <span className="text-xs font-bold text-white">
                                                                        {app.compliance_report.issues.length}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="bg-[#F9F9F8] rounded-2xl p-6 border-2 border-dashed border-[#D0D1C9] text-center h-[180px] flex flex-col items-center justify-center">
                                                        <div className="w-12 h-12 bg-[#E8E8E3] rounded-full flex items-center justify-center mb-3">
                                                            <AlertTriangle className="w-6 h-6 text-[#858A77]" />
                                                        </div>
                                                        <h5 className="text-sm font-bold text-[#171915] mb-1">No Analysis Yet</h5>
                                                        <p className="text-xs text-[#858A77] leading-relaxed max-w-xs mx-auto">
                                                            Compliance analysis hasn't been run.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action Bar (Compact) */}
                                        <div className="px-7 py-4 bg-[#F9F9F8] border-t border-[#E8E8E3] flex flex-col sm:flex-row items-center justify-between gap-4">
                                            <Button
                                                variant="ghost"
                                                className="h-10 text-xs group/del text-red-600 hover:text-white hover:bg-red-600 px-4 rounded-lg border border-red-200 hover:border-red-600 transition-all font-semibold"
                                                onClick={(e) => handleDelete(app.id, e)}
                                            >
                                                <Trash2 className="w-3.5 h-3.5 mr-2 group-hover/del:scale-110 transition-transform" />
                                                Delete
                                            </Button>

                                            <Button
                                                onClick={() => router.push(`/applicant?id=${app.id}`)}
                                                className="h-10 bg-[#505645] text-white hover:bg-[#404537] rounded-lg px-6 shadow-sm hover:shadow-md transition-all hover:scale-105 font-bold text-sm flex items-center gap-2"
                                            >
                                                <span>Open Application</span>
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            )}
        </div>
    );
}
