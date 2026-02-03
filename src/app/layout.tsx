import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Kaptár Napló',
  description: 'Modern kaptárkezelő alkalmazás méhészeknek.',
  manifest: '/manifest.json',
  themeColor: '#FBBF24',
  applicationName: 'Kaptár Napló',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Kaptár Napló',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased bg-background">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
