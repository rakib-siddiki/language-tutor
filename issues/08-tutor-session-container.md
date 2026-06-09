## What to build

Build the `TutorSession` feature — the main orchestration layer that glues together `AudioRecorder`, `ConversationPane`, and the backend API into a working, end-to-end conversational loop. This is the core of the application.

**Component architecture:**

```
components/tutor-session/
├── components/
│   ├── SessionHeader.tsx         # Mode badge, scenario label, "End Session" button, corrections toggle
│   ├── AudioControlBar.tsx       # Houses AudioRecorderContainer + playback controls
│   └── AudioPlayer.tsx           # Hidden <audio> element controlled by the session state
├── hooks/
│   └── useSessionReducer.ts      # useReducer managing the full session state machine
├── TutorSessionContainer.tsx     # Main orchestrator ("use client")
└── index.ts
```

**`useSessionReducer` state machine:**

```typescript
// State shape (from design session)
type SessionState = {
  status: 'idle' | 'recording' | 'processing' | 'playing' | 'error';
  history: ConversationTurn[];
  mode: ConversationMode;
  scenario?: string;
  showCorrections: boolean;
  error: string | null;
};

type SessionAction =
  | { type: 'RECORDING_STARTED' }
  | { type: 'RECORDING_STOPPED'; payload: { audioBase64: string; mimeType: string } }
  | { type: 'API_RESPONSE_RECEIVED'; payload: TutorResponse }
  | { type: 'PLAYBACK_COMPLETE' }
  | { type: 'TOGGLE_CORRECTIONS' }
  | { type: 'API_ERROR'; payload: string }
  | { type: 'END_SESSION' };
```

**Conversation turn flow in `TutorSessionContainer`:**
1. `AudioRecorder` fires `onComplete` → dispatch `RECORDING_STOPPED` → status becomes `'processing'`.
2. `useEffect` watches for status `'processing'` → calls `POST /api/tutor/chat` with the audio and current history.
3. On success → dispatch `API_RESPONSE_RECEIVED` → status becomes `'playing'`. Appends both the user turn (with corrections) and the tutor turn to history.
4. `AudioPlayer` decodes `audioBase64` to an `ObjectURL` and plays it. On `onEnded` → dispatch `PLAYBACK_COMPLETE` → status returns to `'idle'`.
5. On API error → dispatch `API_ERROR` → show an `Alert` with the message.

The API base URL is read from `NEXT_PUBLIC_API_URL` env variable (defaults to `http://localhost:3000`).

## Acceptance criteria

- [ ] After recording stops, the UI transitions to a "Processing…" state (recorder disabled, skeleton shown in the pane).
- [ ] The tutor's text response appears in `ConversationPane` as a tutor bubble after the API call.
- [ ] The tutor's audio plays automatically after the API response is received.
- [ ] Playback controls (pause/resume) are available while the tutor speaks.
- [ ] After audio finishes, the recorder returns to idle and accepts a new recording.
- [ ] Clicking "End Session" dispatches `END_SESSION` and navigates to the `EvaluationDashboard` (passing the session history and ScoreReport).
- [ ] API error is displayed as a dismissible `Alert` in the UI; the user can retry.
- [ ] The corrections toggle in `SessionHeader` updates `showCorrections` in the reducer and is reflected in `ConversationPane`.
- [ ] `useSessionReducer` unit tests cover all action types.
- [ ] No TypeScript errors; no `any` types.

## Blocked by

- `06-audio-recorder-component.md`
- `07-conversation-pane-component.md`
- `03-nestjs-tutor-api.md`

## Status
Pending
