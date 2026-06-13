'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useSessionReducer } from './useSessionReducer';
import { AudioRecorderContainer } from '../audio-recorder';
import { ConversationPaneContainer } from '../conversation-pane';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  Button, 
  Switch, 
  Label, 
  Alert, 
  AlertTitle, 
  AlertDescription,
  Badge,
  Separator
} from '@/components/ui';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  ChevronRight, 
  ArrowLeft, 
  LogOut, 
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { ConversationMode, ConversationTurn } from '@language-tutor/shared-types';

interface TutorSessionContainerProps {
  config: {
    mode: ConversationMode;
    scenario: string;
    apiKey: string;
    voice: string;
  };
  onEndSession: (history: ConversationTurn[]) => void;
  onBackToSetup: () => void;
}

export default function TutorSessionContainer({
  config,
  onEndSession,
  onBackToSetup,
}: TutorSessionContainerProps) {
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

  return (
    <div className="container max-w-6xl mx-auto px-4 pb-6 pt-2 flex-1 flex flex-col min-h-0 animate-fade-in h-full">
      {/* Session Topbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between pb-4 border-b border-border/40 mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBackToSetup}
            className="text-muted-foreground hover:text-foreground p-1 h-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Exit Setup
          </Button>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-outfit capitalize text-primary border-primary/20 bg-primary/5">
              {config.mode}
            </Badge>
            <span className="text-xs text-muted-foreground capitalize">
              {config.scenario.replace(/-/g, ' ')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Corrections Toggle Switch */}
          <div className="flex items-center space-x-2 bg-secondary/30 px-3 py-1.5 rounded-lg border border-border/30">
            <Switch 
              id="show-corrections" 
              checked={state.showCorrections}
              onCheckedChange={() => dispatch({ type: 'TOGGLE_CORRECTIONS' })}
            />
            <Label htmlFor="show-corrections" className="text-xs font-semibold cursor-pointer">
              Show Grammar Feedback
            </Label>
          </div>

          <Button 
            variant="destructive"
            size="sm"
            onClick={handleEnd}
            disabled={state.messages.length === 0}
            className="font-outfit gap-1.5 shadow-md shadow-destructive/5"
            title="Complete speaking practice and view full evaluation dashboard"
          >
            <LogOut className="h-4 w-4" />
            End & Evaluate
          </Button>
        </div>
      </div>

      {/* Rate Limit Alert */}
      {countdown !== null && (
        <Alert variant="destructive" className="mb-4 shrink-0 animate-pulse">
          <AlertTitle>Rate Limit Active</AlertTitle>
          <AlertDescription>
            Gemini free-tier rate limit hit. Please pause speaking for <strong>{countdown} seconds</strong>.
          </AlertDescription>
        </Alert>
      )}

      {/* API Errors Alert */}
      {state.error && countdown === null && (
        <Alert variant="destructive" className="mb-4 shrink-0 animate-shake">
          <AlertTitle className="flex justify-between items-center">
            Connection Interrupted
            <Button 
              variant="ghost" 
              size="xs" 
              onClick={() => dispatch({ type: 'RESET_ERROR' })}
              className="h-auto p-1 text-destructive hover:bg-destructive/10 text-xs font-bold"
            >
              Dismiss
            </Button>
          </AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {/* Main Session Viewport */}
      <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0 relative overflow-hidden h-full">
        {/* Left Side: Chat Log Container */}
        <div className="flex-1 flex flex-col min-h-0 h-full">
          <ConversationPaneContainer 
            messages={state.messages} 
            isProcessing={state.status === 'processing'}
            showCorrections={state.showCorrections}
          />
        </div>

        {/* Right Side: Media Capture & Playback controls */}
        <div className="w-full md:w-80 flex flex-col gap-4 shrink-0 min-h-0">
          {/* Active Audio Speech Panel */}
          {state.status === 'playing' && (
            <Card className="border-primary/20 bg-primary/5 shadow-md animate-slide-up">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    {state.audioPaused ? <VolumeX className="h-5 w-5 animate-pulse" /> : <Volume2 className="h-5 w-5 animate-bounce" />}
                  </div>
                  <div>
                    <h4 className="font-outfit font-bold text-sm flex items-center gap-1.5">
                      {state.audioPaused ? 'Tutor Paused' : 'Tutor Speaking...'}
                      {usingBrowserVoice && (
                        <Badge variant="outline" className="text-[9px] py-0 px-1.5 border-orange-500/35 bg-orange-500/5 text-orange-500 font-sans">
                          Browser Voice
                        </Badge>
                      )}
                    </h4>
                    <p className="text-[10px] text-muted-foreground font-sans">
                      {usingBrowserVoice ? 'Using browser SpeechSynthesis fallback.' : "Listen to the examiner's response."}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleAudioPlayPause}
                    className="flex-1 font-outfit text-xs gap-1.5 h-9"
                  >
                    {state.audioPaused ? <Play className="h-3.5 w-3.5 fill-current" /> : <Pause className="h-3.5 w-3.5 fill-current" />}
                    {state.audioPaused ? 'Resume' : 'Pause'}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleAudioSkip}
                    className="flex-1 font-outfit text-xs gap-1.5 h-9 hover:bg-primary/10 hover:text-primary"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                    Skip Speech
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Audio Recorder Shell */}
          <Card className="border-border bg-card/40 backdrop-blur-sm shadow-xl flex-1 flex flex-col justify-center">
            <CardContent className="p-6">
              <AudioRecorderContainer 
                onComplete={handleRecordingComplete} 
                isProcessing={state.status === 'processing'}
                disabled={state.status === 'playing' || state.status === 'error'}
              />
              {state.status === 'idle' && (
                <div className="mt-4 text-center">
                  <p className="text-[10px] text-muted-foreground leading-relaxed flex items-center justify-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    Examiner is ready. Click microphone and speak.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
