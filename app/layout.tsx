import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Osstart - Startup Incubator',
  description: 'Beautiful, interactive Osstart MVP dashboard for startup incubators',
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
