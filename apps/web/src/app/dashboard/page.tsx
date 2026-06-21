'use client';

import React, { useState } from 'react';
import Header from '../../components/header';
import { SessionSetupContainer } from '../../components/session-setup';
import { TutorSessionContainer } from '../../components/tutor-session';
import { EvaluationDashboardContainer } from '../../components/evaluation-dashboard';
import { ConversationMode, ConversationTurn } from '@language-tutor/shared-types';

type Step = 'setup' | 'session' | 'evaluation';

interface SessionConfig {
  mode: ConversationMode;
  scenario: string;
  apiKey: string;
  voice: string;
}

export default function DashboardPage() {
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

  return (
    <div className="h-full bg-background flex flex-col font-sans">
      <div className="bg-mesh" aria-hidden="true" />
      <Header />

      <main className="flex-1 flex flex-col min-h-0">
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

        {step === 'evaluation' && config && (
          <EvaluationDashboardContainer
            history={history}
            config={config}
            onRestart={handleBackToSetup}
          />
        )}
      </main>
    </div>
  );
}
