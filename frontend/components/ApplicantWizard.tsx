'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import type { IndustrialApplication } from '@/lib/types';

interface ApplicantWizardProps {
    onComplete: (data: IndustrialApplication) => void;
    initialData?: Partial<IndustrialApplication>;
}

export default function ApplicantWizard({ onComplete, initialData }: ApplicantWizardProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<IndustrialApplication>({
        industry_name: initialData?.industry_name || '',
        square_feet: initialData?.square_feet || '',
        water_source: initialData?.water_source || '',
        drainage: initialData?.drainage || '',
        air_pollution: initialData?.air_pollution || '',
        waste_management: initialData?.waste_management || '',
        nearby_homes: initialData?.nearby_homes || '',
        water_level_depth: initialData?.water_level_depth || '',
        document_url: initialData?.document_url
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const handleSubmit = () => {
        onComplete(formData);
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                    <span className={step >= 1 ? 'text-[#00A9A0]' : ''}>1. Basic Info</span>
                    <span className={step >= 2 ? 'text-[#00A9A0]' : ''}>2. Site Details</span>
                    <span className={step >= 3 ? 'text-[#00A9A0]' : ''}>3. Environmental</span>
                </div>
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#00A9A0] transition-all duration-300 ease-out"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>
            </div>

            <Card className="border-none shadow-xl shadow-gray-100/50">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                        {step === 1 && "Basic Information"}
                        {step === 2 && "Site & Resources"}
                        {step === 3 && "Environmental Impact"}
                    </CardTitle>
                    <CardDescription className="text-base text-gray-500">
                        {step === 1 && "Let's start with the basics of your establishment."}
                        {step === 2 && "Tell us about the location and resource usage."}
                        {step === 3 && "How do you manage waste and pollution?"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    {step === 1 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <Label htmlFor="industry_name">Industry / Establishment Name</Label>
                                <Input
                                    id="industry_name"
                                    name="industry_name"
                                    value={formData.industry_name}
                                    onChange={handleChange}
                                    placeholder="e.g. GreenLeaf Processing Unit"
                                    className="h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="square_feet">Total Area (sq ft)</Label>
                                <Input
                                    id="square_feet"
                                    name="square_feet"
                                    value={formData.square_feet}
                                    onChange={handleChange}
                                    placeholder="e.g. 5000"
                                    className="h-12"
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <Label htmlFor="nearby_homes">Distance to Nearest Homes</Label>
                                <Input
                                    id="nearby_homes"
                                    name="nearby_homes"
                                    value={formData.nearby_homes}
                                    onChange={handleChange}
                                    placeholder="e.g. 500 meters"
                                    className="h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="water_source">Water Source</Label>
                                <Input
                                    id="water_source"
                                    name="water_source"
                                    value={formData.water_source}
                                    onChange={handleChange}
                                    placeholder="e.g. Municipal Supply, Borewell"
                                    className="h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="water_level_depth">Groundwater Depth</Label>
                                <Input
                                    id="water_level_depth"
                                    name="water_level_depth"
                                    value={formData.water_level_depth}
                                    onChange={handleChange}
                                    placeholder="e.g. 25 feet"
                                    className="h-12"
                                />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <Label htmlFor="drainage">Drainage System</Label>
                                <Input
                                    id="drainage"
                                    name="drainage"
                                    value={formData.drainage}
                                    onChange={handleChange}
                                    placeholder="e.g. Connected to city sewer"
                                    className="h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="waste_management">Waste Management Plan</Label>
                                <Textarea
                                    id="waste_management"
                                    name="waste_management"
                                    value={formData.waste_management}
                                    onChange={handleChange}
                                    placeholder="Describe how you handle different types of waste..."
                                    className="min-h-[100px] resize-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="air_pollution">Air Pollution Control Measures</Label>
                                <Textarea
                                    id="air_pollution"
                                    name="air_pollution"
                                    value={formData.air_pollution}
                                    onChange={handleChange}
                                    placeholder="Describe filters, stacks, or other measures..."
                                    className="min-h-[100px] resize-none"
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between pt-6">
                        {step > 1 ? (
                            <Button variant="outline" onClick={prevStep} className="h-12 px-6">
                                <ArrowLeft className="w-4 h-4 mr-2" /> Back
                            </Button>
                        ) : (
                            <div /> // Spacer
                        )}

                        {step < 3 ? (
                            <Button onClick={nextStep} className="bg-[#00A9A0] hover:bg-[#008780] h-12 px-8 text-white rounded-xl shadow-lg shadow-[#00A9A0]/20">
                                Next Step <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <Button onClick={handleSubmit} className="bg-[#00A9A0] hover:bg-[#008780] h-12 px-8 text-white rounded-xl shadow-lg shadow-[#00A9A0]/20">
                                Analyze Compliance <CheckCircle className="w-4 h-4 ml-2" />
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
