'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, HelpCircle } from 'lucide-react';
import { Button } from './ui/button';

interface HeaderProps {
    currentRole?: 'applicant' | 'officer' | 'home';
    showNav?: boolean;
    activeTab?: string;
}

export default function Header({ currentRole = 'home', activeTab, showNav }: HeaderProps) {
    const effectiveRole = activeTab && (activeTab === 'applicant' || activeTab === 'officer') ? activeTab : currentRole;
    const router = useRouter();
    const pathname = usePathname();

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const role = e.target.value;
        if (role === 'applicant') router.push('/applicant');
        else if (role === 'officer') router.push('/officer');
        else router.push('/');
    };

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto">
                {/* Top bar */}
                <div className="px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                        <div className="flex items-center gap-2">
                            {/* Logo icon - government seal style */}
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00A9A0] to-[#008780] flex items-center justify-center shadow-md">
                                <span className="text-white text-xl font-bold">C</span>
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-xl font-semibold text-gray-900 leading-tight tracking-tight">
                                    CivicAssist
                                </h1>
                                <p className="text-xs text-gray-500 font-medium leading-tight">
                                    AI-Assisted Compliance
                                </p>
                            </div>
                        </div>
                    </Link>

                    {/* Right side actions */}
                    <div className="flex items-center gap-3">
                        {/* Need Help Button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="hidden sm:flex items-center gap-2 text-[#00A9A0] hover:text-[#008780] hover:bg-[#00A9A0]/5"
                            onClick={() => {
                                // TODO: Implement help modal
                                alert('Help & Support - Coming soon!');
                            }}
                        >
                            <HelpCircle className="w-4 h-4" />
                            <span className="font-medium">Need help?</span>
                        </Button>

                        {/* Mobile menu button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="sm:hidden"
                        >
                            <Menu className="w-5 h-5" />
                        </Button>

                        {/* Role selector */}
                        {pathname !== '/' && (
                            <div className="hidden sm:block">
                                <select
                                    value={effectiveRole}
                                    onChange={handleRoleChange}
                                    className="px-3 py-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                                             hover:bg-gray-100 focus:ring-2 focus:ring-[#00A9A0] focus:border-[#00A9A0] 
                                             transition-colors cursor-pointer font-medium"
                                >
                                    <option value="home">Select Role...</option>
                                    <option value="applicant">📝 Applicant</option>
                                    <option value="officer">⚖️ Officer</option>
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation breadcrumb (only show on sub-pages) */}
                {pathname !== '/' && (
                    <div className="px-4 sm:px-6 lg:px-8 py-2 bg-gray-50 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm">
                            <Link href="/" className="text-gray-500 hover:text-[#00A9A0] transition-colors font-medium">
                                Home
                            </Link>
                            <span className="text-gray-400">/</span>
                            <span className="text-gray-900 font-semibold">
                                {pathname === '/applicant' ? 'Applicant Portal' : pathname === '/officer' ? 'Officer Dashboard' : 'Page'}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
