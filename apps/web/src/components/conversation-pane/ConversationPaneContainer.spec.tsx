import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConversationPaneContainer, { Message } from './ConversationPaneContainer';

const mockMessages: Message[] = [
  {
    id: '1',
    role: 'tutor',
    text: 'Hello! Welcome to your IELTS Speaking test. Can you tell me your name?',
  },
  {
    id: '2',
    role: 'user',
    text: 'My name is John and I goes to school.',
    corrections: [
      {
        original: 'goes',
        corrected: 'go',
        explanation: "Use 'go' instead of 'goes' with the subject 'I'.",
      },
    ],
    vocabularySuggestions: [
      {
        original: 'school',
        suggestion: 'university',
        context: 'I attend university.',
      },
    ],
    pronunciationTips: [
      {
        word: 'John',
        tip: "Pronounce with a short 'o' sound.",
      },
    ],
  },
];

describe('ConversationPaneContainer', () => {
  it('renders chat history bubbles correctly', () => {
    render(<ConversationPaneContainer messages={mockMessages} />);

    // Check tutor message
    expect(screen.getByText(/Hello! Welcome to your IELTS Speaking test/i)).toBeInTheDocument();
    
    // Check user message (containing 'My name is John')
    expect(screen.getByText(/My name is John/i)).toBeInTheDocument();
  });

  it('renders corrections and suggestions when showCorrections is true', () => {
    render(<ConversationPaneContainer messages={mockMessages} showCorrections={true} />);

    // Strikethrough correction text exists
    const correction = screen.getByText('goes');
    expect(correction).toHaveClass('line-through');

    // Vocabulary chips exists
    expect(screen.getByText('school → university')).toBeInTheDocument();

    // Pronunciation badge exists
    expect(screen.getByText('John')).toBeInTheDocument();
  });

  it('hides corrections and suggestions when showCorrections is false', () => {
    render(<ConversationPaneContainer messages={mockMessages} showCorrections={false} />);

    // Strikethrough correction text does NOT exist as an individual decorated element
    const correction = screen.queryByText('goes');
    expect(correction).not.toBeInTheDocument();

    // Plain text message containing the word still exists
    expect(screen.getByText(/My name is John and I goes to school/i)).toBeInTheDocument();

    // Vocabulary chips do NOT exist
    expect(screen.queryByText('school → university')).not.toBeInTheDocument();
  });

  it('renders processing indicator when isProcessing is true', () => {
    const { container } = render(<ConversationPaneContainer messages={mockMessages} isProcessing={true} />);

    // Search for the bounce dots inside container
    const bounces = container.querySelectorAll('.animate-bounce');
    expect(bounces.length).toBe(3);
  });

  it('renders empty state placeholder when history is empty', () => {
    render(<ConversationPaneContainer messages={[]} />);

    expect(screen.getByText(/No conversation history yet/i)).toBeInTheDocument();
  });
});
