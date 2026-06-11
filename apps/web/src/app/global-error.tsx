'use client';

import { useEffect } from 'react';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter, Button } from '@/components/ui';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('Next.js global-error boundary caught layout exception:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-destructive/20 bg-card shadow-2xl animate-in fade-in duration-200">
            <CardHeader className="text-center border-b border-border/40 pb-6">
              <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <CardTitle className="font-outfit text-2xl font-bold text-destructive">
                Critical Error
              </CardTitle>
              <CardDescription className="font-sans text-xs">
                A critical rendering or layout error has occurred.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6 space-y-4">
              <div className="p-3 rounded-lg bg-secondary/50 border border-border font-mono text-[11px] text-muted-foreground overflow-auto max-h-32 leading-relaxed">
                {error?.message || 'Unknown critical system error'}
              </div>
              <p className="text-xs text-muted-foreground text-center">
                The application could not load its main layout. Attempt to reset the layout or reload the page.
              </p>
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row gap-2 justify-center pt-4 border-t border-border/40">
              <Button onClick={() => reset()} className="font-outfit gap-2 w-full sm:w-auto">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="font-outfit w-full sm:w-auto"
              >
                Reload Page
              </Button>
            </CardFooter>
          </Card>
        </div>
      </body>
    </html>
  );
}
