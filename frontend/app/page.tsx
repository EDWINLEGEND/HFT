'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Scale, ArrowRight, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-transparent flex flex-col p-8 md:p-12 overflow-y-auto w-full">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto w-full mt-12 md:mt-24 space-y-8 text-center animate-in fade-in slide-in-from-bottom-8 duration-500">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.1]">
            Streamline Your <span className="text-[#00A9A0]">Industrial Compliance</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-light">
            A unified platform for businesses and officers to ensure environmental safety and regulatory adherence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-16 max-w-3xl mx-auto">
          <Link href="/applicant" className="group">
            <Card className="h-full border-2 border-transparent hover:border-[#00A9A0]/20 hover:shadow-2xl transition-all duration-300 bg-white group-hover:-translate-y-1">
              <CardHeader className="text-left pb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#E6F7F6] text-[#00A9A0] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <CardTitle className="text-2xl font-bold">I'm an Applicant</CardTitle>
                <CardDescription className="text-base text-gray-500 mt-2">
                  Submit proposals, check compliance, and track application status.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-left pt-0">
                <Button className="w-full bg-[#00A9A0] hover:bg-[#008780] text-white shadow-md group-hover:shadow-lg transition-all" size="lg">
                  <span className="font-semibold">Get Started</span>
                  <ArrowRight className="ml-2 w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/officer" className="group">
            <Card className="h-full border-2 border-transparent hover:border-[#00A9A0]/20 hover:shadow-2xl transition-all duration-300 bg-white group-hover:-translate-y-1">
              <CardHeader className="text-left pb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#E6F7F6] text-[#00A9A0] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Scale className="w-6 h-6" />
                </div>
                <CardTitle className="text-2xl font-bold">I'm an Officer</CardTitle>
                <CardDescription className="text-base text-gray-500 mt-2">
                  Review applications, verify documents, and enforce regulations.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-left pt-0">
                <Button variant="outline" className="w-full border-2 border-gray-200 hover:border-[#00A9A0] hover:text-[#00A9A0] transition-all" size="lg">
                  <span className="font-semibold">Access Dashboard</span>
                  <ArrowRight className="ml-2 w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Footer Info */}
      <footer className="mt-auto pt-24 text-center text-sm text-gray-400 pb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield className="w-4 h-4" />
          <span className="font-medium">Secure Government Gateway</span>
        </div>
        <p>© 2026 CivicAssist · Government of India Compliance Portal</p>
      </footer>
    </div>
  );
}
