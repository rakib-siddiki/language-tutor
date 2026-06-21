'use client';

import React, { useEffect, useRef, useState } from 'react';

export interface Message {
  id: string;
  role: 'user' | 'tutor';
  text: string;
  corrections?: Array<{
    original: string;
    corrected: string;
    explanation: string;
  }>;
  vocabularySuggestions?: Array<{
    original: string;
    suggestion: string;
    context: string;
  }>;
  pronunciationTips?: Array<{
    word: string;
    tip: string;
  }>;
}

interface UseConversationPaneContainerProps {
  messages: Message[];
  isProcessing?: boolean;
  showCorrections?: boolean;
}

export function useConversationPaneContainer({
  messages,
  isProcessing = false,
  showCorrections = true,
}: UseConversationPaneContainerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [speakingWord, setSpeakingWord] = useState<string | null>(null);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakWord = (word: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(word);
      const savedVoice = localStorage.getItem('language-tutor-voice') || 'en-US-AriaNeural';
      const locale = savedVoice.substring(0, 5); // 'en-US'

      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = voices.find(v => v.lang.toLowerCase().startsWith(locale.toLowerCase()));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onstart = () => {
        setSpeakingWord(word);
      };

      utterance.onend = () => {
        setSpeakingWord(null);
      };

      utterance.onerror = () => {
        setSpeakingWord(null);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      if (typeof container.scrollTo === 'function') {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth',
        });
      } else {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [messages, isProcessing]);

  // Robust inline highlighting function
  const renderHighlightedText = (text: string, corrections?: any[]) => {
    if (!showCorrections || !corrections || corrections.length === 0) {
      return React.createElement(
        'span',
        { className: 'font-sans text-sm md:text-base leading-relaxed' },
        text
      );
    }

    const sortedCorrections = [...corrections].sort((a, b) => b.original.length - a.original.length);
    interface Match {
      start: number;
      end: number;
      original: string;
      corrected: string;
      explanation: string;
    }
    const matches: Match[] = [];

    for (const corr of sortedCorrections) {
      if (!corr.original) continue;
      let pos = text.indexOf(corr.original);
      while (pos !== -1) {
        const isOverlapping = matches.some(m => 
          (pos >= m.start && pos < m.end) || 
          (pos + corr.original.length > m.start && pos + corr.original.length <= m.end)
        );

        if (!isOverlapping) {
          matches.push({
            start: pos,
            end: pos + corr.original.length,
            original: corr.original,
            corrected: corr.corrected,
            explanation: corr.explanation,
          });
        }
        pos = text.indexOf(corr.original, pos + 1);
      }
    }

    matches.sort((a, b) => a.start - b.start);

    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    matches.forEach((match, idx) => {
      if (match.start > lastIndex) {
        elements.push(
          React.createElement(
            'span',
            { key: `text-${lastIndex}`, className: 'font-sans text-sm md:text-base leading-relaxed' },
            text.substring(lastIndex, match.start)
          )
        );
      }

      elements.push(
        React.createElement(
          'span',
          { key: `match-${idx}`, className: 'inline-block mx-0.5' },
          React.createElement(
            'span',
            { className: 'line-through text-destructive font-semibold decoration-wavy decoration-destructive/60 decoration-2' },
            match.original
          )
        )
      );

      lastIndex = match.end;
    });

    if (lastIndex < text.length) {
      elements.push(
        React.createElement(
          'span',
          { key: `text-${lastIndex}`, className: 'font-sans text-sm md:text-base leading-relaxed' },
          text.substring(lastIndex)
        )
      );
    }

    return React.createElement(React.Fragment, null, ...elements);
  };

  return {
    containerRef,
    speakingWord,
    speakWord,
    renderHighlightedText,
  };
}
