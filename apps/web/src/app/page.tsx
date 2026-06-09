'use client';

import React, { useState } from 'react';
import Header from '../components/header';
import { SessionSetupContainer } from '../components/session-setup';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Badge } from '@language-tutor/ui';
import { ConversationMode } from '@language-tutor/shared-types';
import { Sparkles, MessageSquare, Volume2, ArrowLeft, ArrowRight } from 'lucide-react';

type Step = 'setup' | 'session' | 'evaluation';

interface SessionConfig {
  mode: ConversationMode;
  scenario: string;
  apiKey: string;
  voice: string;
}

export default function HomePage() {
  const [step, setStep] = useState<Step>('setup');
  const [config, setConfig] = useState<SessionConfig | null>(null);

  const handleStartSession = (sessionConfig: SessionConfig) => {
    setConfig(sessionConfig);
    setStep('session');
  };

  const handleBackToSetup = () => {
    setStep('setup');
  };

  const handleEndSession = () => {
    setStep('evaluation');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 flex flex-col py-6">
        {step === 'setup' && (
          <SessionSetupContainer onStartSession={handleStartSession} />
        )}

        {step === 'session' && config && (
          <div className="container max-w-2xl mx-auto px-4 py-12 flex-1 flex flex-col justify-center">
            <Card className="border-border bg-card/50 backdrop-blur-sm shadow-xl animate-fade-in">
              <CardHeader className="text-center border-b border-border/40 pb-6">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <CardTitle className="font-outfit text-2xl font-bold">
                  Speaking Session Initialized
                </CardTitle>
                <CardDescription className="font-sans">
                  The conversation session is ready to begin.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground uppercase font-semibold">Mode</span>
                    <div className="font-outfit font-bold text-foreground capitalize flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-primary" />
                      {config.mode}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground uppercase font-semibold">Scenario</span>
                    <div className="font-sans text-sm text-foreground capitalize">
                      {config.scenario.replace(/-/g, ' ')}
                    </div>
                  </div>
                  <div className="space-y-1 col-span-2 border-t border-border/20 pt-4">
                    <span className="text-xs text-muted-foreground uppercase font-semibold flex items-center gap-1">
                      <Volume2 className="h-3.5 w-3.5" /> Voice
                    </span>
                    <div className="font-sans text-sm text-foreground font-medium">
                      {config.voice}
                    </div>
                  </div>
                  <div className="space-y-1 col-span-2 border-t border-border/20 pt-4">
                    <span className="text-xs text-muted-foreground uppercase font-semibold">API Key</span>
                    <div className="font-mono text-xs text-muted-foreground">
                      {config.apiKey.substring(0, 6)}••••••••••••••••
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 text-xs text-muted-foreground leading-relaxed">
                  <strong>Session setup complete:</strong> Next, we will connect the AudioRecorder, live transcription window, and conversational response engine in the upcoming steps.
                </div>
              </CardContent>

              <CardFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border/40">
                <Button 
                  variant="outline" 
                  onClick={handleBackToSetup} 
                  className="w-full sm:w-auto font-outfit gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Change Settings
                </Button>
                <Button 
                  onClick={handleEndSession} 
                  className="w-full sm:w-auto font-outfit gap-2 sm:ml-auto"
                >
                  Simulate Session End
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {step === 'evaluation' && (
          <div className="container max-w-2xl mx-auto px-4 py-12 flex-1 flex flex-col justify-center">
            <Card className="border-border bg-card/50 backdrop-blur-sm shadow-xl animate-fade-in">
              <CardHeader className="text-center border-b border-border/40 pb-6">
                <CardTitle className="font-outfit text-2xl font-bold">
                  Evaluation Report Placeholder
                </CardTitle>
                <CardDescription className="font-sans">
                  Simulated End-of-Session report page.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="py-8 text-center text-muted-foreground text-sm space-y-4">
                <p>
                  This view will be replaced by the animated <strong>EvaluationDashboard</strong> in Issue #9.
                </p>
                <div className="flex justify-center gap-2">
                  <Badge>Grammar Checks</Badge>
                  <Badge>Pronunciation Guide</Badge>
                  <Badge>Band Scoring</Badge>
                </div>
              </CardContent>

              <CardFooter className="flex justify-center pt-6 border-t border-border/40">
                <Button variant="outline" onClick={handleBackToSetup} className="font-outfit gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Start New Session
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
