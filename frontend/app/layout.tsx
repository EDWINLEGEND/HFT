import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import { Manrope, Instrument_Serif } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  style: ['normal', 'italic'],
  variable: "--font-instrument",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "CivicAssist | Industrial Compliance Platform",
  description: "AI-powered regulatory compliance for modern governance.",
};

import { ApplicationProvider } from '@/lib/context';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${manrope.variable} ${instrumentSerif.variable} antialiased font-sans bg-[#F9F9F8] text-[#1A1A1A] flex flex-col md:flex-row h-screen overflow-hidden`}
      >
        <ApplicationProvider>
          <Sidebar />
          <div className="flex-1 flex flex-col h-full overflow-hidden relative">
            <MobileNav />
            <main className="flex-1 overflow-y-auto w-full">
              {children}
            </main>
          </div>
        </ApplicationProvider>
      </body>
    </html>
  );
}
