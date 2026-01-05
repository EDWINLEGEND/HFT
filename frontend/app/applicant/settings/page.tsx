'use client';

import { useState } from 'react';
import {
    User,
    Bell,
    Shield,
    Moon,
    Smartphone,
    Mail,
    Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';

export default function SettingsPage() {
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [marketingEmails, setMarketingEmails] = useState(false);
    const [compactMode, setCompactMode] = useState(false);

    return (
        <div className="min-h-screen bg-[#F4F5F4] p-4 md:p-8 font-sans text-[#171915]">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-4xl font-heading font-serif italic text-[#171915]">Settings</h1>
                    <p className="text-[#858A77]">Manage your account preferences and application settings.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">

                    {/* Navigation Sidebar (Visual Only for now) */}
                    <nav className="space-y-1 hidden md:block">
                        <SettingsTab active label="General" icon={User} />
                        <SettingsTab label="Notifications" icon={Bell} />
                        <SettingsTab label="Security" icon={Shield} />
                        <SettingsTab label="Appearance" icon={Moon} />
                    </nav>

                    {/* Main Content Area */}
                    <div className="space-y-6">

                        {/* Profile Section */}
                        <Card className="p-6 bg-white border border-[#E8E8E3] shadow-sm space-y-6">
                            <div className="flex items-center justify-between border-b border-[#E8E8E3] pb-4">
                                <div className="space-y-1">
                                    <h2 className="text-lg font-bold font-heading">Profile Information</h2>
                                    <p className="text-xs text-[#858A77]">Update your account details</p>
                                </div>
                                <User className="w-5 h-5 text-[#858A77]" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="text-xs font-bold uppercase tracking-wider text-[#858A77]">First Name</Label>
                                    <Input id="firstName" defaultValue="John" className="bg-[#F9F9F8] border-[#E8E8E3]" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className="text-xs font-bold uppercase tracking-wider text-[#858A77]">Last Name</Label>
                                    <Input id="lastName" defaultValue="Doe" className="bg-[#F9F9F8] border-[#E8E8E3]" />
                                </div>
                                <div className="col-span-1 md:col-span-2 space-y-2">
                                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-[#858A77]">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[#858A77]" />
                                        <Input id="email" defaultValue="applicant@civicassist.gov" className="pl-9 bg-[#F9F9F8] border-[#E8E8E3]" disabled />
                                    </div>
                                    <p className="text-[10px] text-[#858A77]">Contact support to change your email address.</p>
                                </div>
                            </div>
                        </Card>

                        {/* Notifications Section */}
                        <Card className="p-6 bg-white border border-[#E8E8E3] shadow-sm space-y-6">
                            <div className="flex items-center justify-between border-b border-[#E8E8E3] pb-4">
                                <div className="space-y-1">
                                    <h2 className="text-lg font-bold font-heading">Notifications</h2>
                                    <p className="text-xs text-[#858A77]">Decide how we contact you</p>
                                </div>
                                <Bell className="w-5 h-5 text-[#858A77]" />
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-semibold text-[#171915]">Application Updates</Label>
                                        <p className="text-xs text-[#858A77]">Receive emails when your application status changes</p>
                                    </div>
                                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-semibold text-[#171915]">Push Notifications</Label>
                                        <p className="text-xs text-[#858A77]">Receive push notifications on your device</p>
                                    </div>
                                    <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-semibold text-[#171915]">Marketing Emails</Label>
                                        <p className="text-xs text-[#858A77]">Receive news and updates about CivicAssist (Optional)</p>
                                    </div>
                                    <Switch checked={marketingEmails} onCheckedChange={setMarketingEmails} />
                                </div>
                            </div>
                        </Card>

                        {/* Preferences Section */}
                        <Card className="p-6 bg-white border border-[#E8E8E3] shadow-sm space-y-6">
                            <div className="flex items-center justify-between border-b border-[#E8E8E3] pb-4">
                                <div className="space-y-1">
                                    <h2 className="text-lg font-bold font-heading">Preferences</h2>
                                    <p className="text-xs text-[#858A77]">Customize your experience</p>
                                </div>
                                <Globe className="w-5 h-5 text-[#858A77]" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-[#858A77]">Language</Label>
                                    <select className="w-full h-10 px-3 bg-[#F9F9F8] border border-[#E8E8E3] rounded-md text-sm text-[#171915] focus:outline-none focus:ring-2 focus:ring-[#505645]/20">
                                        <option>English (US)</option>
                                        <option>Hindi</option>
                                        <option>Marathi</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-[#858A77]">Timezone</Label>
                                    <select className="w-full h-10 px-3 bg-[#F9F9F8] border border-[#E8E8E3] rounded-md text-sm text-[#171915] focus:outline-none focus:ring-2 focus:ring-[#505645]/20">
                                        <option>IST (GMT+05:30)</option>
                                        <option>UTC (GMT+00:00)</option>
                                    </select>
                                </div>
                            </div>
                        </Card>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-4 pt-4">
                            <Button variant="ghost" className="text-[#858A77] hover:text-[#171915]">Cancel</Button>
                            <Button className="bg-[#505645] hover:bg-[#404537] text-white font-semibold px-8 shadow-md">
                                Save Changes
                            </Button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

function SettingsTab({ active, label, icon: Icon }: { active?: boolean; label: string; icon: any }) {
    return (
        <button className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${active
                ? 'bg-white text-[#505645] shadow-sm border border-[#E8E8E3]'
                : 'text-[#858A77] hover:bg-white/50 hover:text-[#171915]'
            }`}>
            <Icon className={`w-4 h-4 ${active ? 'text-[#505645]' : 'text-[#858A77]'}`} />
            {label}
        </button>
    )
}
