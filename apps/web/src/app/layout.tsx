import type { Metadata } from 'next';
import { Inter, Outfit, Geist } from 'next/font/google';
import './globals.css';
import { cn } from "@/components/ui";
import { ThemeProvider } from '../components/theme-provider';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'Language Tutor — AI-Powered Speaking Partner',
  description:
    'Zero-cost, real-time conversational language tutor for IELTS Speaking prep, Business English, and Casual practice. Powered by Gemini AI.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("h-full font-sans", geist.variable)}>
      <body className={`${inter.variable} ${outfit.variable} h-full font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="tutor-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
