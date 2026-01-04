'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Scale, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="text-center mb-12 max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            Welcome to CivicAssist
          </h1>
          <p className="text-lg text-muted-foreground">
            Select your role to access the compliance verification portal.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
          {/* Applicant Card */}
          <Link href="/applicant" className="group">
            <Card className="h-full hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer">
              <CardHeader className="text-center items-center pt-8">
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-2xl group-hover:text-primary transition-colors">Industrial Applicant</CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-8">
                <CardDescription className="text-base mb-6">
                  Submit applications, check compliance against regulations, and get instant feedback.
                </CardDescription>
                <Button variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground">
                  Login as Applicant <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Officer Card */}
          <Link href="/officer" className="group">
            <Card className="h-full hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer">
              <CardHeader className="text-center items-center pt-8">
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <Scale className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-2xl group-hover:text-primary transition-colors">Government Officer</CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-8">
                <CardDescription className="text-base mb-6">
                  Review submitted applications, analyze compliance reports, and make informed decisions.
                </CardDescription>
                <Button variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground">
                  Login as Officer <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="mt-16 text-center text-muted-foreground text-sm">
          <p>Secure Government Gateway • v0.5.0</p>
        </div>
      </main>
    </div>
  );
}
