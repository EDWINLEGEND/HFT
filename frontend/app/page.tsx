'use client';

import Link from 'next/link';
import Header from '@/components/Header';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <Header />

      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="text-center mb-12 max-w-2xl">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Welcome to CivicAssist
          </h1>
          <p className="text-lg text-slate-600">
            Select your role to access the compliance verification portal.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
          {/* Applicant Card */}
          <Link
            href="/applicant"
            className="group relative bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-blue-500 rounded-t-2xl opacity-80 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">
                📝
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
                Industrial Applicant
              </h2>
              <p className="text-slate-600 mb-6">
                Submit applications, check compliance against regulations, and get instant feedback.
              </p>
              <span className="text-blue-600 font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center">
                Login as Applicant <span className="ml-2">→</span>
              </span>
            </div>
          </Link>

          {/* Officer Card */}
          <Link
            href="/officer"
            className="group relative bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-green-600 rounded-t-2xl opacity-80 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">
                ⚖️
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-green-700 transition-colors">
                Government Officer
              </h2>
              <p className="text-slate-600 mb-6">
                Review submitted applications, analyze compliance reports, and make informed decisions.
              </p>
              <span className="text-green-700 font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center">
                Login as Officer <span className="ml-2">→</span>
              </span>
            </div>
          </Link>
        </div>

        <div className="mt-16 text-center text-slate-400 text-sm">
          <p>Secure Government Gateway • v0.5.0</p>
        </div>
      </main>
    </div>
  );
}
