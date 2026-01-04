'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, User, Briefcase, Shield, LogOut, Home, FileText, LayoutDashboard, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter, usePathname } from 'next/navigation';

export default function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const role = pathname.includes('/officer') ? 'officer' : 'applicant';

    const handleRoleChange = (value: string) => {
        router.push(`/${value}`);
        setIsOpen(false);
    };

    return (
        <>
            {/* Mobile Top Bar */}
            <div className="md:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-40 shadow-sm">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00A9A0] to-[#008780] flex items-center justify-center text-white font-bold">C</div>
                    <span className="font-bold text-gray-900">CivicAssist</span>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)}>
                    <Menu className="w-6 h-6 text-gray-700" />
                </Button>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 md:hidden animate-in fade-in duration-200" onClick={() => setIsOpen(false)}>
                    <div
                        className="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-xl p-6 flex flex-col gap-6 animate-in slide-in-from-right duration-300"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-gray-900">Menu</span>
                            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                                <X className="w-6 h-6 text-gray-500" />
                            </Button>
                        </div>

                        <div className="space-y-6 flex-1 overflow-y-auto">
                            <div className="space-y-3">
                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Navigation</h3>

                                <Link href="/" onClick={() => setIsOpen(false)} className="block">
                                    <Button variant="ghost" className="w-full justify-start">
                                        <Home className="w-4 h-4 mr-2" /> Home
                                    </Button>
                                </Link>

                                {role === 'applicant' ? (
                                    <>
                                        <Link href="/applicant" onClick={() => setIsOpen(false)} className="block">
                                            <Button variant="ghost" className="w-full justify-start bg-[#E6F7F6] text-[#00A9A0]">
                                                <FileText className="w-4 h-4 mr-2" /> My Application
                                            </Button>
                                        </Link>
                                        <Button variant="ghost" className="w-full justify-start text-gray-500">
                                            <Settings className="w-4 h-4 mr-2" /> Settings
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/officer" onClick={() => setIsOpen(false)} className="block">
                                            <Button variant="ghost" className="w-full justify-start bg-[#E6F7F6] text-[#00A9A0]">
                                                <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                                            </Button>
                                        </Link>
                                        <Button variant="ghost" className="w-full justify-start text-gray-500">
                                            <FileText className="w-4 h-4 mr-2" /> All Applications
                                        </Button>
                                        <Button variant="ghost" className="w-full justify-start text-gray-500">
                                            <Settings className="w-4 h-4 mr-2" /> System Config
                                        </Button>
                                    </>
                                )}
                            </div>

                            <div className="pt-6 border-t space-y-3">
                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Switch Role</h3>
                                <div className="flex gap-2 flex-col">
                                    <Button
                                        variant={role === 'applicant' ? 'default' : 'outline'}
                                        onClick={() => handleRoleChange('applicant')}
                                        className={role === 'applicant' ? 'bg-[#00A9A0] hover:bg-[#008780]' : ''}
                                    >
                                        <Briefcase className="w-4 h-4 mr-2" /> Applicant Mode
                                    </Button>
                                    <Button
                                        variant={role === 'officer' ? 'default' : 'outline'}
                                        onClick={() => handleRoleChange('officer')}
                                        className={role === 'officer' ? 'bg-[#00A9A0] hover:bg-[#008780]' : ''}
                                    >
                                        <Shield className="w-4 h-4 mr-2" /> Officer Mode
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                                <User className="w-5 h-5 text-gray-500" />
                            </div>
                            <div>
                                <p className="font-medium text-sm text-gray-900">Active User</p>
                                <p className="text-xs text-green-600 flex items-center gap-1">
                                    <span className="block w-2 h-2 rounded-full bg-green-500" /> Online
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
