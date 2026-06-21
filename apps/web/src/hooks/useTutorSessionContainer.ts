'use client';

import { useEffect, useRef, useState } from 'react';
import { useSessionReducer } from './useSessionReducer';
import { ConversationMode, ConversationTurn } from '@language-tutor/shared-types';

interface UseTutorSessionContainerProps {
  config: {
    mode: ConversationMode;
    scenario: string;
    apiKey: string;
    voice: string;
  };
  onEndSession: (history: ConversationTurn[]) => void;
  onBackToSetup: () => void;
}

export function useTutorSessionContainer({
  config,
  onEndSession,
  onBackToSetup,
}: UseTutorSessionContainerProps) {
  const [state, dispatch] = useSessionReducer();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const [usingBrowserVoice, setUsingBrowserVoice] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Proactive mic permission request and cleanup on unmount
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          stream.getTracks().forEach((track) => track.stop());
        })
        .catch((err) => {
          console.warn('Proactive microphone request denied:', err);
        });
    }

    return () => {
      cleanupAudio();
    };
  }, []);

  // 429 Rate limit countdown timer effect
  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      setCountdown(null);
      dispatch({ type: 'RESET_ERROR' });
      return;
    }

    const timer = setInterval(() => {
      setCountdown((c) => (c !== null ? c - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const cleanupAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setUsingBrowserVoice(false);
    }
  };

  const handleAudioPlayPause = () => {
    if (!audioRef.current) return;

    if (state.audioPaused) {
      audioRef.current.play()
        .then(() => {
          dispatch({ type: 'AUDIO_PLAYING' });
        })
        .catch(err => {
          console.error('Audio play failed:', err);
        });
    } else {
      audioRef.current.pause();
      dispatch({ type: 'AUDIO_PAUSED' });
    }
  };

  const handleAudioSkip = () => {
    cleanupAudio();
    dispatch({ type: 'AUDIO_ENDED' });
  };

  const playBase64Audio = (base64Audio: string, fallbackText: string) => {
    cleanupAudio();

    if (!base64Audio) {
      // Fallback to browser SpeechSynthesis
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        setUsingBrowserVoice(true);
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(fallbackText);
        const voices = window.speechSynthesis.getVoices();
        const locale = config.voice.substring(0, 5); // 'en-US'
        const matchedVoice = voices.find(v => v.lang.toLowerCase().startsWith(locale.toLowerCase()));
        if (matchedVoice) {
          utterance.voice = matchedVoice;
        }

        utterance.onend = () => {
          setUsingBrowserVoice(false);
          dispatch({ type: 'AUDIO_ENDED' });
        };
        utterance.onerror = (e) => {
          console.error('Browser SpeechSynthesis error:', e);
          setUsingBrowserVoice(false);
          dispatch({ type: 'AUDIO_ENDED' });
        };

        dispatch({ type: 'AUDIO_PLAYING' });
        window.speechSynthesis.speak(utterance);
      } else {
        dispatch({ type: 'AUDIO_ENDED' });
      }
      return;
    }

    try {
      // Convert base64 to blob URL to support streaming playback
      const binaryString = window.atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(blob);
      audioUrlRef.current = audioUrl;

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        dispatch({ type: 'AUDIO_ENDED' });
      };

      audio.onerror = (e) => {
        console.error('Audio error event:', e);
        dispatch({ type: 'AUDIO_ENDED' });
      };

      audio.play()
        .then(() => {
          dispatch({ type: 'AUDIO_PLAYING' });
        })
        .catch(err => {
          console.error('Playback failed:', err);
          dispatch({ type: 'AUDIO_ENDED' });
        });
    } catch (err) {
      console.error('Error generating audio element:', err);
      dispatch({ type: 'AUDIO_ENDED' });
    }
  };

  const handleRecordingComplete = async ({
    audioBase64,
    mimeType,
  }: {
    audioBase64: string;
    mimeType: string;
  }) => {
    cleanupAudio();
    dispatch({ type: 'STOP_RECORDING' });

    const apiBase = process.env.NEXT_PUBLIC_API_URL || '';

    try {
      // Map current messages to pure history structure
      const historyTurns: ConversationTurn[] = state.messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const response = await fetch(`${apiBase}/api/tutor/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.apiKey,
        },
        body: JSON.stringify({
          audioBase64,
          mimeType,
          history: historyTurns,
          mode: config.mode,
          scenario: config.scenario,
          voice: config.voice,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `API Error: ${response.statusText}`);
      }

      const result = await response.json();

      const userMessage = {
        id: `user-${Date.now()}`,
        role: 'user' as const,
        text: result.userTranscript,
        corrections: result.corrections,
        vocabularySuggestions: result.vocabularySuggestions,
        pronunciationTips: result.pronunciationTips,
      };

      const tutorMessage = {
        id: `tutor-${Date.now() + 1}`,
        role: 'tutor' as const,
        text: result.tutorText,
      };

      // Set successful state and play audio
      dispatch({
        type: 'API_SUCCESS',
        userMessage,
        tutorMessage,
      });

      playBase64Audio(result.audioBase64, result.tutorText);
    } catch (err: any) {
      console.error('Tutor chat loop error:', err);
      
      const isRateLimit = err.message?.includes('429') || err.message?.toLowerCase().includes('rate limit');
      if (isRateLimit) {
        setCountdown(60);
      }

      dispatch({
        type: 'API_ERROR',
        error: err.message || 'Network error connecting to the speaking examiner.',
      });
    }
  };

  const handleEnd = () => {
    cleanupAudio();
    // Map history and callback
    const historyTurns: ConversationTurn[] = state.messages.map((m) => ({
      role: m.role,
      text: m.text,
    }));
    onEndSession(historyTurns);
  };

  const handleStartRecording = () => {
    cleanupAudio();
    dispatch({ type: 'START_RECORDING' });
  };

  return {
    state,
    dispatch,
    usingBrowserVoice,
    countdown,
    handleAudioPlayPause,
    handleAudioSkip,
    handleRecordingComplete,
    handleEnd,
    handleStartRecording,
  };
}
