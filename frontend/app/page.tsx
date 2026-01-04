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
    <div className="h-screen bg-[#F4F5F4] flex flex-col p-4 md:p-6 overflow-hidden w-full">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto w-full flex flex-col h-full justify-center">

        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-6 md:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#D0D1C9] shadow-sm mb-2">
            <Shield className="w-3 h-3 text-[#505645]" />
            <span className="text-[10px] font-bold tracking-wider text-[#505645] uppercase">Official Government Portal</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-sans font-bold text-[#171915] leading-[0.95] tracking-tight">
            Compliance for <br />
            <span className="font-serif italic font-normal text-[#505645]">Modern Industry</span>
          </h1>
          <p className="text-lg text-[#858A77] max-w-lg mx-auto leading-relaxed">
            AI-powered verification for businesses and regulators. Streamlining the path to environmental safety.
          </p>
        </div>

        {/* Bento Grid layout with fixed constraints to prevent scrolling */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 w-full h-[65vh] md:h-[60vh]">

          {/* Card 1: Applicant (Main Action) - Span 7 */}
          <Link href="/applicant" className="md:col-span-7 group h-full">
            <div className="h-full bg-[#171915] rounded-[2rem] p-6 md:p-8 text-white relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.01]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/10 transition-colors"></div>

              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <ArrowUpRight className="w-6 h-6 text-white/50 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-2">Start New Application</h2>
                  <p className="text-white/60 text-sm md:text-base max-w-sm mb-4 md:mb-6">
                    Submit proposals for manufacturing, commercial, or residential projects.
                  </p>
                  <div className="inline-flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-wider bg-white text-[#171915] px-5 py-2.5 rounded-full hover:bg-[#F4F5F4] transition-colors">
                    Access Portal <ArrowRight className="w-3 h-3 ml-1" />
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Card 2: Officer (Secondary Action) - Span 5 */}
          <Link href="/officer" className="md:col-span-5 group h-full">
            <div className="h-full bg-white rounded-[2rem] p-6 md:p-8 border border-[#D0D1C9] relative overflow-hidden transition-all duration-500 hover:border-[#505645] hover:shadow-xl hover:scale-[1.01]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#F4F5F4] rounded-full -mr-16 -mt-16 blur-3xl"></div>

              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-[#F4F5F4] rounded-xl">
                    <Scale className="w-6 h-6 text-[#505645]" />
                  </div>
                  <ArrowUpRight className="w-6 h-6 text-[#D0D1C9] group-hover:text-[#505645] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                </div>

                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#171915] mb-2">Officer Dashboard</h2>
                  <p className="text-[#858A77] text-sm md:text-base mb-6">
                    Review and verify compliance.
                  </p>
                  <div className="inline-flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-wider text-[#505645] group-hover:gap-3 transition-all">
                    Login securely <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Card 3: Stats - Span 4 */}
          <div className="hidden md:flex md:col-span-4 bg-[#E8E8E3] rounded-[2rem] p-6 flex-col justify-between border border-transparent hover:border-[#D0D1C9] transition-colors h-[180px]">
            <div className="flex items-center gap-3 text-[#505645]">
              <BarChart3 className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">System Status</span>
            </div>
            <div>
              <span className="text-4xl font-serif italic text-[#171915] block mb-1">98.5%</span>
              <span className="text-xs text-[#858A77]">Compliance Rate</span>
            </div>
          </div>

          {/* Card 4: Info - Span 4 */}
          <div className="hidden md:flex md:col-span-4 bg-[#505645] rounded-[2rem] p-6 flex-col justify-between text-white h-[180px]">
            <div className="flex items-center gap-3 text-white/70">
              <Users className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Active Users</span>
            </div>
            <div>
              <span className="text-4xl font-serif italic block mb-1">12k+</span>
              <span className="text-xs text-white/60">Registered Businesses</span>
            </div>
          </div>

          {/* Card 5: Regulations - Span 4 */}
          <div className="hidden md:flex md:col-span-4 bg-white rounded-[2rem] p-6 flex-col justify-between border border-[#D0D1C9] h-[180px]">
            <div className="flex items-center gap-3 text-[#505645]">
              <CheckCircle className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Regulations</span>
            </div>
            <div>
              <span className="text-4xl font-serif italic text-[#171915] block mb-1">14</span>
              <span className="text-xs text-[#858A77]">Auto-Checked Acts</span>
            </div>
          </div>

        </div>

        {/* Footer Info - Compact for single page view */}
        <footer className="mt-8 text-center text-xs text-[#858A77] opacity-60">
          <p>© 2026 CivicAssist · Government of India Compliance Portal</p>
        </footer>
      </section>
    </div>
  );
}
