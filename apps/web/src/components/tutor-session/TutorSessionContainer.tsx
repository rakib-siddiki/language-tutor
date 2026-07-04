'use client';

import React from 'react';
import { useTutorSessionContainer } from '@/hooks';
import { AudioRecorderContainer } from '../audio-recorder';
import { ConversationPaneContainer } from '../conversation-pane';
import Header from '../header';
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
  HelpCircle,
  SkipForward,
  MoreHorizontal
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
  const {
    state,
    dispatch,
    usingBrowserVoice,
    countdown,
    handleAudioPlayPause,
    handleAudioSkip,
    handleRecordingComplete,
    handleEnd,
  } = useTutorSessionContainer({
    config,
    onEndSession,
    onBackToSetup,
  });

  return (
    <>
      <Header 
        showFeedbackToggle={true}
        feedbackChecked={state.showCorrections}
        onFeedbackChange={() => dispatch({ type: 'TOGGLE_CORRECTIONS' })}
        showEndButton={true}
        onEndSession={handleEnd}
        endButtonDisabled={state.messages.length === 0}
      />

      <div className="container max-w-6xl mx-auto px-4 pb-6 pt-4 flex-1 flex flex-col min-h-0 animate-fade-in h-full">
        {/* Simplified Practice sub-header */}
        <div className="flex items-center justify-between pb-3 border-b border-border/45 mb-4 shrink-0">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBackToSetup}
            className="text-muted-foreground hover:text-foreground p-1 h-auto cursor-pointer"
          >
            <ArrowLeft className="size-4 mr-1" />
            Exit Setup
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-outfit capitalize text-primary border-primary/20 bg-primary/5">
              {config.mode}
            </Badge>
            <span className="text-xs text-muted-foreground capitalize">
              {config.scenario.replace(/-/g, ' ')}
            </span>
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
        <div className="flex-1 flex flex-col min-h-0 md:h-full">
          <ConversationPaneContainer 
            messages={state.messages} 
            isProcessing={state.status === 'processing'}
            showCorrections={state.showCorrections}
          />
        </div>

        {/* Right Side: Media Capture & Playback controls */}
        <div className="w-full md:w-80 flex flex-col gap-6 shrink-0 min-h-0">
          {/* Status Card matching mockup */}
          <Card className="border-border bg-card/45 backdrop-blur-sm shadow-xl">
            <CardHeader className="pb-2 flex flex-row items-center justify-between shrink-0 py-3 px-4">
              <CardTitle className="text-xs font-bold text-muted-foreground/80 font-outfit uppercase tracking-wider">
                Status
              </CardTitle>
              <MoreHorizontal className="size-4 text-muted-foreground/60 cursor-pointer hover:text-foreground transition-colors" />
            </CardHeader>
            <CardContent className="p-4 flex flex-col gap-5 items-center justify-center text-center">
              <div>
                <h3 className="font-outfit text-lg font-black text-foreground">
                  {state.status === 'playing' 
                    ? (state.audioPaused ? 'Tutor Paused' : 'Tutor Speaking...') 
                    : state.status === 'processing' 
                      ? 'Tutor Processing...'
                      : state.status === 'recording' 
                        ? 'Student Speaking...' 
                        : 'Examiner Ready'}
                </h3>
                {usingBrowserVoice && state.status === 'playing' && (
                  <Badge variant="outline" className="text-[9px] py-0 px-1.5 mt-1 border-orange-500/35 bg-orange-500/5 text-orange-500 font-sans mx-auto">
                    Browser Voice
                  </Badge>
                )}
              </div>

              {/* Media Circular Controls row */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleAudioPlayPause}
                  disabled={state.status !== 'playing' || !state.audioPaused}
                  title="Play"
                  className="size-10 rounded-full bg-[#20222a] hover:bg-[#2e313c] text-white flex items-center justify-center transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 shadow-md border-none"
                >
                  <Play className="size-4 fill-current ml-0.5" />
                </button>
                <button
                  type="button"
                  onClick={handleAudioPlayPause}
                  disabled={state.status !== 'playing' || state.audioPaused}
                  title="Pause"
                  className="size-10 rounded-full bg-[#20222a] hover:bg-[#2e313c] text-white flex items-center justify-center transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 shadow-md border-none"
                >
                  <Pause className="size-4 fill-current" />
                </button>
                <button
                  type="button"
                  onClick={handleAudioSkip}
                  disabled={state.status !== 'playing'}
                  title="Skip Speech"
                  className="size-10 rounded-full bg-[#20222a] hover:bg-[#2e313c] text-white flex items-center justify-center transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 shadow-md border-none"
                >
                  <SkipForward className="size-4 fill-current" />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Active Voice Recorder Card */}
          <Card className="border-border bg-card/45 backdrop-blur-sm shadow-xl flex-1 flex flex-col">
            <CardHeader className="pb-2 py-3 px-4 border-b border-border/5">
              <CardTitle className="text-xs font-bold text-muted-foreground/80 font-outfit uppercase tracking-wider">
                Active Voice Recorder
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 flex-1 flex flex-col justify-center gap-4">
              <AudioRecorderContainer 
                onComplete={handleRecordingComplete} 
                isProcessing={state.status === 'processing'}
                disabled={state.status === 'playing' || state.status === 'error'}
              />
              {state.status === 'idle' && (
                <div className="text-center">
                  <p className="text-[10px] text-muted-foreground leading-relaxed flex items-center justify-center gap-1">
                    <CheckCircle2 className="size-3.5 text-emerald-500" />
                    Examiner is ready. Click microphone and speak.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </>
);
}
