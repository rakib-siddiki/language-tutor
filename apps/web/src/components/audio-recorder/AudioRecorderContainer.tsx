'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAudioRecorder } from './useAudioRecorder';
import { Button, Alert, AlertTitle, AlertDescription } from '@language-tutor/ui';
import { Mic, Square, Loader2, AlertCircle } from 'lucide-react';

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
    isRecording,
    isPermissionDenied,
    analyser,
    toggleRecording,
    stopRecording,
  } = useAudioRecorder({ onComplete });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Set up Canvas Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high-DPI display size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    if (!isRecording || !analyser) {
      // Draw static flat line when not recording
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.beginPath();
      ctx.moveTo(0, rect.height / 2);
      ctx.lineTo(rect.width, rect.height / 2);
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)'; // Primary Muted
      ctx.lineWidth = 2;
      ctx.stroke();
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, rect.width, rect.height);

      const barWidth = (rect.width / bufferLength) * 2.2;
      let barHeight;
      let x = 0;

      // Draw mirrored wave bars from middle
      for (let i = 0; i < bufferLength; i++) {
        // Normalize value between 0 and 1
        const value = dataArray[i] / 255;
        // Scale height to canvas dimensions
        barHeight = value * (rect.height * 0.85);

        if (barHeight < 3) barHeight = 3; // Minimum height for style

        // Create elegant gradient (Purple to Indigo)
        const gradient = ctx.createLinearGradient(0, rect.height / 2 - barHeight / 2, 0, rect.height / 2 + barHeight / 2);
        gradient.addColorStop(0, '#a78bfa'); // Light purple
        gradient.addColorStop(0.5, '#8b5cf6'); // Mid purple
        gradient.addColorStop(1, '#6366f1'); // Indigo

        ctx.fillStyle = gradient;

        // Draw pill-shaped vertical bars
        const yPos = rect.height / 2 - barHeight / 2;
        ctx.beginPath();
        if (typeof (ctx as any).roundRect === 'function') {
          (ctx as any).roundRect(x, yPos, barWidth - 2, barHeight, 4);
        } else {
          ctx.rect(x, yPos, barWidth - 2, barHeight);
        }
        ctx.fill();

        x += barWidth;
      }
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRecording, analyser]);

  // Spacebar toggle listener when button or container is focused
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        // Prevent page scroll
        e.preventDefault();
        if (!disabled && !isProcessing) {
          toggleRecording();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleRecording, disabled, isProcessing]);

  // Determine button state color/animation classes
  let buttonClasses = 'h-16 w-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg relative ';
  if (isProcessing) {
    buttonClasses += 'bg-muted text-muted-foreground cursor-not-allowed';
  } else if (isRecording) {
    buttonClasses += 'bg-destructive hover:bg-destructive/90 text-destructive-foreground scale-110 animate-pulse';
  } else {
    buttonClasses += 'bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-105 active:scale-95';
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 rounded-xl border border-border/30 bg-card/30 backdrop-blur-sm w-full">
      {/* Waveform Canvas */}
      <div className="w-full h-20 bg-background/50 rounded-lg border border-border/20 overflow-hidden relative">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full block" 
        />
        {isRecording && (
          <div className="absolute top-2 right-3 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-destructive animate-ping" />
            <span className="text-[10px] uppercase font-bold text-destructive font-outfit">Rec</span>
          </div>
        )}
      </div>

      {/* Control Button */}
      <div className="flex flex-col items-center gap-3">
        <button
          ref={buttonRef}
          type="button"
          onClick={toggleRecording}
          disabled={disabled || isProcessing}
          aria-label={isRecording ? 'Stop Recording' : 'Start Recording'}
          className={buttonClasses}
        >
          {isProcessing ? (
            <Loader2 className="h-7 w-7 animate-spin" />
          ) : isRecording ? (
            <Square className="h-6 w-6 fill-current" />
          ) : (
            <Mic className="h-7 w-7" />
          )}
        </button>
        
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
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Microphone Access Denied</AlertTitle>
          <AlertDescription>
            Microphone access is required to speak with your language tutor. Please check your browser site settings and grant permissions.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
