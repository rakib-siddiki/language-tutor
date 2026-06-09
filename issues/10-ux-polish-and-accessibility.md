## What to build

Polish the complete application for a premium user experience — covering responsiveness, accessibility, error resilience, UX micro-interactions, and the Edge TTS fallback. This slice is a horizontal hardening pass across all previously built components.

**Specific items:**

1. **Responsive layout audit**: Verify and fix all components at 375px, 768px, and 1280px breakpoints. The session page must use a two-column layout on desktop (conversation pane left, audio recorder right) and a single stacked column on mobile.

2. **Keyboard shortcuts**: Implement a global `keydown` listener (Space to toggle recording when session is active, Escape to dismiss dialogs/alerts). Display a keyboard shortcuts popover accessible from the session header.

3. **API throttle feedback**: If the backend returns a 429 (rate limit), display a user-friendly `Alert` with a countdown timer before the user can retry.

4. **Edge TTS fallback**: If the `/api/tutor/chat` response has an empty `audioBase64`, automatically fall back to `window.speechSynthesis.speak()` using the browser's native TTS for the `tutorText`.

5. **Microphone permission UX**: On session start, proactively request mic permission before the user presses record for the first time. If denied, show the `PermissionPrompt` with browser-specific instructions (Chrome, Firefox, Safari).

6. **Error boundary**: Wrap `TutorSessionContainer` in a React Error Boundary that catches unexpected rendering errors and shows a "Something went wrong" recovery UI with a "Reload" button.

7. **Accessibility audit**: Ensure all interactive elements have `aria-label` attributes; all dialogs have `DialogTitle`; all icons used as standalone UI have `aria-hidden`; color contrast meets WCAG AA.

8. **Loading skeletons**: Confirm `Skeleton` components are shown during all async loading states (session evaluation, initial API call).

## Acceptance criteria

- [ ] The conversation layout is two-column on `md` and above, single-column on mobile.
- [ ] Space key correctly toggles recording during an active session.
- [ ] A 429 response from the API shows a rate-limit `Alert` with a visible countdown.
- [ ] If `audioBase64` is empty in the response, `speechSynthesis` is used as a fallback and the user is informed via a `Badge` ("Using browser voice").
- [ ] Mic permission is requested proactively on session start, not on first record attempt.
- [ ] The React Error Boundary catches a simulated render error and shows the recovery UI.
- [ ] All interactive elements have accessible names (`aria-label` or visible label).
- [ ] All `Dialog`/`Sheet` overlays have a `DialogTitle` (visible or `sr-only`).
- [ ] `Skeleton` components are visible for every async loading state.
- [ ] Lighthouse accessibility score ≥ 90 on the session page.

## Blocked by

- `09-evaluation-dashboard.md`

## Status
Pending
