'use client';

import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText, Scale, ArrowRight, Shield,
  Factory, CheckCircle, ArrowUpRight, BarChart3, Users
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F4F5F4] flex flex-col p-4 md:p-8 overflow-y-auto w-full">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto w-full mt-8 md:mt-16 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">

        {/* Header */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#D0D1C9] shadow-sm mb-4">
            <Shield className="w-4 h-4 text-[#505645]" />
            <span className="text-xs font-bold tracking-wider text-[#505645] uppercase">Official Government Portal</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-sans font-bold text-[#171915] leading-[0.95] tracking-tight">
            Compliance for <br />
            <span className="font-serif italic font-normal text-[#505645]">Modern Industry</span>
          </h1>
          <p className="text-xl text-[#858A77] max-w-xl mx-auto leading-relaxed">
            AI-powered verification for businesses and regulators. Streamlining the path to environmental safety.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">

          {/* Card 1: Applicant (Main Action) - Span 7 */}
          <Link href="/applicant" className="md:col-span-7 group">
            <div className="h-full bg-[#171915] rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.01]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/10 transition-colors"></div>

              <div className="relative z-10 flex flex-col h-full justify-between min-h-[300px]">
                <div className="flex justify-between items-start">
                  <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <ArrowUpRight className="w-8 h-8 text-white/50 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                </div>

                <div>
                  <h2 className="text-4xl font-bold mb-4">Start New Application</h2>
                  <p className="text-white/60 text-lg max-w-md mb-8">
                    Submit proposals for manufacturing, commercial, or residential projects with AI-assisted verification.
                  </p>
                  <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider bg-white text-[#171915] px-6 py-3 rounded-full hover:bg-[#F4F5F4] transition-colors">
                    Access Portal <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Card 2: Officer (Secondary Action) - Span 5 */}
          <Link href="/officer" className="md:col-span-5 group">
            <div className="h-full bg-white rounded-[2.5rem] p-8 md:p-12 border border-[#D0D1C9] relative overflow-hidden transition-all duration-500 hover:border-[#505645] hover:shadow-xl hover:scale-[1.01]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#F4F5F4] rounded-full -mr-16 -mt-16 blur-3xl"></div>

              <div className="relative z-10 flex flex-col h-full justify-between min-h-[300px]">
                <div className="flex justify-between items-start">
                  <div className="p-4 bg-[#F4F5F4] rounded-2xl">
                    <Scale className="w-8 h-8 text-[#505645]" />
                  </div>
                  <ArrowUpRight className="w-8 h-8 text-[#D0D1C9] group-hover:text-[#505645] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-[#171915] mb-4">Officer Dashboard</h2>
                  <p className="text-[#858A77] text-lg mb-8">
                    Review pending approvals, enforce regulations, and manage compliance.
                  </p>
                  <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#505645] group-hover:gap-3 transition-all">
                    Login securely <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Card 3: Stats - Span 4 */}
          <div className="md:col-span-4 bg-[#E8E8E3] rounded-[2.5rem] p-8 flex flex-col justify-between min-h-[200px] border border-transparent hover:border-[#D0D1C9] transition-colors">
            <div className="flex items-center gap-3 text-[#505645] mb-4">
              <BarChart3 className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">System Status</span>
            </div>
            <div>
              <span className="text-5xl font-serif italic text-[#171915] block mb-1">98.5%</span>
              <span className="text-sm text-[#858A77]">Compliance Rate</span>
            </div>
          </div>

          {/* Card 4: Info - Span 4 */}
          <div className="md:col-span-4 bg-[#505645] rounded-[2.5rem] p-8 flex flex-col justify-between min-h-[200px] text-white">
            <div className="flex items-center gap-3 text-white/70 mb-4">
              <Users className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Active Users</span>
            </div>
            <div>
              <span className="text-5xl font-serif italic block mb-1">12k+</span>
              <span className="text-sm text-white/60">Registered Businesses</span>
            </div>
          </div>

          {/* Card 5: Regulations - Span 4 */}
          <div className="md:col-span-4 bg-white rounded-[2.5rem] p-8 flex flex-col justify-between min-h-[200px] border border-[#D0D1C9]">
            <div className="flex items-center gap-3 text-[#505645] mb-4">
              <CheckCircle className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Regulations</span>
            </div>
            <div>
              <span className="text-5xl font-serif italic text-[#171915] block mb-1">14</span>
              <span className="text-sm text-[#858A77]">Auto-Checked Acts</span>
            </div>
          </div>

        </div>
      </section>

      {/* Footer Info */}
      <footer className="mt-auto pt-16 text-center text-sm text-[#858A77] pb-8">
        <p>© 2026 CivicAssist · Government of India Compliance Portal</p>
      </footer>
    </div>
  );
}
