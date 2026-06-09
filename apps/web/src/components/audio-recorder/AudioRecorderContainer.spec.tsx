import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import AudioRecorderContainer from './AudioRecorderContainer';

// Mock Web Audio and MediaRecorder APIs
const mockStopTrack = jest.fn();
const mockGetUserMedia = jest.fn().mockResolvedValue({
  getTracks: () => [{ stop: mockStopTrack }],
});

Object.defineProperty(navigator, 'mediaDevices', {
  value: {
    getUserMedia: mockGetUserMedia,
  },
  writable: true,
});

class MockMediaRecorder {
  state = 'inactive';
  ondataavailable: ((e: any) => void) | null = null;
  onstop: (() => void) | null = null;
  
  start = jest.fn(() => {
    this.state = 'recording';
  });
  
  stop = jest.fn(() => {
    this.state = 'inactive';
    // Simulate async data & stop call
    if (this.ondataavailable) {
      this.ondataavailable({ data: new Blob(['audio'], { type: 'audio/webm' }) });
    }
    if (this.onstop) {
      this.onstop();
    }
  });

  static isTypeSupported = jest.fn().mockReturnValue(true);
}

(global as any).MediaRecorder = MockMediaRecorder;

// Mock HTMLCanvasElement context
HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({
  clearRect: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  stroke: jest.fn(),
  rect: jest.fn(),
  fill: jest.fn(),
  scale: jest.fn(),
  createLinearGradient: jest.fn().mockReturnValue({
    addColorStop: jest.fn(),
  }),
});

class MockAudioContext {
  close = jest.fn().mockResolvedValue(undefined);
  createMediaStreamSource = jest.fn().mockReturnValue({
    connect: jest.fn(),
  });
  createAnalyser = jest.fn().mockReturnValue({
    fftSize: 64,
    frequencyBinCount: 32,
    getByteFrequencyData: jest.fn(),
  });
}

(global as any).AudioContext = MockAudioContext;

describe('AudioRecorderContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders initial idle state correctly', () => {
    render(<AudioRecorderContainer onComplete={jest.fn()} />);
    
    // Check for record button and helper text
    expect(screen.getByRole('button', { name: /start recording/i })).toBeInTheDocument();
    expect(screen.getByText(/Click to start speaking/i)).toBeInTheDocument();
  });

  it('toggles to recording state on click and stops on click', async () => {
    const handleComplete = jest.fn();
    render(<AudioRecorderContainer onComplete={handleComplete} />);
    
    const button = screen.getByRole('button', { name: /start/i });
    
    // Start Recording
    await act(async () => {
      fireEvent.click(button);
    });

    expect(mockGetUserMedia).toHaveBeenCalled();
    expect(screen.getByRole('button', { name: /stop recording/i })).toBeInTheDocument();
    expect(screen.getByText(/Click to stop speaking/i)).toBeInTheDocument();

    // Stop Recording
    await act(async () => {
      fireEvent.click(button);
    });

    expect(screen.getByRole('button', { name: /start recording/i })).toBeInTheDocument();
  });

  it('toggles recording with the Space key', async () => {
    render(<AudioRecorderContainer onComplete={jest.fn()} />);
    
    // Press Space to start
    await act(async () => {
      fireEvent.keyDown(window, { code: 'Space' });
    });
    
    expect(screen.getByRole('button', { name: /stop recording/i })).toBeInTheDocument();

    // Press Space to stop
    await act(async () => {
      fireEvent.keyDown(window, { code: 'Space' });
    });
    
    expect(screen.getByRole('button', { name: /start recording/i })).toBeInTheDocument();
  });

  it('renders disabled state when isProcessing is true', () => {
    render(<AudioRecorderContainer onComplete={jest.fn()} isProcessing={true} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.getByText(/Tutor is processing/i)).toBeInTheDocument();
  });
});
