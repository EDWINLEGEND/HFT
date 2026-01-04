'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface HeaderProps {
    currentRole?: 'applicant' | 'officer' | 'home';
}

export default function Header({ currentRole = 'home' }: HeaderProps) {
    const router = useRouter();

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const role = e.target.value;
        if (role === 'applicant') router.push('/applicant');
        else if (role === 'officer') router.push('/officer');
        else router.push('/');
    };

    return (
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="hover:opacity-80 transition">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">⚖️</span>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800 leading-tight">CivicAssist</h1>
                            <p className="text-xs text-slate-500 font-medium">AI-Assisted Compliance</p>
                        </div>
                    </div>
                </Link>

                {/* Role Switcher */}
                <div className="flex items-center gap-3">
                    <label htmlFor="role-select" className="text-sm font-medium text-slate-600 hidden sm:block">
                        Current Mode:
                    </label>
                    <select
                        id="role-select"
                        value={currentRole}
                        onChange={handleRoleChange}
                        className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 min-w-[150px]"
                    >
                        <option value="home">Select Role...</option>
                        <option value="applicant">📝 Applicant</option>
                        <option value="officer">⚖️ Officer</option>
                    </select>
                </div>
            </div>
        </header>
    );
}
