'use client';

import React from 'react';
import { Button, Alert, AlertTitle, AlertDescription } from '@/components/ui';
import { Mic, Square, Loader2, AlertCircle } from 'lucide-react';
import { useAudioRecorderContainer } from '@/hooks';

interface AudioRecorderContainerProps {
  onComplete: (data: { audioBase64: string; mimeType: string }) => void;
  isProcessing?: boolean;
  disabled?: boolean;
}

export default function AudioRecorderContainer({
  onComplete,
  isProcessing = false,
  disabled = false,
}: AudioRecorderContainerProps) {
  const {
    canvasRef,
    buttonRef,
    isRecording,
    isPermissionDenied,
    toggleRecording,
    buttonClasses,
  } = useAudioRecorderContainer({
    onComplete,
    isProcessing,
    disabled,
  });

  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full">
      {/* Waveform Canvas */}
      <div className="w-full h-12 sm:h-20 bg-background/40 backdrop-blur-sm rounded-xl border border-border/30 overflow-hidden relative shadow-inner">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full block" 
        />
        {isRecording && (
          <div className="absolute top-2 right-3 flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-destructive animate-ping" />
            <span className="text-[10px] uppercase font-bold text-destructive font-outfit">Rec</span>
          </div>
        )}
      </div>

      {/* Control Button wrapped in glowing gradient border matching mockup */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative p-1 rounded-full bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] shadow-[0_0_20px_rgba(139,92,246,0.35)] animate-glow">
          <button
            ref={buttonRef}
            type="button"
            onClick={toggleRecording}
            disabled={disabled || isProcessing}
            aria-label={isRecording ? 'Stop Recording' : 'Start Recording'}
            className={buttonClasses}
          >
            {isProcessing ? (
              <Loader2 className="size-7 animate-spin" />
            ) : isRecording ? (
              <Square className="size-6 fill-current" />
            ) : (
              <Mic className="size-7" />
            )}
          </button>
        </div>
        
        <span className="text-xs font-semibold text-muted-foreground font-sans h-4">
          {isProcessing 
            ? 'Tutor is processing...' 
            : isRecording 
              ? 'Click to stop speaking (or press Space)' 
              : 'Click to start speaking (or press Space)'}
        </span>
      </div>

      {/* Permission Error Message */}
      {isPermissionDenied && (
        <Alert variant="destructive" className="w-full mt-2 animate-shake">
          <AlertCircle className="size-4" />
          <AlertTitle>Microphone Access Denied</AlertTitle>
          <AlertDescription>
            Microphone access is required to speak with your language tutor. Please check your browser site settings and grant permissions.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
