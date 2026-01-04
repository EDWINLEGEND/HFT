import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CivicAssist - AI-Assisted Industrial Compliance',
  description: 'Human-in-the-loop compliance verification for industrial applications',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
