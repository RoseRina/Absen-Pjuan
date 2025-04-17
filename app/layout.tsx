import type { Metadata } from 'next';
import './globals.css';
import '@fontsource-variable/nunito';

export const metadata: Metadata = {
  title: 'Absensi Pejuang Cuan',
  description: 'Sistem Absensi Pejuang Cuan',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-['Nunito_Variable']">{children}</body>
    </html>
  );
}
