'use client';

import React, { useState } from 'react';
import Header from '../components/header';
import { SessionSetupContainer } from '../components/session-setup';
import { TutorSessionContainer } from '../components/tutor-session';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Badge } from '@language-tutor/ui';
import { ConversationMode, ConversationTurn } from '@language-tutor/shared-types';
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
  const [history, setHistory] = useState<ConversationTurn[]>([]);

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
          <TutorSessionContainer
            config={config}
            onEndSession={(sessionHistory) => {
              setHistory(sessionHistory);
              setStep('evaluation');
            }}
            onBackToSetup={handleBackToSetup}
          />
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
