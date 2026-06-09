# PRD — Real-Time Conversational Language Tutor

## Problem Statement

Learners preparing for high-stakes English proficiency exams (IELTS Speaking) or trying to improve their professional Business English have very limited access to affordable, on-demand speaking practice. Engaging a human native-speaking tutor costs $30–$150 per hour and requires scheduling in advance. This creates a significant barrier to consistent practice — the most critical factor in fluency development. Learners end up under-practicing speaking, which is typically the lowest-scoring skill in self-study programs.

---

## Solution

A zero-cost, browser-native conversational language tutor that simulates a human examiner or conversation partner. The user speaks directly into their browser microphone. The audio is transcribed by a multimodal LLM (Gemini 2.0 Flash), which simultaneously generates a contextual spoken response, identifies grammar and vocabulary errors, provides pronunciation tips, and tracks cumulative performance metrics across the session. The tutor's text response is synthesized back into natural-sounding speech via Edge TTS and played back to the user, creating a seamless real-time conversation loop. At the end of each session, the user receives a detailed evaluation report with IELTS-style band scores (or Business/Casual equivalents).

**The application runs entirely on the user's machine with a single free Gemini API key — zero ongoing cost.**

---

## User Stories

### Onboarding & Session Setup
1. As a language learner, I want to select a practice mode (IELTS Speaking, Business English, or Casual Conversation), so that the tutor adjusts its vocabulary, formality, rubrics, and question style to my specific goal.
2. As a learner, I want to provide my Gemini API key through an in-app settings panel, so that I can use the app without any backend subscription or hidden costs.
3. As an IELTS candidate, I want to choose a speaking Part (Part 1 – Introduction, Part 2 – Cue Card, Part 3 – Discussion), so that the tutor presents the correct question types and timing constraints.
4. As a Business English learner, I want to choose a scenario (job interview, client presentation, or team meeting), so that the conversation context matches my real-world needs.
5. As a learner, I want to see a clear "Session Ready" state with mic permission instructions before I start speaking, so that I know the app is ready to listen.
6. As a returning learner, I want to select a preferred tutor voice (e.g., British English, American English, Australian English), so that I can practice with the accent most relevant to my context.

### Real-Time Conversation
7. As a learner, I want to click a single button to start recording my voice, so that the interaction is simple and requires minimal setup.
8. As a learner, I want to see a visual waveform or animated indicator while recording, so that I have confirmation the microphone is active and capturing audio.
9. As a learner, I want to click the same button (or a stop button) to end my turn, so that I have control over when my response is submitted.
10. As a learner, I want the tutor's audio response to play automatically after I finish speaking, so that the conversation flows naturally without requiring extra clicks.
11. As a learner, I want to be able to pause or stop the tutor's audio at any time, so that I can re-read a correction or take a moment to think.
12. As a learner, I want to see the transcript of what I said and what the tutor said in a scrollable conversation panel, so that I can review the dialogue.
13. As a learner, I want my grammatical errors highlighted inline in my transcript (e.g., strikethrough original, green corrected version on hover), so that I can identify mistakes without breaking the conversational flow.
14. As a learner, I want to see a subtle tooltip or popover on each highlighted correction explaining the grammar rule, so that I understand the "why" behind each fix.
15. As an IELTS learner, I want the tutor to follow the official IELTS examiner script and transition between Parts 1, 2, and 3, so that my practice experience mirrors the actual exam.
16. As a Business English learner, I want the tutor to play a realistic role (interviewer, client, manager), so that the practice is directly transferable to real-world situations.

### Feedback & Corrections
17. As a learner, I want to see vocabulary upgrade suggestions (e.g., "instead of 'good', consider 'beneficial' or 'advantageous'"), so that I expand my lexical range during practice.
18. As a learner, I want to receive pronunciation tips for difficult words I used, so that I can improve articulation in future sessions.
19. As a learner, I want corrections to appear as non-blocking inline annotations rather than interruptions, so that I maintain speaking fluency.
20. As a learner, I want to toggle the inline corrections panel on or off, so that I can choose whether to focus on content or accuracy during a given session.

### Session Evaluation & Report
21. As an IELTS candidate, I want to click "End Session" and receive a report card with band scores for Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, and Pronunciation, so that I can track my preparation progress.
22. As a Business English learner, I want a business-context evaluation covering Professional Vocabulary, Communication Clarity, Politeness & Register, and Confidence Indicators, so that I receive actionable feedback for my workplace goals.
23. As a Casual learner, I want an informal summary of strengths and areas to improve, so that I feel encouraged rather than overwhelmed.
24. As a learner, I want the evaluation to include a list of the most common mistakes I made in the session, so that I know what to focus on in my next practice.
25. As a learner, I want the evaluation dashboard to show a visual breakdown (e.g., progress bars, charts) of each scoring category, so that I can quickly grasp my strengths and weaknesses.
26. As a learner, I want the evaluation to include example sentences showing how I could have phrased something better, so that I have concrete targets to practice.
27. As a learner, I want to be able to print or export the evaluation report as a PDF, so that I can track progress over time offline or share it with a human tutor.

### Accessibility & UX
28. As a learner with a slow internet connection, I want a loading skeleton while the tutor processes my audio, so that I know the app is working and haven't lost my response.
29. As a learner, I want keyboard shortcuts (e.g., Space to start/stop recording), so that I can practice hands-free.
30. As a learner, I want the interface to be fully responsive, so that I can practice on the go from a mobile device.
31. As a learner, I want the application to support dark mode, so that I can practice comfortably in low-light environments.
32. As a learner, I want error messages to be friendly and actionable (e.g., "Microphone permission denied — please allow access in your browser settings"), so that I can resolve issues without frustration.

---

## Implementation Decisions

### Monorepo Architecture
- The project uses an **NX monorepo** with **pnpm** as the package manager.
- Applications:
  - `apps/web` — Next.js 14+ (App Router) frontend
  - `apps/api` — NestJS backend
- Libraries:
  - `libs/shared-types` — Shared TypeScript interfaces used by both apps
  - `libs/ui` — Shared UI component library (shadcn/ui components, nova preset, Tailwind v4)

### Frontend (`apps/web`)
- Framework: **Next.js 14+ App Router** with TypeScript.
- UI Library: **shadcn/ui** initialized with the `nova` preset and Tailwind v4.
- Icons: **Lucide React**.
- State Management: **React Context + `useReducer`** for session state (mode, history, status). No external state manager.
- Audio Capture: **HTML5 `MediaRecorder` API** — records in browser's native format (WebM/Opus on Chrome, MP4/AAC on Safari). Base64-encodes the blob before POSTing.
- Audio Playback: HTML5 `<audio>` element with dynamically created `ObjectURL` from the TTS response buffer.
- Visual Feedback: CSS-animated waveform bars driven by Web Audio API `AnalyserNode` during recording.
- Component Architecture: Follows the **Container-Page pattern** (from `create-frontend-feature` workflow). Each feature lives in `components/[feature-name]/` with sub-folders for Dialogs, Forms, and presentational components; orchestration happens in a `[Feature]Container.tsx`.

### Backend (`apps/api`)
- Framework: **NestJS** with TypeScript.
- LLM Integration: **`@google/genai` SDK** calling `gemini-2.0-flash`. Audio passed as `inlineData` (base64 + mimeType). Structured JSON enforced via `responseSchema`.
- TTS Integration: **`msedge-tts`** (server-side). MP3 buffer base64-encoded and returned in the response JSON.
- API Pattern: **Stateless HTTP POST** per conversational turn. Full conversation history sent by the client on each request.
- CORS: Configured for `localhost:3000` (development) and the production origin.

### Shared Types (`libs/shared-types`)

```typescript
// Decision-encoding type shape (from design session)
interface TutorRequest {
  audioBase64: string;
  mimeType: string; // e.g. 'audio/webm;codecs=opus'
  history: Array<{ role: 'user' | 'tutor'; text: string }>;
  mode: 'ielts' | 'business' | 'casual';
  scenario?: string; // e.g. 'ielts-part-2', 'job-interview'
}

interface TutorResponse {
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

interface ScoreReport {
  fluencyScore: number;        // 0–9 IELTS band scale
  vocabularyScore: number;
  grammarScore: number;
  pronunciationScore: number;
  overallBand: number;
  feedbackSummary: string;
  commonMistakes: string[];
  exampleImprovements: Array<{ original: string; improved: string }>;
}
```

### Gemini Prompt Engineering
- A detailed system-level prompt is prepended to every request defining the tutor persona, active mode, and JSON output schema.
- `responseMimeType: 'application/json'` and a strict `responseSchema` guarantee parseable outputs.

### Environment & Configuration
- `GEMINI_API_KEY` stored in `apps/api/.env` via NestJS `ConfigModule`.
- Frontend accepts an optional user-provided key via Settings panel (stored in `localStorage`), sent as a request header overriding the backend default.

---

## Testing Decisions

### What Makes a Good Test
- Tests validate **external observable behavior**, not internal implementation details.
- Tests must be deterministic and fast.
- Prefer integration tests at service boundaries over deep mocking.

### Modules to Test
- **`TutorService` (NestJS)**: Integration test with mock Gemini SDK responses — validates correct JSON parsing, Edge TTS invocation, and `TutorResponse` shape. Tests malformed JSON for error handling.
- **`AudioRecorder` component**: Unit test via `@testing-library/react` — validates state transitions (idle → recording → processing → idle) and correct callback invocations.
- **`ConversationPane` component**: Unit test rendering mock conversation history — verifies corrections render with correct ARIA attributes and highlight classes.
- **`EvaluationDashboard` component**: Unit test rendering mock `ScoreReport` — verifies all score categories and improvement examples appear in the DOM.
- **`useSessionReducer` hook**: Unit test of all action types using `renderHook`.

---

## Out of Scope

- User authentication or accounts.
- Session history persistence to a database.
- Multi-language support beyond English (v1 only).
- Phoneme-level acoustic pronunciation scoring.
- Native mobile app (React Native / Expo).
- WebRTC peer-to-peer connections.
- Real-time mid-response streaming.
- Payment or subscription tiers.
- CI/CD pipeline configuration.

---

## Further Notes

- `MediaRecorder` MIME type varies by browser. The frontend detects the supported type at runtime via `MediaRecorder.isTypeSupported` and includes it in `TutorRequest.mimeType`.
- Gemini free tier: ~15 RPM on `gemini-2.0-flash`. Sessions should throttle and display a "Processing…" state.
- `msedge-tts` uses Microsoft's unofficial Edge Read-Aloud WebSocket endpoint. A fallback to browser-native `SpeechSynthesis` should be considered for resilience.
- The NX monorepo uses **pnpm** for optimal workspace hoisting.
