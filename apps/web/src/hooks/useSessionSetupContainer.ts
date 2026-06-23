'use client';

import React, { useState, useEffect } from 'react';
import { ConversationMode } from '@language-tutor/shared-types';

interface UseSessionSetupContainerProps {
  onStartSession: (config: {
    mode: ConversationMode;
    scenario: string;
    apiKey: string;
    voice: string;
  }) => void;
}
const initialApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

export function useSessionSetupContainer({
  onStartSession,
}: UseSessionSetupContainerProps) {
  const [mode, setMode] = useState<ConversationMode | null>(null);
  const [scenario, setScenario] = useState<string>('');
  const [apiKey, setApiKey] = useState('');
  const [voice, setVoice] = useState('en-US-AriaNeural');

  const [showKey, setShowKey] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('language-tutor-api-key') || initialApiKey;
      const savedVoice =
        localStorage.getItem('language-tutor-voice') || 'en-US-AriaNeural';
      setApiKey(savedKey);
      setVoice(savedVoice);
    }
  }, []);

  useEffect(() => {
    if (mode === 'ielts') {
      setScenario('ielts-part-1');
    } else if (mode === 'business') {
      setScenario('job-interview');
    } else if (mode === 'casual') {
      setScenario('general-chitchat');
    } else {
      setScenario('');
    }
  }, [mode]);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!mode) {
      setErrorMsg('Please select a learning mode to continue.');
      return;
    }

    if (!apiKey.trim()) {
      setErrorMsg('A Gemini API key is required to start your session.');
      return;
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('language-tutor-api-key', apiKey.trim());
      localStorage.setItem('language-tutor-voice', voice);
    }

    setIsStarting(true);
    setTimeout(() => {
      onStartSession({ mode, scenario, apiKey: apiKey.trim(), voice });
      setIsStarting(false);
    }, 400);
  };

  const isFormValid = mode !== null && apiKey.trim() !== '';

  return {
    mode,
    setMode,
    scenario,
    setScenario,
    apiKey,
    setApiKey,
    voice,
    setVoice,
    showKey,
    setShowKey,
    errorMsg,
    setErrorMsg,
    isMounted,
    isStarting,
    isFormValid,
    handleStart,
  };
}
