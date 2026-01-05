'use client';

import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText, Scale, ArrowRight, Shield,
  Factory, CheckCircle, ArrowUpRight, BarChart3, Users, Sparkles, Zap, TrendingUp
} from "lucide-react";

export default function Home() {
  return (
    <div className="h-screen bg-[#F4F5F4] flex flex-col p-4 md:p-6 overflow-hidden w-full">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto w-full flex flex-col justify-center h-full">

        {/* Header */}
        <div className="text-center space-y-1.5 max-w-3xl mx-auto mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#D0D1C9] shadow-sm mb-2">
            <Shield className="w-3 h-3 text-[#505645]" />
            <span className="text-[10px] font-bold tracking-wider text-[#505645] uppercase">Official Government Portal</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-sans font-bold text-[#171915] leading-[0.95] tracking-tight">
            Compliance for <br />
            <span className="font-serif italic font-normal text-[#505645]">Modern Industry</span>
          </h1>
          <p className="text-sm text-[#858A77] max-w-lg mx-auto leading-relaxed">
            AI-powered verification for businesses and regulators. Streamlining the path to environmental safety.
          </p>
        </div>

        {/* Enhanced Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 w-full flex-1 max-h-[calc(100vh-240px)]">

          {/* Card 1: Main Application Portal - Full width on mobile, span 8 on desktop */}
          <Link href="/applicant" className="md:col-span-8 group h-full">
            <div className="h-full bg-[#171915] rounded-[2rem] p-5 md:p-6 text-white relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.01]">
              {/* Decorative shapes */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/10 transition-colors"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-24 -mb-24 blur-2xl"></div>

              {/* Geometric accent shapes */}
              <div className="absolute top-1/4 right-1/4 w-32 h-32 border border-white/10 rounded-3xl rotate-12 group-hover:rotate-45 transition-transform duration-700"></div>
              <div className="absolute bottom-1/3 right-1/3 w-20 h-20 bg-white/5 rounded-2xl -rotate-12 group-hover:rotate-12 transition-transform duration-700"></div>

              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <ArrowUpRight className="w-6 h-6 text-white/50 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                </div>

                <div className="mt-auto">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-3">
                    <Sparkles className="w-3 h-3 text-white/80" />
                    <span className="text-[10px] font-bold tracking-wider text-white/80 uppercase">AI-Powered</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-2 leading-tight">Start New Application</h2>
                  <p className="text-white/60 text-sm md:text-base max-w-md mb-4 leading-relaxed">
                    Submit proposals for manufacturing, commercial, or residential projects with instant AI verification.
                  </p>
                  <div className="inline-flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-wider bg-white text-[#171915] px-5 py-2.5 rounded-full hover:bg-[#F4F5F4] transition-colors shadow-lg">
                    Access Portal <ArrowRight className="w-3 h-3 ml-1" />
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Card 2: Stats Grid - Span 4 */}
          <div className="md:col-span-4 grid grid-rows-2 gap-2.5 h-full">
            {/* System Status */}
            <div className="bg-[#E8E8E3] rounded-[2rem] p-4 relative overflow-hidden border border-transparent hover:border-[#D0D1C9] transition-all group">
              {/* Decorative circle */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/40 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 border-2 border-[#D0D1C9] rounded-full opacity-30"></div>

              <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex items-center gap-2 text-[#505645]">
                  <div className="p-2 bg-white rounded-lg">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider">System Status</span>
                </div>
                <div>
                  <span className="text-4xl md:text-5xl font-serif italic text-[#171915] block mb-1">98.5%</span>
                  <span className="text-xs text-[#858A77] font-medium">Compliance Rate</span>
                </div>
              </div>
            </div>

            {/* Active Users */}
            <div className="bg-[#505645] rounded-[2rem] p-4 text-white relative overflow-hidden group">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 border border-white/20 rounded-2xl rotate-45"></div>

              <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex items-center gap-2 text-white/70">
                  <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider">Active Users</span>
                </div>
                <div>
                  <span className="text-4xl md:text-5xl font-serif italic block mb-1">12k+</span>
                  <span className="text-xs text-white/60 font-medium">Registered Businesses</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Feature Highlights - Span 5 */}
          <div className="md:col-span-5 bg-white rounded-[2rem] p-4 border border-[#D0D1C9] relative overflow-hidden hover:border-[#505645] transition-all group h-full">
            {/* Decorative shapes */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#F4F5F4] rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 border-2 border-[#E8E8E3] rounded-3xl -ml-12 -mb-12 rotate-12"></div>

            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center gap-2 text-[#505645] mb-4">
                <div className="p-2 bg-[#F4F5F4] rounded-lg">
                  <Zap className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">Key Features</span>
              </div>

              <div className="space-y-3 flex-1">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#E8E8E3] rounded-lg mt-0.5 flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-[#505645]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#171915] text-sm mb-0.5">AI Document Analysis</h3>
                    <p className="text-xs text-[#858A77] leading-relaxed">Instant extraction and verification</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#E8E8E3] rounded-lg mt-0.5 flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-[#505645]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#171915] text-sm mb-0.5">Real-time Processing</h3>
                    <p className="text-xs text-[#858A77] leading-relaxed">Reports in under 60 seconds</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#E8E8E3] rounded-lg mt-0.5 flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-[#505645]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#171915] text-sm mb-0.5">14 Regulations Checked</h3>
                    <p className="text-xs text-[#858A77] leading-relaxed">Comprehensive environmental coverage</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Quick Access - Span 3 */}
          <div className="md:col-span-3 bg-[#171915] rounded-[2rem] p-4 text-white relative overflow-hidden group h-full">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-12 -mt-12 blur-xl"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 border border-white/10 rounded-2xl -ml-8 -mb-8 rotate-45"></div>

            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="flex items-center gap-2 text-white/70">
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                  <Factory className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">Industries</span>
              </div>
              <div>
                <span className="text-3xl md:text-4xl font-serif italic block mb-1">3</span>
                <span className="text-xs text-white/60 font-medium">Supported Categories</span>
                <div className="mt-3 space-y-1.5">
                  <div className="text-xs text-white/80 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/60"></div>
                    Manufacturing
                  </div>
                  <div className="text-xs text-white/80 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/60"></div>
                    Commercial
                  </div>
                  <div className="text-xs text-white/80 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/60"></div>
                    Residential
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 5: Regulations Info - Span 4 */}
          <div className="md:col-span-4 bg-gradient-to-br from-white to-[#F4F5F4] rounded-[2rem] p-4 border border-[#D0D1C9] relative overflow-hidden hover:shadow-lg transition-all group h-full">
            {/* Decorative shapes */}
            <div className="absolute -top-6 -right-6 w-28 h-28 border-2 border-[#E8E8E3] rounded-full opacity-50"></div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-[#E8E8E3] rounded-3xl rotate-12 opacity-40"></div>

            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="flex items-center gap-2 text-[#505645]">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">Regulations</span>
              </div>
              <div>
                <span className="text-4xl md:text-5xl font-serif italic text-[#171915] block mb-1">14</span>
                <span className="text-xs text-[#858A77] font-medium">Auto-Checked Acts</span>
                <p className="text-xs text-[#858A77] mt-2 leading-relaxed">
                  Comprehensive compliance verification across environmental regulations
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Info */}
        <footer className="mt-3 text-center text-xs text-[#858A77] opacity-60">
          <p>© 2026 CivicAssist · Government of India Compliance Portal</p>
        </footer>
      </section>
    </div>
  );
}
