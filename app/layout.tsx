import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sistem Absensi Pejuang Cuan',
  description: 'Sistem absensi online untuk anggota grup Pejuang Cuan',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>{children}</body>
    </html>
  );
}
