'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-blue-900">⚖️ CivicAssist</h1>
          <p className="text-gray-600 mt-1">AI-Assisted Industrial Compliance Verification</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Streamline Industrial Approval Process
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            CivicAssist uses AI to assist government officers and applicants in analyzing
            industrial applications against regulations. Human-in-the-loop design ensures
            all decisions remain with qualified officers.
          </p>
        </div>

        {/* Key Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-xl font-semibold mb-2">Document Analysis</h3>
            <p className="text-gray-600">
              Automated extraction and analysis of application details against government regulations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Compliance Check</h3>
            <p className="text-gray-600">
              AI-powered compliance verification with explainable insights and regulation citations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-xl font-semibold mb-2">Actionable Reports</h3>
            <p className="text-gray-600">
              Structured reports with risk levels, missing documents, and clear recommendations.
            </p>
          </div>
        </div>

        {/* User Modes */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Applicant Mode */}
          <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-blue-200">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-2xl font-bold mb-4">Applicant Mode</h3>
            <p className="text-gray-700 mb-6">
              For industries and businesses seeking approval. Run pre-submission compliance
              checks to identify missing documents and potential issues before official submission.
            </p>
            <ul className="space-y-2 mb-6 text-gray-600">
              <li>✓ Pre-submission self-check</li>
              <li>✓ Instant feedback on missing documents</li>
              <li>✓ Actionable checklists</li>
              <li>✓ Reduce resubmission cycles</li>
            </ul>
            <Link
              href="/applicant"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition"
            >
              Go to Applicant Mode →
            </Link>
          </div>

          {/* Officer Mode */}
          <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-green-200">
            <div className="text-5xl mb-4">⚖️</div>
            <h3 className="text-2xl font-bold mb-4">Officer Mode</h3>
            <p className="text-gray-700 mb-6">
              For government officials reviewing applications. Get AI-assisted compliance
              insights while maintaining full decision-making authority.
            </p>
            <ul className="space-y-2 mb-6 text-gray-600">
              <li>✓ Review applications efficiently</li>
              <li>✓ AI-generated compliance insights</li>
              <li>✓ Explainable recommendations</li>
              <li>✓ Save time on manual verification</li>
            </ul>
            <Link
              href="/officer"
              className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition"
            >
              Go to Officer Mode →
            </Link>
          </div>
        </div>

        {/* Human-in-the-Loop Notice */}
        <div className="mt-12 bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
          <h4 className="font-semibold text-blue-900 mb-2">🤝 Human-in-the-Loop Design</h4>
          <p className="text-blue-800">
            CivicAssist <strong>assists</strong>, never replaces, human decision-makers.
            All AI outputs are advisory only. Final approval decisions remain with
            qualified government officers. The system is designed to be explainable,
            traceable, and judge-defensible.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-600">
          <p className="mb-2">
            <strong>Phase 4: Frontend Implementation Complete</strong>
          </p>
          <p className="text-sm">
            Backend API: <a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">http://localhost:8000/docs</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
