import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/common/Header';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'ProLink',
  description: 'Your Professional Network.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased flex flex-col h-full">
        <AuthProvider>
          <Header />
          <main className="flex-1 overflow-y-auto">{children}</main>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
