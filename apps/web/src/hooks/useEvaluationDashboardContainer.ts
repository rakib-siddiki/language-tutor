'use client';

import { useEffect, useState } from 'react';
import { ConversationMode, ConversationTurn, ScoreReport } from '@language-tutor/shared-types';

interface UseEvaluationDashboardContainerProps {
  history: ConversationTurn[];
  config: {
    mode: ConversationMode;
    scenario: string;
    apiKey: string;
  };
  onRestart: () => void;
}

export function useEvaluationDashboardContainer({
  history,
  config,
  onRestart,
}: UseEvaluationDashboardContainerProps) {
  const [report, setReport] = useState<ScoreReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [animateWidths, setAnimateWidths] = useState(false);

  useEffect(() => {
    const fetchEvaluation = async () => {
      setLoading(true);
      setError(null);
      
      const apiBase = process.env.NEXT_PUBLIC_API_URL || '';

      try {
        const response = await fetch(`${apiBase}/api/tutor/evaluate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': config.apiKey,
          },
          body: JSON.stringify({
            history,
            mode: config.mode,
            scenario: config.scenario,
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || `Evaluation Error: ${response.statusText}`);
        }

        const data = await response.json();
        setReport(data);
        
        // Trigger sliding widths animation
        setTimeout(() => setAnimateWidths(true), 150);
      } catch (err: any) {
        console.error('Error fetching session evaluation:', err);
        setError(err.message || 'Failed to analyze conversation. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (history && history.length > 0) {
      fetchEvaluation();
    } else {
      setError('Cannot evaluate an empty session. Please speak to the tutor first.');
      setLoading(false);
    }
  }, [history, config]);

  const handlePrint = () => {
    window.print();
  };

  return {
    report,
    loading,
    error,
    animateWidths,
    handlePrint,
  };
}
