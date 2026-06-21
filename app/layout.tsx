import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Osstart | AI Startup Crash-Tester",
  description: "Validate your startup posture and generate a 30-day execution matrix.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
