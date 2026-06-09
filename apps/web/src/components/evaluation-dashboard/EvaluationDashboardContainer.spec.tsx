import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EvaluationDashboardContainer from './EvaluationDashboardContainer';

const mockReport = {
  fluencyScore: 8.0,
  vocabularyScore: 7.0,
  grammarScore: 7.5,
  pronunciationScore: 8.0,
  overallBand: 7.5,
  feedbackSummary: 'Excellent conversation! Your sentence structuring and pronunciation were very clear.',
  commonMistakes: [
    'Used past tense instead of continuous in one sentence.',
    'Slight mispronunciation of the word "development".'
  ],
  exampleImprovements: [
    {
      original: 'I goes to shop yesterday.',
      improved: 'I went to the shop yesterday.',
    }
  ]
};

const mockConfig = {
  mode: 'ielts' as const,
  scenario: 'ielts-part-1',
  apiKey: 'mock-api-key',
};

const mockHistory = [
  { role: 'user' as const, text: 'I goes to shop yesterday.' },
  { role: 'tutor' as const, text: 'That is interesting. What did you buy?' }
];

describe('EvaluationDashboardContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading skeleton initially and fetches report', async () => {
    // Mock fetch resolution
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockReport),
    });

    render(
      <EvaluationDashboardContainer
        history={mockHistory}
        config={mockConfig}
        onRestart={jest.fn()}
      />
    );

    // Expect loading skeletons initially
    expect(screen.queryByText('Speaking Performance Report')).not.toBeInTheDocument();

    // Wait for fetch to resolve and data to render
    await waitFor(() => {
      expect(screen.getByText('Speaking Performance Report')).toBeInTheDocument();
    });

    // Check if scores are displayed
    expect(screen.getByText('7.5')).toBeInTheDocument(); // overall band
    expect(screen.getByText('Excellent conversation! Your sentence structuring and pronunciation were very clear.')).toBeInTheDocument();
    expect(screen.getByText('Used past tense instead of continuous in one sentence.')).toBeInTheDocument();
    expect(screen.getByText(/I goes to shop yesterday/i)).toBeInTheDocument();
    expect(screen.getByText(/I went to the shop yesterday/i)).toBeInTheDocument();
  });

  it('renders error view on fetch rejection', async () => {
    // Mock fetch error
    global.fetch = jest.fn().mockRejectedValue(new Error('Network disconnected'));

    render(
      <EvaluationDashboardContainer
        history={mockHistory}
        config={mockConfig}
        onRestart={jest.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Analysis Failed')).toBeInTheDocument();
    });
    expect(screen.getByText('Network disconnected')).toBeInTheDocument();
  });

  it('triggers onRestart when Restart button is clicked', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockReport),
    });

    const handleRestart = jest.fn();

    render(
      <EvaluationDashboardContainer
        history={mockHistory}
        config={mockConfig}
        onRestart={handleRestart}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Speaking Performance Report')).toBeInTheDocument();
    });

    const restartBtn = screen.getByRole('button', { name: /New Session/i });
    fireEvent.click(restartBtn);

    expect(handleRestart).toHaveBeenCalled();
  });
});
