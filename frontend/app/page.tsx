'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Scale, ArrowRight, CheckCircle, Shield, Clock } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E6F7F6] text-[#008780] rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              <span>Trusted Government Portal</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Welcome to CivicAssist
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Streamline your industrial compliance journey with AI-assisted document verification and expert review support
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-center w-12 h-12 bg-[#E6F7F6] rounded-lg mb-4 mx-auto">
                  <Clock className="w-6 h-6 text-[#00A9A0]" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">75%</div>
                <div className="text-sm text-gray-600">Faster Processing</div>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-center w-12 h-12 bg-[#E6F7F6] rounded-lg mb-4 mx-auto">
                  <CheckCircle className="w-6 h-6 text-[#00A9A0]" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">95%</div>
                <div className="text-sm text-gray-600">Accuracy Rate</div>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-center w-12 h-12 bg-[#E6F7F6] rounded-lg mb-4 mx-auto">
                  <Shield className="w-6 h-6 text-[#00A9A0]" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">100%</div>
                <div className="text-sm text-gray-600">Secure & Compliant</div>
              </div>
            </div>
          </div>
        </div>

        {/* Role Selection Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Select Your Portal</h2>
            <p className="text-lg text-gray-600">Choose your role to access the appropriate dashboard</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Applicant Card */}
            <Link href="/applicant" className="group block">
              <Card className="h-full border-2 border-gray-200 hover:border-[#00A9A0] hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00A9A0] to-[#008780] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <CardHeader className="text-center pt-10 pb-6">
                  <div className="flex justify-center mb-6">
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-md">
                      <FileText className="w-12 h-12 text-[#00A9A0]" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-[#00A9A0] transition-colors">
                    Industrial Applicant
                  </CardTitle>
                  <CardDescription className="text-base text-gray-600">
                    Submit applications and check compliance status
                  </CardDescription>
                </CardHeader>

                <CardContent className="pb-10">
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#00A9A0] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Upload and auto-fill application forms</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#00A9A0] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Get instant compliance feedback</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#00A9A0] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Track application status in real-time</span>
                    </li>
                  </ul>

                  <Button 
                    className="w-full bg-[#00A9A0] hover:bg-[#008780] text-white shadow-md group-hover:shadow-lg transition-all"
                    size="lg"
                  >
                    <span className="font-semibold">Continue as Applicant</span>
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Officer Card */}
            <Link href="/officer" className="group block">
              <Card className="h-full border-2 border-gray-200 hover:border-[#00A9A0] hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00A9A0] to-[#008780] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <CardHeader className="text-center pt-10 pb-6">
                  <div className="flex justify-center mb-6">
                    <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-md">
                      <Scale className="w-12 h-12 text-[#00A9A0]" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-[#00A9A0] transition-colors">
                    Government Officer
                  </CardTitle>
                  <CardDescription className="text-base text-gray-600">
                    Review applications with AI-assisted insights
                  </CardDescription>
                </CardHeader>

                <CardContent className="pb-10">
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#00A9A0] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">AI-powered compliance analysis</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#00A9A0] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Side-by-side document review</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#00A9A0] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Complete audit trail & decision support</span>
                    </li>
                  </ul>

                  <Button 
                    className="w-full bg-[#00A9A0] hover:bg-[#008780] text-white shadow-md group-hover:shadow-lg transition-all"
                    size="lg"
                  >
                    <span className="font-semibold">Continue as Officer</span>
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Footer Info */}
        <div className="bg-white border-t border-gray-200 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-500 text-sm">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="w-4 h-4" />
                <span className="font-medium">Secure Government Gateway</span>
              </div>
              <p>Version 1.0.0 • Built with modern security standards</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
