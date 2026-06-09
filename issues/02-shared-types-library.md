## What to build

Define all shared TypeScript interfaces and types in `libs/shared-types` that are consumed by both `apps/web` and `apps/api`. This single library is the contract between frontend and backend, ensuring type safety across the monorepo without duplication.

The library must export:

- `TutorRequest` — the payload the frontend sends to the API on each conversational turn (audio base64, MIME type, conversation history, mode, and optional scenario).
- `TutorResponse` — the full response from the API per turn (user transcript, corrected transcript, corrections list, vocabulary suggestions, pronunciation tips, tutor's text reply, audio base64, and optional score snapshot).
- `ScoreReport` — the end-of-session evaluation structure (scores for fluency, vocabulary, grammar, pronunciation; overall band; feedback summary; common mistakes; example improvements).
- `ConversationMode` — a union type `'ielts' | 'business' | 'casual'`.
- `ConversationTurn` — a single history entry `{ role: 'user' | 'tutor'; text: string }`.
- `IELTSScenario` — a union type `'ielts-part-1' | 'ielts-part-2' | 'ielts-part-3'`.
- `BusinessScenario` — a union type `'job-interview' | 'client-presentation' | 'team-meeting'`.

All types are plain TypeScript interfaces (no runtime dependencies).

## Acceptance criteria

- [ ] `libs/shared-types/src/index.ts` exports all types listed above.
- [ ] `TutorRequest` is importable from `@language-tutor/shared-types` in both `apps/web` and `apps/api` without TypeScript errors.
- [ ] `TutorResponse` and `ScoreReport` are importable from `@language-tutor/shared-types`.
- [ ] All union types (`ConversationMode`, `IELTSScenario`, `BusinessScenario`) are exported.
- [ ] No runtime code (functions, classes) exists in this library — types only.
- [ ] `tsc --noEmit` passes with zero errors across the monorepo after this change.

## Blocked by

- `01-nx-monorepo-scaffold.md`

## Status
Pending
