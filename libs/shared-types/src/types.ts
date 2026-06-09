// Placeholder types — full implementation in Issue #2
export type ConversationMode = 'ielts' | 'business' | 'casual';

export type ConversationTurn = {
  role: 'user' | 'tutor';
  text: string;
};

export type IELTSScenario = 'ielts-part-1' | 'ielts-part-2' | 'ielts-part-3';
export type BusinessScenario = 'job-interview' | 'client-presentation' | 'team-meeting';

export interface TutorRequest {
  audioBase64: string;
  mimeType: string;
  history: ConversationTurn[];
  mode: ConversationMode;
  scenario?: IELTSScenario | BusinessScenario | string;
}

export interface ScoreReport {
  fluencyScore: number;
  vocabularyScore: number;
  grammarScore: number;
  pronunciationScore: number;
  overallBand: number;
  feedbackSummary: string;
  commonMistakes: string[];
  exampleImprovements: Array<{ original: string; improved: string }>;
}

export interface TutorResponse {
  userTranscript: string;
  correctedTranscript: string;
  corrections: Array<{
    original: string;
    corrected: string;
    explanation: string;
  }>;
  vocabularySuggestions: Array<{
    original: string;
    suggestion: string;
    context: string;
  }>;
  pronunciationTips: Array<{ word: string; tip: string }>;
  tutorText: string;
  audioBase64: string;
  scoreSnapshot?: ScoreReport;
}
