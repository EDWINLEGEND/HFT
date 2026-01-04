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
} from "../../../components/ui/alert-dialog";

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
            setApplications([]);
        } catch (err) {
            console.error('Failed to clear all applications', err);
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
                                                <span className="font-medium">{app.application_data.industry_type || 'Unknown Type'}</span>
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

                                {/* Expanded Content - Enhanced */}
                                {expandedId === app.id && (
                                    <div className="border-t-2 border-[#EFEFEF] bg-gradient-to-br from-[#F9F9F8] to-white p-7 animate-in slide-in-from-top-2 duration-300">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                                            {/* Application Details - Enhanced */}
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <div className="w-8 h-8 rounded-lg bg-[#505645] flex items-center justify-center">
                                                        <Info className="w-4 h-4 text-white" />
                                                    </div>
                                                    <h4 className="text-sm font-bold uppercase tracking-wider text-[#505645]">Application Details</h4>
                                                </div>
                                                <div className="space-y-3 bg-white p-5 rounded-2xl border border-[#D0D1C9] shadow-sm">
                                                    <div className="flex justify-between items-center py-2 border-b border-[#EFEFEF]">
                                                        <span className="text-sm text-[#858A77]">Area</span>
                                                        <span className="text-sm font-bold text-[#171915]">{app.application_data.square_feet || '-'} sq ft</span>
                                                    </div>
                                                    <div className="flex justify-between items-center py-2 border-b border-[#EFEFEF]">
                                                        <span className="text-sm text-[#858A77]">Water Source</span>
                                                        <span className="text-sm font-bold text-[#171915]">{app.application_data.water_source || '-'}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center py-2">
                                                        <span className="text-sm text-[#858A77]">Documents</span>
                                                        <div className="flex items-center gap-1.5">
                                                            <FileText className="w-3.5 h-3.5 text-[#505645]" />
                                                            <span className="text-sm font-bold text-[#171915]">{app.application_data.documents?.length || 0} files</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Compliance Snapshot - Enhanced */}
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <div className="w-8 h-8 rounded-lg bg-[#505645] flex items-center justify-center">
                                                        <CheckCircle className="w-4 h-4 text-white" />
                                                    </div>
                                                    <h4 className="text-sm font-bold uppercase tracking-wider text-[#505645]">Compliance Snapshot</h4>
                                                </div>
                                                {app.compliance_report ? (
                                                    <div className="space-y-4 bg-gradient-to-br from-[#505645] to-[#404537] p-6 rounded-2xl text-white shadow-lg">
                                                        <div className="flex items-end justify-between">
                                                            <span className="text-xs uppercase tracking-wider text-white/60 font-bold">Score</span>
                                                            <div className="text-right">
                                                                <span className="text-4xl font-black font-serif italic">{Math.round(app.compliance_report.confidence_score * 100)}</span>
                                                                <span className="text-lg text-white/40 font-bold">/100</span>
                                                            </div>
                                                        </div>
                                                        <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden backdrop-blur">
                                                            <div
                                                                className="bg-gradient-to-r from-green-400 to-green-300 h-full rounded-full transition-all duration-1000"
                                                                style={{ width: `${app.compliance_report.confidence_score * 100}%` }}
                                                            ></div>
                                                        </div>
                                                        <div className="flex items-center gap-2 pt-2 border-t border-white/20">
                                                            <AlertTriangle className="w-4 h-4 text-yellow-300" />
                                                            <p className="text-sm font-medium text-white/90">
                                                                {app.compliance_report.issues.length} issue{app.compliance_report.issues.length !== 1 ? 's' : ''} found
                                                            </p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="p-6 bg-white rounded-2xl border-2 border-dashed border-[#D0D1C9] text-center">
                                                        <div className="w-12 h-12 bg-[#F4F5F4] rounded-full flex items-center justify-center mx-auto mb-3">
                                                            <AlertTriangle className="w-6 h-6 text-[#858A77]" />
                                                        </div>
                                                        <p className="text-sm text-[#858A77] font-medium">Analysis not run yet</p>
                                                        <p className="text-xs text-[#858A77]/60 mt-1">Open to analyze compliance</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action Buttons - Enhanced */}
                                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t-2 border-[#EFEFEF]">
                                            <Button
                                                variant="ghost"
                                                className="group/del text-red-500 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-full border-2 border-transparent hover:border-red-200 transition-all"
                                                onClick={(e) => handleDelete(app.id, e)}
                                            >
                                                <Trash2 className="w-4 h-4 mr-2 group-hover/del:scale-110 transition-transform" />
                                                Delete Application
                                            </Button>

                                            <Button
                                                onClick={() => router.push(`/applicant?id=${app.id}`)}
                                                className="bg-gradient-to-r from-[#171915] to-[#2d2f28] text-white hover:from-black hover:to-[#171915] rounded-full px-8 py-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105 font-bold"
                                            >
                                                Open Application
                                                <ExternalLink className="w-4 h-4 ml-2" />
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
