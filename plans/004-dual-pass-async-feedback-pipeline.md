# Plan 004: Dual-Pass Async Feedback Pipeline for Instant Voice Response

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 8d8224b..HEAD -- apps/api/src/tutor/ apps/web/src/hooks/`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: plans/003-sse-streaming-tutor-response.md
- **Category**: perf
- **Planned at**: commit `8d8224b`, 2026-07-23

## Why this matters

Currently, Gemini must generate transcription, grammar corrections, vocabulary upgrades, pronunciation tips, AND tutor response text in a single rigid JSON schema pass. This inflates completion token output and forces the LLM to balance creative roleplay with complex JSON structure. By splitting this into two passes—**Pass 1 (Fast Voice Response)** and **Pass 2 (Deferred Async Detailed Feedback)**—the user hears the tutor's voice response almost instantly while detailed linguistic analysis is computed asynchronously in the background and delivered to the feedback panel.

## Current state

- `apps/api/src/tutor/tutor.service.ts:75-133`: Single-pass `ai.models.generateContent` call requiring 6 mandatory JSON fields.
- `apps/web/src/hooks/useTutorSessionContainer.ts:213-235`: Expects single synchronous payload containing both `userTranscript`/`corrections`/`vocabularySuggestions` AND `tutorText`/`audioBase64`.

## Commands you will need

| Purpose   | Command | Expected on success |
|-----------|---------|---------------------|
| Build API | `cmd /c pnpm build:api` | exit 0, compiled successfully |
| Build Web | `cmd /c pnpm build:web` | exit 0, built successfully |
| Lint      | `cmd /c pnpm lint` | exit 0, no lint errors |

## Scope

**In scope**:
- `apps/api/src/tutor/tutor.service.ts` (Add `processFastTurn` and `processFeedbackAsync` methods)
- `apps/api/src/tutor/tutor.controller.ts` (Add `@Post('chat-fast')` and `@Post('chat-feedback')` endpoints)
- `apps/web/src/hooks/useTutorSessionContainer.ts` (Trigger fast turn first, then fetch async feedback in background)

**Out of scope**:
- `apps/api/src/tutor/tutor.service.ts:169-265` (`evaluateSession` endpoint)
- Shared types structural breaking changes in `@language-tutor/shared-types`

## Git workflow

- Branch: `advisor/004-dual-pass-async-feedback-pipeline`
- Conventional commits e.g. `feat(api): split speaking pipeline into fast turn and async feedback`

## Steps

### Step 1: Add `processFastTurn` in `tutor.service.ts`

Create a lightweight prompt and schema for `processFastTurn`:
- Only requests `userTranscript` and `tutorText`.
- Reduces Gemini completion latency to ~400ms.
- Immediately trigger Edge TTS synthesis on `tutorText`.

**Verify**: `cmd /c pnpm build:api` → exit 0

### Step 2: Add `processFeedbackAsync` in `tutor.service.ts`

Create `processFeedbackAsync` to evaluate user audio + transcript and produce `corrections`, `vocabularySuggestions`, and `pronunciationTips`.

**Verify**: `cmd /c pnpm build:api` → exit 0

### Step 3: Wire Controller and Web Container Hook

In `apps/api/src/tutor/tutor.controller.ts`, expose `@Post('fast-chat')` and `@Post('feedback')`.
In `apps/web/src/hooks/useTutorSessionContainer.ts`:
1. Call `fast-chat` → immediately display transcript & play tutor audio.
2. In parallel background `Promise`, call `feedback` → seamlessly populate corrections and tips in conversation state when ready.

**Verify**: `cmd /c pnpm build:web` → exit 0

## Test plan

- Test `processFastTurn` returns transcript and tutor text without waiting for full feedback schema.
- Test `processFeedbackAsync` populates corrections on valid history input.

**Verification**: `cmd /c pnpm build:api` and `cmd /c pnpm build:web` exit 0.

## Done criteria

- [ ] `cmd /c pnpm build:api` exits 0
- [ ] `cmd /c pnpm build:web` exits 0
- [ ] `cmd /c pnpm lint` exits 0
- [ ] Fast turn response latency < 800ms
- [ ] `plans/README.md` updated

## STOP conditions

- If separating the JSON schema breaks contract with `TutorResponse` type in `libs/shared-types`, update `libs/shared-types` interfaces explicitly or stop and report.

## Maintenance notes

- Frontend feedback pane should show a subtle loading spinner for "Analyzing grammar & pronunciation..." while Pass 2 completes.
