## What to build

Build the `ConversationPane` feature component — the scrollable transcript that shows the full conversation history with inline grammar correction highlights. This component is purely presentational (receives data via props) and is rendered by the `TutorSessionContainer`.

**Component architecture:**

```
components/conversation-pane/
├── components/
│   ├── TutorMessage.tsx         # Renders the tutor's turn (avatar + text bubble)
│   ├── UserMessage.tsx          # Renders the user's turn with annotated corrections
│   ├── CorrectionHighlight.tsx  # Inline span: strikethrough original, tooltip with fix
│   ├── VocabularyChip.tsx       # Small badge showing vocabulary upgrade suggestion
│   └── ProcessingIndicator.tsx  # Skeleton/pulsing dots while waiting for API response
├── ConversationPaneContainer.tsx # Orchestrator — auto-scrolls to bottom on new messages
└── index.ts
```

**`CorrectionHighlight` behavior:** Wraps a segment of the user's original text. Renders the original word with a red strikethrough. On hover/focus, a `Tooltip` (shadcn) shows the corrected form and a brief grammatical explanation.

**`VocabularyChip`:** A `Badge` (variant `secondary`) placed below the user's message when vocabulary suggestions exist. Shows "instead of '[original]', try '[suggestion]'".

**`ConversationPaneContainer`:** Uses a `useEffect` to `scrollIntoView()` the bottom of the message list whenever new messages are added. Accepts a `showCorrections: boolean` prop to toggle inline annotations on/off (user story 20).

The `ScrollArea` shadcn component wraps the message list to provide styled overflow scrolling.

## Acceptance criteria

- [ ] Tutor messages appear in distinct left-aligned bubbles with a tutor avatar icon.
- [ ] User messages appear in right-aligned bubbles.
- [ ] Grammar errors in user messages are wrapped in `CorrectionHighlight` spans (red strikethrough).
- [ ] Hovering or focusing a `CorrectionHighlight` shows a `Tooltip` with the corrected form and explanation.
- [ ] Vocabulary suggestions appear as `Badge` chips below the user's message.
- [ ] `ProcessingIndicator` (3 animated dots) is shown at the bottom of the list when `isProcessing={true}`.
- [ ] The pane auto-scrolls to the bottom when a new message is added.
- [ ] Setting `showCorrections={false}` hides all `CorrectionHighlight` annotations (plain text only).
- [ ] Unit tests: renders mock conversation history; verifies corrections are present or hidden based on `showCorrections` prop; verifies `ProcessingIndicator` renders when `isProcessing={true}`.
- [ ] No TypeScript errors; no `any` types.

## Blocked by

- `04-shadcn-design-system.md`
- `02-shared-types-library.md`

## Status
Pending
