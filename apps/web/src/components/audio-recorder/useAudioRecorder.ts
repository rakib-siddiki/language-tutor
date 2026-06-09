'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

export interface UseAudioRecorderProps {
  onComplete: (data: { audioBase64: string; mimeType: string }) => void;
}

export function useAudioRecorder({ onComplete }: UseAudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPermissionDenied, setIsPermissionDenied] = useState(false);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const cleanup = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        // Ignore if already stopped
      }
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {
        // Ignore if already closed
      }
      audioContextRef.current = null;
    }
    setAnalyser(null);
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  const startRecording = useCallback(async () => {
    setIsPermissionDenied(false);
    chunksRef.current = [];

    try {
      // 1. Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // 2. Set up Web Audio API Analyser Node for Visualizer
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const analyserNode = audioContext.createAnalyser();
      analyserNode.fftSize = 64; // Smaller size for simple bar visualization
      source.connect(analyserNode);
      setAnalyser(analyserNode);

      // 3. Determine best MIME type supported by the browser
      let mimeType = 'audio/webm;codecs=opus';
      if (typeof MediaRecorder !== 'undefined') {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          mimeType = 'audio/webm;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/webm')) {
          mimeType = 'audio/webm';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/wav')) {
          mimeType = 'audio/wav';
        }
      }

      // 4. Initialize MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const finalBlob = new Blob(chunksRef.current, { type: mimeType });
        
        // Convert to Base64
        const reader = new FileReader();
        reader.readAsDataURL(finalBlob);
        reader.onloadend = () => {
          const result = reader.result as string;
          const base64String = result.split(',')[1];
          onComplete({
            audioBase64: base64String,
            mimeType: finalBlob.type,
          });
        };
      };

      // 5. Start recording
      mediaRecorder.start(100); // Record in 100ms slices
      setIsRecording(true);
    } catch (err) {
      console.error('Error starting audio recording:', err);
      setIsPermissionDenied(true);
      setIsRecording(false);
    }
  }, [onComplete]);

  const stopRecording = useCallback(() => {
    if (!isRecording) return;
    
    // Stop recording, trigger onstop handler which fires onComplete
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    // Stop stream tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    setIsRecording(false);
  }, [isRecording]);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  return {
    isRecording,
    isPermissionDenied,
    analyser,
    startRecording,
    stopRecording,
    toggleRecording,
    cleanup,
  };
}
