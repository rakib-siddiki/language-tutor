'use client';

import { useEffect, useRef, useState } from 'react';
import { useAudioRecorder } from './useAudioRecorder';

interface UseAudioRecorderContainerProps {
  onComplete: (data: { audioBase64: string; mimeType: string }) => void;
  isProcessing?: boolean;
  disabled?: boolean;
}

export function useAudioRecorderContainer({
  onComplete,
  isProcessing = false,
  disabled = false,
}: UseAudioRecorderContainerProps) {
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
  const [liveTranscript, setLiveTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  // Web Speech API Live Recognition Effect
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (isRecording) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let currentText = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentText += event.results[i][0].transcript;
          }
          setLiveTranscript(currentText);
        };

        recognition.onerror = (err: any) => {
          console.warn('SpeechRecognition warning:', err);
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('Failed to start SpeechRecognition:', err);
      }
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
        recognitionRef.current = null;
      }
      setLiveTranscript('');
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
        recognitionRef.current = null;
      }
    };
  }, [isRecording]);

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

        // Create elegant horizontal gradient (Blue to Purple to Pink)
        const gradient = ctx.createLinearGradient(0, 0, rect.width, 0);
        gradient.addColorStop(0, '#3b82f6'); // Blue
        gradient.addColorStop(0.5, '#8b5cf6'); // Purple
        gradient.addColorStop(1, '#ec4899'); // Pink

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
  let buttonClasses = 'size-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg relative ';
  if (isProcessing) {
    buttonClasses += 'bg-muted text-muted-foreground cursor-not-allowed';
  } else if (isRecording) {
    buttonClasses += 'bg-destructive hover:bg-destructive/90 text-destructive-foreground scale-110 animate-pulse';
  } else {
    buttonClasses += 'bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-105 active:scale-95';
  }

  return {
    canvasRef,
    buttonRef,
    isRecording,
    isPermissionDenied,
    toggleRecording,
    stopRecording,
    buttonClasses,
    liveTranscript,
  };
}
