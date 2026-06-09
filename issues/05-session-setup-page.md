## What to build

Build the landing page and session setup screen for `apps/web`. This is the first screen a user sees, and it covers user stories 1–6 from the PRD (mode selection, API key input, IELTS part or Business scenario selection, voice selection, and the "Session Ready" state).

**Component architecture** (following the `create-frontend-feature` pattern):

```
components/session-setup/
├── components/
│   ├── ModeCard.tsx            # Individual mode card (IELTS, Business, Casual)
│   ├── ScenarioSelector.tsx    # Sub-scenario picker (IELTS parts / business scenarios)
│   ├── VoiceSelector.tsx       # Voice dropdown (British, American, Australian)
│   └── ApiKeyInput.tsx         # Masked API key field with localStorage persistence
├── SessionSetupContainer.tsx   # Orchestrator ("use client")
└── index.ts
```

**Page:** `app/(tutor)/page.tsx` — renders `SessionSetupContainer` when no session is active, and `TutorSessionContainer` (from issue 06) once a session starts.

The `SessionSetupContainer` manages form state with `useReducer` (`SessionSetupReducer`). On "Start Session" it validates that a mode is selected and an API key is present (from localStorage or manual entry), then transitions to the active session view.

All UI uses shadcn components: `Card`, `Badge`, `Button`, `Select` (voice), `Input` (API key), `Tabs` (mode switching), `Alert` (validation errors).

## Acceptance criteria

- [ ] Three mode cards (IELTS, Business, Casual) are displayed and one must be selected before starting.
- [ ] Selecting IELTS reveals a Part selector (Part 1, Part 2, Part 3).
- [ ] Selecting Business reveals a scenario selector (Job Interview, Client Presentation, Team Meeting).
- [ ] API key field masks input, persists to `localStorage` on blur, and pre-fills from `localStorage` on load.
- [ ] Voice selector shows at least 3 options and persists selection to `localStorage`.
- [ ] "Start Session" button is disabled until a mode and API key are provided.
- [ ] Validation `Alert` appears with an actionable message if the user clicks "Start Session" without required fields.
- [ ] The page is fully responsive (mobile-first, works on 375px width screens).
- [ ] Dark mode styling is applied correctly using semantic shadcn tokens.
- [ ] No TypeScript errors; no `any` types.

## Blocked by

- `04-shadcn-design-system.md`

## Status
Pending
