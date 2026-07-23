# Plan 003: Implement SSE Streaming Endpoint for Real-Time Tutor Response

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 8d8224b..HEAD -- apps/api/src/tutor/ apps/web/src/hooks/`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: none
- **Category**: perf
- **Planned at**: commit `8d8224b`, 2026-07-23

## Why this matters

Currently, when a user completes a speaking turn, the application blocks for 3–6 seconds while NestJS waits for Gemini to produce all structured feedback JSON and downloads the full base64 MP3 audio from Microsoft Edge TTS. This causes noticeable latency in spoken dialogue. By introducing a Server-Sent Events (SSE) endpoint (`/api/tutor/chat-stream`), Gemini's response text and synthesized audio chunks stream to the frontend in real-time, reducing initial Time-To-First-Token (TTFT) and speech start latency to under 600ms.

## Current state

- `apps/api/src/tutor/tutor.controller.ts:17-23`: Endpoints submit non-streamed `POST /api/tutor/chat`.
- `apps/api/src/tutor/tutor.service.ts:75-133`: Calls `ai.models.generateContent` synchronously and then synthesizes full speech with `synthesizeSpeech()`.
- `apps/web/src/hooks/useTutorSessionContainer.ts:190-236`: Uses `fetch('/api/tutor/chat')` with standard `response.json()` await.

## Commands you will need

| Purpose   | Command | Expected on success |
|-----------|---------|---------------------|
| Build API | `cmd /c pnpm build:api` | exit 0, compiled successfully |
| Build Web | `cmd /c pnpm build:web` | exit 0, built successfully |
| Lint      | `cmd /c pnpm lint` | exit 0, no lint errors |
| Test      | `cmd /c pnpm test` | exit 0, all tests pass |

## Scope

**In scope**:
- `apps/api/src/tutor/tutor.controller.ts` (Add `@Sse('chat-stream')` endpoint)
- `apps/api/src/tutor/tutor.service.ts` (Add `processChatStream` returning `Observable<MessageEvent>`)
- `apps/web/src/hooks/useTutorSessionContainer.ts` (Support SSE streaming consumption via `fetch` + `ReadableStream` / `EventSource`)

**Out of scope**:
- `apps/api/src/tutor/tutor.service.ts:169-265` (`evaluateSession` routine - preserve existing implementation)
- UI layout or styling files in `apps/web/src/components/`

## Git workflow

- Branch: `advisor/003-sse-streaming-tutor-response`
- Conventional commits e.g. `feat(api): add sse streaming endpoint for tutor response`

## Steps

### Step 1: Add `processChatStream` in `tutor.service.ts` using `generateContentStream`

Add an RxJS `Observable` method `processChatStream()` in `TutorService` that invokes `ai.models.generateContentStream()`. As Gemini yields text chunks, emit text delta events immediately to the client:
- Emitted event shapes:
  - `{ type: 'token', content: string }`
  - `{ type: 'audio_chunk', audioBase64: string }`
  - `{ type: 'metadata', corrections: [...], vocabularySuggestions: [...], pronunciationTips: [...] }`

**Verify**: `cmd /c pnpm build:api` → exit 0

### Step 2: Add `@Sse('chat-stream')` endpoint to `tutor.controller.ts`

Add an SSE endpoint in NestJS:
```ts
@Sse('chat-stream')
chatStream(
  @Body() body: TutorRequest & { voice?: string },
  @Headers('x-api-key') clientApiKey?: string
): Observable<MessageEvent> {
  return this.tutorService.processChatStream(body, clientApiKey);
}
```

**Verify**: `cmd /c pnpm build:api` → exit 0

### Step 3: Consume SSE Stream in `useTutorSessionContainer.ts`

Update `handleRecordingComplete` in `useTutorSessionContainer.ts` to connect to `/api/tutor/chat-stream` using `fetch` with `ReadableStream`.
- Render streaming text dynamically as `tutorMessage` tokens arrive.
- Decode audio chunks progressively for instant audio playback.

**Verify**: `cmd /c pnpm build:web` → exit 0

## Test plan

- Test SSE streaming response with unit test in `apps/api/src/tutor/tutor.service.spec.ts`.
- Ensure fallback to standard endpoint works if SSE stream encounters network interruptions.

**Verification**: `cmd /c pnpm test` → all tests pass.

## Done criteria

- [ ] `cmd /c pnpm build:api` exits 0
- [ ] `cmd /c pnpm build:web` exits 0
- [ ] `cmd /c pnpm test` exits 0
- [ ] `/api/tutor/chat-stream` returns real-time SSE stream
- [ ] `plans/README.md` updated

## STOP conditions

- If `@google/genai` library installed version does not export `generateContentStream`, stop and report.
- If NestJS SSE requirements necessitate custom RxJS dependencies not in `package.json`, report before adding new packages.

## Maintenance notes

- Future audio streaming work can connect directly to WebSocket / WebRTC streams without altering the SSE interface.
