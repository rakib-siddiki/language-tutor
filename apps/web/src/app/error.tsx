'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter, Button } from '@language-tutor/ui';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service if available
    console.error('Next.js route-level error boundary caught an exception:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-destructive/20 bg-card shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <CardHeader className="text-center border-b border-border/40 pb-6">
          <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <CardTitle className="font-outfit text-2xl font-bold text-destructive">
            Something went wrong
          </CardTitle>
          <CardDescription className="font-sans text-xs">
            An unexpected error occurred in the application.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6 space-y-4">
          <div className="p-3 rounded-lg bg-secondary/50 border border-border font-mono text-[11px] text-muted-foreground overflow-auto max-h-32 leading-relaxed">
            {error?.message || 'Unknown application rendering error'}
          </div>
          <p className="text-xs text-muted-foreground text-center">
            You can try to recover by resetting the page segment or reloading the application.
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
  );
}
