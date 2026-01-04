'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ArrowRight, CheckCircle, AlertTriangle, FileText, UploadCloud, X, ChevronRight, Loader2, Info,
    Factory, Building2, Home, Store, ArrowLeft
} from "lucide-react";
import { CivicAssistAPI } from '@/lib/api';
import type { IndustrialApplication, ComplianceReport, ComplianceIssue, ApplicationData } from '@/lib/types';
import { getFormConfig, type FormSection, type FormField } from '@/lib/form-configs';

// --- TYPES ---
// --- TYPES ---
// AppStep is now imported from context via usage, or we can just rely on the string literal inference
// type AppStep = 'START' | 'TYPE_SELECTION' | 'UPLOAD' | 'FORM' | 'ANALYZING' | 'RESULTS';

interface DocRequirement {
    id: string;
    name: string;
    description: string;
}

// --- CONFIG ---
const APP_TYPES = [
    { id: 'Manufacturing', label: 'Manufacturing Unit', icon: Factory, description: 'Factories, production plants, and assembly units.' },
    { id: 'Commercial', label: 'Commercial Complex', icon: Building2, description: 'Malls, office buildings, and hotels.' },
    { id: 'Residential', label: 'Residential Project', icon: Home, description: 'Housing colonies, apartments, or townships.' },
    { id: 'Warehousing', label: 'Warehouse / Storage', icon: Store, description: 'Logistics hubs and cold storage facilities.' },
];

const getRequiredDocs = (type: string): DocRequirement[] => {
    const common = [
        { id: 'site_plan', name: 'Site Plan', description: 'Layout of the premises with dimensions' },
    ];

    switch (type) {
        case 'Manufacturing':
            return [...common,
            { id: 'pollution_consent', name: 'PCB Consent (CTE)', description: 'Consent to Establish from Pollution Control Board' },
            { id: 'factory_license', name: 'Factory License Plan', description: 'Layout approved by Dept of Factories' },
            { id: 'zld_report', name: 'ZLD Technical Report', description: 'Zero Liquid Discharge system details' }
            ];
        case 'Commercial':
            return [...common,
            { id: 'fire_noc', name: 'Fire NOC', description: 'No Objection Certificate from Fire Services' },
            { id: 'parking_plan', name: 'Parking & Traffic Plan', description: 'Basement and surface parking layout' }
            ];
        case 'Residential':
            return [...common,
            { id: 'env_clearance', name: 'Environmental Clearance', description: 'EC Copy for projects > 20,000 sq.m' },
            { id: 'waste_plan', name: 'Solid Waste Protocol', description: 'Organic Waste Converter (OWC) location' }
            ];
        case 'Warehousing':
            return [...common,
            { id: 'structural_cert', name: 'Structural Stability', description: 'Floor load capacity certificate (>5T/sqm)' },
            { id: 'fire_safety_plan', name: 'Fire Safety Plan', description: 'High hazard storage protection details' }
            ];
        default:
            return [...common, { id: 'other', name: 'General Proposal', description: 'Project details document' }];
    }
};

import { useApplication } from '@/lib/context';

export default function ApplicantPage() {
    // Use context for step management to sync with sidebar
    const { currentStage: step, setStage: setStep, triggerRefresh } = useApplication();
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
    const appId = searchParams.get('id');

    // Application Data
    const [appType, setAppType] = useState<string>('');
    const [formData, setFormData] = useState<Record<string, any>>({
        industry_name: '',
        industry_type: '',
        total_area: 0,
        square_feet: '',
        documents: []
    });

    // Upload State
    const [uploadedDocs, setUploadedDocs] = useState<Set<string>>(new Set());
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeDocId, setActiveDocId] = useState<string | null>(null);

    // Analysis State
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [report, setReport] = useState<ComplianceReport | null>(null);
    const [expandedHelp, setExpandedHelp] = useState<Set<number>>(new Set());

    // --- EFFECT: Load Application ---
    useEffect(() => {
        if (appId) {
            CivicAssistAPI.getApplicationDetails(appId).then(app => {
                if (app && app.application_data) {
                    // Populate from saved app
                    setFormData(prev => ({
                        ...prev,
                        ...app.application_data
                    }));
                    if (app.application_data.industry_type) {
                        setAppType(app.application_data.industry_type);
                    }

                    // If report exists (completed status), set it
                    if (app.status !== 'pending' && app.compliance_report) {
                        setReport(app.compliance_report);
                        setStep('RESULTS');
                    } else {
                        setStep('FORM');
                    }
                }
            }).catch(err => console.error("Failed to load", err));
        }
    }, [appId]);


    // --- HANDLERS ---

    // --- TOAST STATE ---
    const [showToast, setShowToast] = useState(false);

    // --- HANDLERS ---

    const handleSaveDraft = async () => {
        try {
            await CivicAssistAPI.submitApplication({
                application_data: {
                    ...formData,
                    documents: Array.from(uploadedDocs)
                },
                compliance_report: report,
                status: 'pending' // Draft status
            });
            triggerRefresh(); // Update sidebar
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } catch (e) {
            console.error(e);
            alert("Failed to save draft");
        }
    };

    // ... (rest of handlers) ...

    // --- TOAST COMPONENT ---
    const Toast = () => (
        <div className={`
                 fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-[#171915] text-white px-6 py-3 rounded-full shadow-2xl z-[100] flex items-center gap-3 transition-all duration-300
                 ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}
            `}>
            <div className="bg-[#505645] text-white rounded-full p-1"><CheckCircle className="w-4 h-4" /></div>
            <span className="font-medium">Application saved successfully</span>
        </div>
    );

    // ... (rest of component render logic until RESULTS view) ...

    // 6. RESULTS VIEW (Desktop Optimized)




    const handleTypeSelect = (typeId: string) => {
        setAppType(typeId);
        setFormData(prev => ({ ...prev, industry_type: typeId }));
        setStep('UPLOAD');
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0] || !activeDocId) return;

        const file = e.target.files[0];
        setIsUploading(true);

        try {
            // Simulating API latency
            await new Promise(r => setTimeout(r, 1500));

            let extractedData: Record<string, any> = {};

            // --- TYPE-SPECIFIC INTELLIGENT EXTRACTION ---
            if (appType === 'Manufacturing') {
                switch (activeDocId) {
                    case 'pollution_consent':
                        extractedData = {
                            industry_name: 'GreenTech Manufacturing Ltd.',
                            water_source: 'Borewell + Recycled (ETP)',
                            drainage_method: 'Zero Liquid Discharge (ZLD)',
                            etp_capacity: 10,
                            zld_system: 'RO + MEE',
                            effluent_quality: 'pH: 7.2, BOD: 25 mg/l, COD: 200 mg/l'
                        };
                        break;
                    case 'factory_license':
                        extractedData = {
                            worker_count: 150,
                            ventilation_acph: 6,
                            fire_hydrant_count: 4
                        };
                        break;
                    case 'zld_report':
                        extractedData = {
                            zld_system: 'RO + MEE',
                            effluent_quality: 'TDS < 100 ppm, COD < 10 ppm'
                        };
                        break;
                }
            } else if (appType === 'Commercial') {
                switch (activeDocId) {
                    case 'fire_noc':
                        extractedData = {
                            sprinkler_coverage: 'All Floors + Basements',
                            staircase_width: 1.5,
                            travel_distance: 28,
                            refuge_area_height: 24
                        };
                        break;
                    case 'parking_plan':
                        extractedData = {
                            total_ecs: 240,
                            ev_charging_bays: 48,
                            basement_levels: 2
                        };
                        break;
                }
            } else if (appType === 'Residential') {
                switch (activeDocId) {
                    case 'env_clearance':
                        extractedData = {
                            total_area: 25000,
                            square_feet: '250000',
                            ec_category: 'B2 (20k-150k sq.m)',
                            tree_count: 275,
                            green_cover_percentage: 15
                        };
                        break;
                    case 'waste_plan':
                        extractedData = {
                            owc_capacity: 200,
                            segregation_system: '3-Bin System (Wet/Dry/Hazardous)'
                        };
                        break;
                }
            } else if (appType === 'Warehousing') {
                switch (activeDocId) {
                    case 'structural_cert':
                        extractedData = {
                            industry_name: 'Apex Logistics Hub',
                            floor_load_capacity: 7,
                            clear_height: 12,
                            flooring_type: 'VDF (Vacuum Dewatered)'
                        };
                        break;
                    case 'fire_safety_plan':
                        extractedData = {
                            sprinkler_type: 'ESFR (Early Suppression Fast Response)',
                            fire_tank_capacity: 600000,
                            compartment_size: 2500
                        };
                        break;
                }
            }

            // Common site_plan extraction
            if (activeDocId === 'site_plan' && !formData.industry_name) {
                extractedData.industry_name = 'New Project Application';
                extractedData.square_feet = '30000';
            }

            // Update form data
            setFormData(prev => ({
                ...prev,
                ...extractedData,
                documents: [...(prev.documents || []), file.name]
            }));

            setUploadedDocs(prev => new Set(prev).add(activeDocId));

        } catch (error) {
            console.error("Upload failed", error);
            alert("Failed to process document. Please try again.");
        } finally {
            setIsUploading(false);
            setActiveDocId(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const triggerUpload = (docId: string) => {
        setActiveDocId(docId);
        fileInputRef.current?.click();
    };

    const handleAnalyze = async () => {
        setStep('ANALYZING');
        setIsAnalyzing(true);

        try {
            // Use real analysis if available, or fallback mock for UI demo
            try {
                const result = await CivicAssistAPI.analyzeCompliance(formData);
                setReport(result);
            } catch (err) {
                // Fallback Mock Report for demo purposes if backend isn't full ready
                // CUSTOM REPORT BASED ON TYPE
                let mockIssues: ComplianceIssue[] = [];

                if (appType === 'Manufacturing') {
                    mockIssues = [
                        { issue_type: 'violation', severity: 'high', description: 'ETP Capacity (5 KLD) is insufficient for projected output.', department: 'Pollution Control', regulation_reference: 'Water Act 1974' },
                        { issue_type: 'missing_document', severity: 'medium', description: 'On-site Emergency Plan missing.', department: 'Factory Safety', regulation_reference: 'Factories Act 1948' }
                    ];
                } else if (appType === 'Commercial') {
                    mockIssues = [
                        { issue_type: 'violation', severity: 'high', description: 'Fire Exit width (1.2m) is less than required 1.5m.', department: 'Fire Safety', regulation_reference: 'NBC 2016 Part 4' },
                        { issue_type: 'ambiguity', severity: 'low', description: 'Visitor parking calculation unclear.', department: 'Town Planning' }
                    ];
                } else if (appType === 'Residential') {
                    mockIssues = [
                        { issue_type: 'violation', severity: 'medium', description: 'Rainwater Harvesting pits count (2) is below requirement (4).', department: 'Environment', regulation_reference: 'Green Building Code' }
                    ];
                } else {
                    mockIssues = [
                        { issue_type: 'violation', severity: 'high', description: 'Sprinkler system coverage incomplete for Rack Storage.', department: 'Fire Safety', regulation_reference: 'Warehousing Standards' }
                    ];
                }

                setReport({
                    status: 'partial',
                    confidence_score: 0.85,
                    issues: mockIssues,
                    missing_documents: [],
                    recommendations: [],
                    regulation_coverage: 1,
                    generated_at: new Date().toISOString()
                });
            }
            setStep('RESULTS');
        } catch (error) {
            console.error("Analysis failed", error);
            setStep('FORM');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const toggleHelp = (index: number) => {
        const newSet = new Set(expandedHelp);
        if (newSet.has(index)) newSet.delete(index);
        else newSet.add(index);
        setExpandedHelp(newSet);
    };

    // --- COMPONENTS ---

    const PillButton = ({ onClick, children, disabled = false, className = '' }: any) => (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                group relative flex items-center justify-between pl-8 pr-2 py-1 h-16 rounded-full 
                transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1
                ${disabled ? 'bg-gray-300 cursor-not-allowed opacity-70' : 'bg-[#505645] text-white hover:bg-[#404537]'}
                ${className}
            `}
        >
            <span className="font-semibold text-lg tracking-wide mr-6">{children}</span>
            <div className={`
                h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300
                ${disabled ? 'bg-gray-400' : 'bg-white/10 group-hover:bg-white/20'}
            `}>
                <ArrowRight className="w-6 h-6 text-white transition-transform group-hover:translate-x-1" />
            </div>
        </button>
    );

    // --- VIEW RENDERERS ---

    const requiredDocs = getRequiredDocs(appType);

    // 1. START VIEW
    if (step === 'START') {
        return (
            <div className="min-h-full flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto animate-in fade-in duration-700">
                <div className="mb-8 p-5 bg-[#E8E8E3] rounded-full inline-block">
                    <FileText className="w-8 h-8 text-[#505645]" />
                </div>
                <h1 className="text-5xl md:text-6xl font-sans font-bold text-[#171915] mb-6 leading-tight">
                    Streamline your <br />
                    <span className="font-serif italic font-normal text-[#505645]">Industrial Compliance</span>
                </h1>
                <p className="text-[#404537] mb-12 text-xl leading-relaxed max-w-lg mx-auto">
                    Select your application type and get instant AI-powered verification against local regulations.
                </p>
                <PillButton onClick={() => setStep('TYPE_SELECTION')}>
                    Start New Application
                </PillButton>
            </div>
        );
    }

    // 2. TYPE SELECTION VIEW
    if (step === 'TYPE_SELECTION') {
        return (
            <div className="max-w-5xl mx-auto p-8 animate-in slide-in-from-right-8 duration-500">
                <div className="mb-12 text-center md:text-left">
                    <button onClick={() => setStep('START')} className="text-sm text-gray-400 hover:text-[#505645] mb-6 flex items-center gap-2 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </button>
                    <h2 className="text-4xl font-bold text-[#171915]">
                        What type of <span className="font-serif italic font-normal text-[#505645]">project</span> is this?
                    </h2>
                    <p className="text-[#858A77] mt-2 text-lg">We need this to determine which documents are required.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {APP_TYPES.map((type) => (
                        <div
                            key={type.id}
                            onClick={() => handleTypeSelect(type.id)}
                            className="group relative p-8 rounded-3xl bg-white border border-[#D0D1C9] hover:border-[#505645] hover:shadow-xl transition-all cursor-pointer flex items-start gap-6"
                        >
                            <div className="p-4 rounded-2xl bg-[#F4F5F4] group-hover:bg-[#505645] transition-colors duration-300">
                                <type.icon className="w-8 h-8 text-[#505645] group-hover:text-white transition-colors" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-[#171915] mb-2">{type.label}</h3>
                                <p className="text-[#858A77] leading-relaxed">{type.description}</p>
                            </div>
                            <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-2">
                                <ArrowRight className="w-6 h-6 text-[#505645]" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // 3. UPLOAD VIEW
    if (step === 'UPLOAD') {
        const allUploaded = requiredDocs.every(d => uploadedDocs.has(d.id));

        return (
            <div className="max-w-6xl mx-auto p-8 animate-in slide-in-from-right-8 duration-500 flex flex-col md:flex-row gap-12 h-full">
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileSelect}
                    accept=".pdf,.jpg,.png,.docx"
                />

                {/* Left Side: Info */}
                <div className="md:w-1/3 space-y-8">
                    <div>
                        <button onClick={() => setStep('TYPE_SELECTION')} className="text-sm text-gray-400 hover:text-[#505645] mb-6 flex items-center gap-2 transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Change Type
                        </button>
                        <h2 className="text-4xl font-bold text-[#171915] leading-tight">
                            Upload Required <br />
                            <span className="font-serif italic font-normal text-[#505645]">Documents</span>
                        </h2>
                        <p className="text-[#858A77] mt-4 text-lg">
                            For a <strong>{APP_TYPES.find(t => t.id === appType)?.label}</strong>, we need the following files to proceed.
                        </p>
                    </div>

                    <div className="hidden md:block">
                        <div className="p-6 bg-[#E8E8E3]/50 rounded-2xl border border-[#D0D1C9]">
                            <h4 className="font-bold text-[#505645] mb-2 flex items-center gap-2">
                                <Info className="w-4 h-4" /> Why upload first?
                            </h4>
                            <p className="text-sm text-[#404537] leading-relaxed">
                                Our AI extracts 80% of form data directly from your Site Plan and Consents, checking for basic errors before you even type.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Grid */}
                <div className="flex-1 flex flex-col">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-fr">
                        {requiredDocs.map((doc) => {
                            const isUploaded = uploadedDocs.has(doc.id);
                            return (
                                <div
                                    key={doc.id}
                                    onClick={() => !isUploaded && !isUploading && triggerUpload(doc.id)}
                                    className={`
                                        relative p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer group flex flex-col justify-between
                                        ${isUploaded
                                            ? 'bg-[#E8E8E3]/50 border-[#505645] opacity-100'
                                            : 'bg-white border-[#D0D1C9] hover:border-[#858A77] hover:bg-[#F9F9F8] shadow-sm hover:shadow-md'}
                                    `}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-full ${isUploaded ? 'bg-[#505645] text-white' : 'bg-[#F4F5F4] text-[#858A77]'}`}>
                                            {isUploaded ? <CheckCircle className="w-6 h-6" /> : isUploading && activeDocId === doc.id ? <Loader2 className="w-6 h-6 animate-spin" /> : <UploadCloud className="w-6 h-6" />}
                                        </div>
                                        {isUploaded && <span className="text-xs font-bold text-[#505645] bg-white px-2 py-1 rounded-full uppercase tracking-wider">Uploaded</span>}
                                    </div>
                                    <div>
                                        <h3 className={`font-bold text-lg mb-1 ${isUploaded ? 'text-[#171915]' : 'text-gray-600'}`}>{doc.name}</h3>
                                        <p className="text-sm text-gray-400">{doc.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-8 flex justify-end">
                        <PillButton
                            disabled={!allUploaded}
                            onClick={() => setStep('FORM')}
                            className="w-full md:w-auto shadow-2xl"
                        >
                            Review Details
                        </PillButton>
                    </div>
                </div>
            </div>
        );
    }

    // 4. FORM MODAL
    if (step === 'FORM') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#171915]/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
                <Toast />
                <div className="bg-[#F4F5F4] w-full max-w-2xl max-h-[90vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col animate-in scale-95 duration-300">

                    {/* Header */}
                    <div className="p-8 border-b border-[#D0D1C9] flex items-center justify-between bg-white relative">
                        {/* Decorative ribbon */}
                        <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-[#505645] to-[#858A77]"></div>

                        <div>
                            <h2 className="text-3xl font-bold text-[#171915]">Review Application</h2>
                            <p className="text-[#858A77] mt-1">We extracted this from your {requiredDocs[0].name}.</p>
                        </div>
                        <button onClick={() => setStep('UPLOAD')} className="p-2 rounded-full hover:bg-black/5 transition-colors">
                            <X className="w-6 h-6 text-[#505645]" />
                        </button>
                    </div>

                    {/* Scrollable Form */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-8">
                        {/* Auto-fill Notice */}
                        <div className="p-4 bg-[#505645]/5 rounded-xl flex gap-4 items-start border border-[#505645]/20">
                            <div className="p-2 bg-[#505645] rounded-full text-white mt-0.5">
                                <CheckCircle className="w-4 h-4" />
                            </div>
                            <div>
                                <h4 className="font-bold text-[#171915] text-sm">Auto-Filled Successfully</h4>
                                <p className="text-sm text-[#404537] leading-relaxed mt-1">
                                    Our system extracted data from your uploaded documents. Please verify and complete the form.
                                </p>
                            </div>
                        </div>

                        {/* Common Fields */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-xs uppercase tracking-wider font-bold text-[#858A77] ml-1">Project Name</Label>
                                <Input
                                    value={formData.industry_name || ''}
                                    onChange={e => setFormData({ ...formData, industry_name: e.target.value })}
                                    className="bg-white border-[#D0D1C9] h-14 text-xl px-4 focus:ring-[#505645] rounded-xl font-medium text-[#171915]"
                                    placeholder="Enter project name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs uppercase tracking-wider font-bold text-[#858A77] ml-1">Total Area (Sq. Ft)</Label>
                                <Input
                                    value={formData.square_feet || ''}
                                    onChange={e => setFormData({ ...formData, square_feet: e.target.value })}
                                    className="bg-white border-[#D0D1C9] h-14 text-lg px-4 focus:ring-[#505645] rounded-xl"
                                    placeholder="Enter total area"
                                />
                            </div>
                        </div>

                        {/* Dynamic Type-Specific Fields */}
                        {getFormConfig(appType).map((section, sectionIdx) => (
                            <div key={sectionIdx} className="space-y-6 animate-in fade-in slide-in-from-top-4">
                                {/* Section Header */}
                                <div className="border-l-4 border-[#505645] pl-4 py-2 bg-[#F9F9F8] rounded-r-xl">
                                    <h3 className="font-bold text-lg text-[#171915]">{section.title}</h3>
                                    {section.description && (
                                        <p className="text-sm text-[#858A77] mt-1">{section.description}</p>
                                    )}
                                    <span className="text-xs text-[#505645] font-mono mt-1 block">
                                        {section.regulationCategory}
                                    </span>
                                </div>

                                {/* Section Fields */}
                                <div className="space-y-4 pl-4">
                                    {section.fields.map((field) => (
                                        <div key={field.id} className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Label className="text-xs uppercase tracking-wider font-bold text-[#858A77]">
                                                    {field.label}
                                                    {field.required && <span className="text-red-500 ml-1">*</span>}
                                                </Label>
                                                {field.unit && (
                                                    <span className="text-xs text-[#505645] bg-[#E8E8E3] px-2 py-0.5 rounded-full">
                                                        {field.unit}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Render field based on type */}
                                            {field.type === 'select' ? (
                                                <select
                                                    value={formData[field.id] || ''}
                                                    onChange={e => setFormData({ ...formData, [field.id]: e.target.value })}
                                                    className="w-full bg-white border border-[#D0D1C9] h-12 px-4 rounded-xl focus:ring-2 focus:ring-[#505645] focus:border-transparent text-[#171915]"
                                                >
                                                    <option value="">Select...</option>
                                                    {field.options?.map(opt => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                            ) : field.type === 'textarea' ? (
                                                <textarea
                                                    value={formData[field.id] || ''}
                                                    onChange={e => setFormData({ ...formData, [field.id]: e.target.value })}
                                                    placeholder={field.placeholder}
                                                    className="w-full bg-white border border-[#D0D1C9] px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#505645] focus:border-transparent text-[#171915] min-h-[100px]"
                                                />
                                            ) : field.type === 'checkbox' ? (
                                                <label className="flex items-center gap-3 p-4 bg-white border border-[#D0D1C9] rounded-xl cursor-pointer hover:bg-[#F9F9F8] transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData[field.id] || false}
                                                        onChange={e => setFormData({ ...formData, [field.id]: e.target.checked })}
                                                        className="w-5 h-5 rounded border-[#D0D1C9] text-[#505645] focus:ring-[#505645]"
                                                    />
                                                    <span className="text-sm text-[#171915]">{field.helpText || 'Yes'}</span>
                                                </label>
                                            ) : (
                                                <Input
                                                    type={field.type}
                                                    value={formData[field.id] || ''}
                                                    onChange={e => setFormData({ ...formData, [field.id]: field.type === 'number' ? parseFloat(e.target.value) || '' : e.target.value })}
                                                    placeholder={field.placeholder}
                                                    className="bg-white border-[#D0D1C9] h-12 px-4 focus:ring-[#505645] rounded-xl text-[#171915]"
                                                />
                                            )}

                                            {/* Help Text */}
                                            {field.helpText && field.type !== 'checkbox' && (
                                                <p className="text-xs text-[#858A77] ml-1 flex items-center gap-1">
                                                    <Info className="w-3 h-3" />
                                                    {field.helpText}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer Action */}
                    <div className="p-8 border-t border-[#D0D1C9] bg-white flex gap-4">
                        {report ? (
                            <>
                                <Button variant="outline" onClick={handleAnalyze} className="flex-1 h-14 rounded-full border-[#505645] text-[#505645] font-bold text-lg hover:bg-[#F4F5F4]">
                                    Re-run Analysis
                                </Button>
                                <PillButton onClick={handleSaveDraft} className="flex-1">
                                    Save Changes
                                </PillButton>
                            </>
                        ) : (
                            <PillButton onClick={handleAnalyze} className="w-full">
                                Run Compliance Analysis
                            </PillButton>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // 5. ANALYZING STATE
    if (step === 'ANALYZING') {
        return (
            <div className="min-h-full flex flex-col items-center justify-center p-6 text-center">
                <div className="relative mb-8">
                    <div className="w-32 h-32 rounded-full border-4 border-[#E8E8E3]"></div>
                    <div className="absolute inset-0 w-32 h-32 rounded-full border-4 border-[#505645] border-t-transparent animate-spin"></div>
                </div>
                <h2 className="text-3xl font-bold text-[#171915] mb-2">Analyzing Compliance...</h2>
                <p className="text-[#858A77] text-lg">Checking {APP_TYPES.find(t => t.id === appType)?.label} regulations</p>
            </div>
        );
    }

    // 6. RESULTS VIEW (Desktop Optimized)
    if (step === 'RESULTS' && report) {
        return (
            <div className="max-w-7xl mx-auto p-8 animate-in fade-in duration-700 pb-24 h-full relative">
                <Toast />
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#D0D1C9] pb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-[#E8E8E3] rounded-lg">
                                {(() => {
                                    const Icon = APP_TYPES.find(t => t.id === appType)?.icon || Factory;
                                    return <Icon className="w-5 h-5 text-[#505645]" />;
                                })()}
                            </div>
                            <span className="text-[#858A77] font-medium tracking-wide uppercase text-sm">Validation Report</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-[#171915]">
                            {formData.industry_name}
                        </h2>
                    </div>
                    <div className="flex gap-4 mt-6 md:mt-0">
                        <button onClick={handleSaveDraft} className="px-6 py-2 rounded-full border border-[#D0D1C9] text-[#171915] font-medium hover:bg-[#F4F5F4] transition-all">
                            Save Application
                        </button>
                        <button onClick={() => setStep('FORM')} className="px-6 py-2 rounded-full border border-[#D0D1C9] text-[#171915] font-medium hover:bg-white hover:border-[#858A77] transition-all">
                            Edit Details
                        </button>
                        <button className="px-6 py-2 rounded-full bg-[#171915] text-white font-medium hover:bg-black transition-all flex items-center gap-2">
                            <FileText className="w-4 h-4" /> Export PDF
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left Column: Score & Summary */}
                    <div className="lg:w-1/3 space-y-8">
                        {/* Score Card */}
                        <div className="bg-[#505645] text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl transition-transform duration-1000 group-hover:scale-125"></div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-12">
                                    <p className="text-white/60 text-sm font-bold uppercase tracking-widest">Compliance Score</p>
                                    <Badge className={`${report.status === 'compliant' ? 'bg-green-400 text-green-900' : 'bg-yellow-400 text-yellow-900'} hover:bg-opacity-90`}>
                                        {report.status.replace('_', ' ')}
                                    </Badge>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-8xl font-serif italic tracking-tighter">{Math.round(report.confidence_score * 100)}</span>
                                    <span className="text-2xl text-white/40">/ 100</span>
                                </div>
                            </div>
                            <div className="mt-12 pt-8 border-t border-white/20 grid grid-cols-2 gap-8">
                                <div>
                                    <p className="text-xs text-white/50 mb-1 uppercase tracking-wider">Status</p>
                                    <p className="font-medium text-lg flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${report.status === 'compliant' ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                                        {report.status === 'compliant' ? 'Ready' : 'Action Req.'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-white/50 mb-1 uppercase tracking-wider">Issues Found</p>
                                    <p className="font-medium text-lg">{report.issues.length} Items</p>
                                </div>
                            </div>
                        </div>

                        {/* Checklist Summary */}
                        <div className="bg-white rounded-[2rem] border border-[#D0D1C9] p-8">
                            <h3 className="text-lg font-bold text-[#171915] mb-6">Document Check</h3>
                            <div className="space-y-4">
                                {requiredDocs.map((doc, i) => {
                                    const isValid = !report.missing_documents.includes(doc.name);
                                    return (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F4F5F4] transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-1.5 rounded-full ${isValid ? 'bg-green-100' : 'bg-red-100'}`}>
                                                    {isValid ? <CheckCircle className="w-4 h-4 text-green-600" /> : <X className="w-4 h-4 text-red-500" />}
                                                </div>
                                                <span className={`text-sm font-medium ${isValid ? 'text-[#171915]' : 'text-gray-400'}`}>{doc.name}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Issues List */}
                    <div className="flex-1 space-y-5">
                        {/* Section Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <h3 className="text-3xl font-bold text-[#171915]">Priority Fixes</h3>
                                <div className="px-3 py-1.5 rounded-full bg-[#E8E8E3] border border-[#D0D1C9]">
                                    <span className="text-sm font-bold text-[#505645]">{report.issues.length}</span>
                                </div>
                            </div>
                        </div>

                        {report.issues.map((issue, i) => {
                            const isHigh = issue.severity === 'high';
                            const isMedium = issue.severity === 'medium';
                            const priorityColor = isHigh ? 'red' : isMedium ? 'orange' : 'yellow';
                            const priorityBg = isHigh ? 'bg-red-50' : isMedium ? 'bg-orange-50' : 'bg-yellow-50';
                            const priorityBorder = isHigh ? 'border-red-200' : isMedium ? 'border-orange-200' : 'border-yellow-200';
                            const priorityText = isHigh ? 'text-red-700' : isMedium ? 'text-orange-700' : 'text-yellow-700';
                            const priorityAccent = isHigh ? 'bg-red-500' : isMedium ? 'bg-orange-500' : 'bg-yellow-500';

                            return (
                                <div
                                    key={i}
                                    className={`group relative bg-white rounded-3xl border-2 ${priorityBorder} overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] ${priorityBg}`}
                                >
                                    {/* Priority Accent Bar */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${priorityAccent}`}></div>

                                    {/* Card Content */}
                                    <div className="p-6 pl-8">
                                        {/* Top Row: Priority Badge + Department */}
                                        <div className="flex items-start justify-between gap-4 mb-4">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                {/* Priority Badge with Icon */}
                                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${priorityBg} border ${priorityBorder}`}>
                                                    <AlertTriangle className={`w-3.5 h-3.5 ${priorityText}`} />
                                                    <span className={`text-xs font-bold uppercase tracking-wide ${priorityText}`}>
                                                        {issue.severity} Priority
                                                    </span>
                                                </div>

                                                {/* Department Badge with Enhanced Styling */}
                                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#505645] text-white">
                                                    <div className="w-2 h-2 rounded-full bg-white/60"></div>
                                                    <span className="text-xs font-bold uppercase tracking-wide">
                                                        {issue.department}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Issue Description - Main Focus */}
                                        <h4 className="text-xl font-bold text-[#171915] mb-4 leading-relaxed pr-4">
                                            {issue.description}
                                        </h4>

                                        {/* Regulation Reference - Subdued */}
                                        <div className="flex items-center gap-2 mb-5">
                                            <FileText className="w-3.5 h-3.5 text-[#858A77]" />
                                            <span className="text-xs text-[#858A77] font-medium">
                                                {issue.regulation_reference}
                                            </span>
                                        </div>

                                        {/* Bottom Actions */}
                                        <div className="flex items-center justify-between gap-4 pt-4 border-t border-[#D0D1C9]/50">
                                            <button
                                                onClick={() => toggleHelp(i)}
                                                className="group/btn flex items-center gap-2 text-sm text-[#505645] hover:text-[#171915] font-medium transition-all"
                                            >
                                                <Info className="w-4 h-4" />
                                                <span>Why is this required?</span>
                                                <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-300 ${expandedHelp.has(i) ? 'rotate-90' : 'group-hover/btn:translate-x-0.5'}`} />
                                            </button>
                                        </div>

                                        {/* Expanded Advisor Note */}
                                        {expandedHelp.has(i) && (
                                            <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-[#505645]/5 to-[#858A77]/5 border border-[#D0D1C9] animate-in slide-in-from-top-2 duration-300">
                                                <div className="flex gap-3">
                                                    <div className="flex-shrink-0">
                                                        <div className="w-8 h-8 rounded-full bg-[#505645] flex items-center justify-center">
                                                            <Info className="w-4 h-4 text-white" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-[#505645] uppercase tracking-wide mb-2">Advisor Note</p>
                                                        <p className="text-sm text-[#404537] leading-relaxed">
                                                            Compliance with <strong>{issue.regulation_reference}</strong> is critical for <strong>{issue.department}</strong> clearance.
                                                            Failure to address this commonly leads to rejection during the field inspection phase.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {report.issues.length === 0 && (
                            <div className="p-12 text-center text-gray-500 bg-white rounded-[2rem] border border-dashed border-[#D0D1C9]">
                                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-[#171915]">No Issues Detected</h3>
                                <p className="text-[#858A77]">Your application meets all preliminary compliance checks.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return null; // Fallback
}
