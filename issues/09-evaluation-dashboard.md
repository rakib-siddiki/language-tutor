## What to build

Build the `EvaluationDashboard` feature — the end-of-session report card rendered when the user clicks "End Session". It calls `POST /api/tutor/evaluate` to generate the full `ScoreReport` and then presents it as a rich visual summary.

**Component architecture:**

```
components/evaluation-dashboard/
├── components/
│   ├── ScoreCard.tsx              # Single category score: label + animated progress bar + numeric band
│   ├── OverallBandDisplay.tsx     # Large, prominent overall IELTS band (or equivalent) with ring chart
│   ├── CommonMistakesList.tsx     # Bulleted list of recurring errors from the session
│   ├── ImprovementExamples.tsx    # Before/after example pairs (original → improved)
│   ├── FeedbackSummary.tsx        # Tutor's prose summary rendered in a Card
│   └── ExportButton.tsx           # Triggers browser print dialog for PDF export
├── EvaluationDashboardContainer.tsx # Orchestrator — fetches ScoreReport if not already available
└── index.ts
```

**`OverallBandDisplay`:** Renders an SVG ring/donut chart (built with raw SVG, not a chart library) showing the overall band score out of 9 (IELTS) or a 0–100 score for Business/Casual modes. Includes a large centered number and a color-coded label (e.g., "Good User").

**`ScoreCard`:** Uses the shadcn `Progress` component for the bar. Scores animate from 0 to the final value over 800ms on mount using a CSS transition.

**`ExportButton`:** Calls `window.print()`. A `@media print` CSS block hides navigation elements and renders only the dashboard content.

**Loading state:** While `POST /api/tutor/evaluate` is in-flight, the dashboard shows `Skeleton` placeholders for each score card.

**Navigation:** A "Start New Session" button at the bottom resets app state and returns to the session setup page.

## Acceptance criteria

- [ ] `EvaluationDashboardContainer` calls `POST /api/tutor/evaluate` on mount and displays a loading skeleton while awaiting the response.
- [ ] `OverallBandDisplay` shows the overall band score prominently with a filled ring/donut.
- [ ] All four `ScoreCard` components (Fluency, Vocabulary, Grammar, Pronunciation) render with animated progress bars.
- [ ] `CommonMistakesList` renders each mistake as a list item.
- [ ] `ImprovementExamples` renders each before/after pair in a visually distinct two-column layout.
- [ ] `FeedbackSummary` renders the prose feedback inside a `Card`.
- [ ] `ExportButton` triggers `window.print()` and the printed output hides navigation chrome.
- [ ] A "Start New Session" button is present and navigates back to the setup page.
- [ ] The dashboard is fully responsive (stacks to single column on mobile).
- [ ] Unit test: renders with a mock `ScoreReport` and verifies all four score categories and the overall band are present in the DOM.
- [ ] No TypeScript errors; no `any` types.

## Blocked by

- `08-tutor-session-container.md`

## Status
Pending
