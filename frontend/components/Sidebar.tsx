'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    LayoutDashboard,
    FileText,
    Settings,
    LogOut,
    User,
    Shield,
    Briefcase,
    Menu,
    Home
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [role, setRole] = useState<'applicant' | 'officer'>('applicant');

    useEffect(() => {
        if (pathname.includes('/officer')) {
            setRole('officer');
        } else if (pathname.includes('/applicant')) {
            setRole('applicant');
        }
    }, [pathname]);

    const handleRoleChange = (value: string) => {
        const newRole = value as 'applicant' | 'officer';
        setRole(newRole);
        router.push(`/${newRole}`);
    };

    return (
        <aside className="hidden md:flex flex-col w-64 bg-white/50 backdrop-blur-xl h-screen sticky top-0 shrink-0 border-r border-[#EFEFEF]">
            {/* Logo */}
            <div className="p-6">
                <Link href="/" className="flex items-center gap-3 hover:opacity-70 transition-opacity">
                    <div className="w-8 h-8 rounded-lg bg-[#2A2A2A] flex items-center justify-center text-white font-bold text-lg">
                        C
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-lg tracking-tight text-[#1A1A1A] leading-none font-heading italic">CivicAssist</span>
                    </div>
                </Link>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 space-y-6 overflow-y-auto">
                <div className="space-y-1">
                    <NavItem href="/" icon={Home} label="Overview" active={pathname === '/'} />
                </div>

                {role === 'applicant' ? (
                    <div className="space-y-1">
                        <div className="px-3 py-2 text-[10px] font-bold text-[#8A8A8A] uppercase tracking-widest mb-1">Applicant</div>
                        <NavItem href="/applicant" icon={FileText} label="Applications" active={pathname === '/applicant'} />
                        <NavItem href="#" icon={Settings} label="Settings" />
                    </div>
                ) : (
                    <div className="space-y-1">
                        <div className="px-3 py-2 text-[10px] font-bold text-[#8A8A8A] uppercase tracking-widest mb-1">Officer</div>
                        <NavItem href="/officer" icon={LayoutDashboard} label="Inbox" active={pathname === '/officer'} />
                        <NavItem href="#" icon={FileText} label="Archive" />
                        <NavItem href="#" icon={Settings} label="System" />
                    </div>
                )}
            </nav>

            {/* Footer / Profile */}
            <div className="p-3 border-t border-[#EFEFEF] bg-transparent">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="w-8 h-8 rounded-full bg-[#F5F5F5] border border-[#EFEFEF] flex items-center justify-center text-[#8A8A8A]">
                        <User className="w-4 h-4" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-semibold text-[#1A1A1A] truncate font-heading">
                            {role === 'applicant' ? 'John Doe' : 'Officer Smith'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                            {role === 'applicant' ? 'applicant@example.com' : 'officer@gov.in'}
                        </p>
                    </div>
                </div>

                <Select value={role} onValueChange={handleRoleChange}>
                    <SelectTrigger className="w-full bg-white border-[#EFEFEF] text-[#1A1A1A] h-8 text-xs font-medium hover:bg-[#F9F9F9] transition-colors shadow-none">
                        <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent className="border-[#EFEFEF] shadow-sm">
                        <SelectItem value="applicant">
                            <div className="flex items-center gap-2">
                                <Briefcase className="w-3 h-3 text-[#1A1A1A]" />
                                <span>Applicant</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="officer">
                            <div className="flex items-center gap-2">
                                <Shield className="w-3 h-3 text-[#1A1A1A]" />
                                <span>Officer</span>
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </aside>
    );
}

function NavItem({ href, icon: Icon, label, active }: { href: string; icon: any; label: string; active?: boolean }) {
    return (
        <Link href={href}>
            <Button
                variant="ghost"
                className={`w-full justify-start gap-3 px-3 py-2 h-auto text-[13px] font-medium transition-all duration-200 rounded-lg ${active
                    ? 'bg-[#F0F0F0] text-[#1A1A1A]' // Minimal active state
                    : 'text-[#6A6A6A] hover:bg-[#F9F9F9] hover:text-[#1A1A1A]' // Minimal hover
                    }`}
            >
                <Icon className={`w-4 h-4 ${active ? 'text-[#1A1A1A]' : 'text-[#8A8A8A]'}`} />
                <span>{label}</span>
            </Button>
        </Link>
    )
}
