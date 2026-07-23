# Plan 005: Client-Side Real-Time Web Speech Transcript Preview

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 8d8224b..HEAD -- apps/web/src/hooks/ apps/web/src/components/audio-recorder/`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: dx
- **Planned at**: commit `8d8224b`, 2026-07-23

## Why this matters

Currently, while recording speech, users see a volume waveform canvas but have no visual confirmation of what words the microphone is capturing. Adding real-time live transcription preview using browser Web Speech API (`webkitSpeechRecognition` / `SpeechRecognition`) provides instant feedback as the user speaks. If microphone quality drops or a word is misheard, the user knows immediately.

## Current state

- `apps/web/src/components/audio-recorder/AudioRecorderContainer.tsx:40-46`: Displays recording red indicator badge.
- `apps/web/src/hooks/useAudioRecorderContainer.ts`: Manages canvas volume visualization and MediaRecorder audio recording blobs.

## Commands you will need

| Purpose   | Command | Expected on success |
|-----------|---------|---------------------|
| Build Web | `cmd /c pnpm build:web` | exit 0, built successfully |
| Lint      | `cmd /c pnpm lint` | exit 0, no lint errors |

## Scope

**In scope**:
- `apps/web/src/hooks/useAudioRecorderContainer.ts` (Add `SpeechRecognition` listener when recording starts)
- `apps/web/src/components/audio-recorder/AudioRecorderContainer.tsx` (Render live text preview bubble below waveform)

**Out of scope**:
- Server-side API files in `apps/api/`
- Audio blob creation or MIME encoding logic

## Git workflow

- Branch: `advisor/005-client-live-speech-preview`
- Conventional commits e.g. `feat(web): add real-time speech recognition preview during recording`

## Steps

### Step 1: Add Web Speech Recognition to `useAudioRecorderContainer.ts`

Initialize `window.SpeechRecognition || window.webkitSpeechRecognition` when recording starts:
- Store interim transcript text in hook state: `liveTranscript`.
- Handle browsers where Web Speech API is unsupported gracefully without error.

**Verify**: `cmd /c pnpm build:web` → exit 0

### Step 2: Render Live Transcript Preview in `AudioRecorderContainer.tsx`

Add an animated transcript preview container directly below the canvas wave:
```tsx
{isRecording && liveTranscript && (
  <div className="w-full text-xs text-center text-muted-foreground font-mono bg-muted/30 px-3 py-1.5 rounded-lg border border-border/20 animate-fade-in">
    "{liveTranscript}..."
  </div>
)}
```

**Verify**: `cmd /c pnpm build:web` → exit 0

## Test plan

- Test recording start & stop lifecycle ensuring `SpeechRecognition` stops when recording stops.
- Test fallback when `SpeechRecognition` is undefined in SSR/node environment.

**Verification**: `cmd /c pnpm build:web` exits 0.

## Done criteria

- [ ] `cmd /c pnpm build:web` exits 0
- [ ] `cmd /c pnpm lint` exits 0
- [ ] Live text transcript preview appears in browser UI while recording
- [ ] `plans/README.md` updated

## STOP conditions

- If adding `SpeechRecognition` event listeners interferes with `MediaRecorder` mic input stream, stop and report.
