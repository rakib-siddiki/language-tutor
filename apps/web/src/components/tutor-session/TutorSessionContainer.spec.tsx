import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TutorSessionContainer from './TutorSessionContainer';

// Mock canvas for AudioRecorderContainer inside JSDOM
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

// Mock window.atob and window.Audio since JSDOM doesn't implement Audio playback fully
window.atob = jest.fn().mockImplementation((str) => Buffer.from(str, 'base64').toString('binary'));

// Mock MediaRecorder, AudioContext, and mediaDevices
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

class MockAudio {
  play = jest.fn().mockResolvedValue(undefined);
  pause = jest.fn();
  onended: (() => void) | null = null;
  onerror: ((e: any) => void) | null = null;
  
  constructor() {
    setTimeout(() => {
      if (this.onended) this.onended();
    }, 50);
  }
}
(global as any).Audio = MockAudio;

Object.defineProperty(global.URL, 'createObjectURL', {
  value: jest.fn().mockReturnValue('blob:mock-audio-url'),
  writable: true,
});
Object.defineProperty(global.URL, 'revokeObjectURL', {
  value: jest.fn(),
  writable: true,
});

const mockConfig = {
  mode: 'ielts' as const,
  scenario: 'ielts-part-1',
  apiKey: 'mock-key',
  voice: 'en-US-AriaNeural',
};

describe('TutorSessionContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with initial setup details', () => {
    render(
      <TutorSessionContainer
        config={mockConfig}
        onEndSession={jest.fn()}
        onBackToSetup={jest.fn()}
      />
    );

    // Check mode badge and setup details
    expect(screen.getByText('ielts')).toBeInTheDocument();
    expect(screen.getByText('ielts part 1')).toBeInTheDocument();
    expect(screen.getByText(/Show Grammar Feedback/i)).toBeInTheDocument();
    expect(screen.getByText(/No conversation history yet/i)).toBeInTheDocument();
  });

  it('triggers onBackToSetup when Exit button is clicked', () => {
    const handleBack = jest.fn();
    render(
      <TutorSessionContainer
        config={mockConfig}
        onEndSession={jest.fn()}
        onBackToSetup={handleBack}
      />
    );

    const exitBtn = screen.getByRole('button', { name: /Exit Setup/i });
    fireEvent.click(exitBtn);
    expect(handleBack).toHaveBeenCalled();
  });

  it('triggers onEndSession when End & Evaluate is clicked', async () => {
    const handleEnd = jest.fn();
    
    // Render with mock messages in custom state to enable "End & Evaluate" button
    // The button is disabled when message history is empty
    render(
      <TutorSessionContainer
        config={mockConfig}
        onEndSession={handleEnd}
        onBackToSetup={jest.fn()}
      />
    );

    // Click microphone to simulate sending voice which adds messages
    const micButton = screen.getByRole('button', { name: /start recording/i });
    
    // Simulate recording start
    await act(async () => {
      fireEvent.click(micButton);
    });

    // Simulate stop recording which calls fetch
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        userTranscript: 'My transcript',
        correctedTranscript: 'My transcript',
        corrections: [],
        vocabularySuggestions: [],
        pronunciationTips: [],
        tutorText: 'Hello student',
        audioBase64: 'dGVzdA==',
      }),
    });

    await act(async () => {
      fireEvent.click(micButton);
    });

    // Wait for API and check if End & Evaluate is enabled
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /End & Evaluate/i })).not.toBeDisabled();
    });

    const evaluateBtn = screen.getByRole('button', { name: /End & Evaluate/i });
    fireEvent.click(evaluateBtn);
    expect(handleEnd).toHaveBeenCalled();
  });
});
