## What to build

Build the `AudioRecorder` feature component — the core input mechanism of the application. This component handles microphone permission requests, audio capture via `MediaRecorder`, and emits a `{ audioBase64, mimeType }` object when recording ends.

**Component architecture** (following `create-frontend-feature` pattern):

```
components/audio-recorder/
├── components/
│   ├── WaveformVisualizer.tsx  # Animated bars driven by Web Audio AnalyserNode
│   ├── RecordButton.tsx        # Single toggle button (idle / recording / processing states)
│   └── PermissionPrompt.tsx    # Alert shown when mic is denied or not yet granted
├── hooks/
│   └── useAudioRecorder.ts     # Encapsulates MediaRecorder lifecycle and AnalyserNode
├── AudioRecorderContainer.tsx  # Orchestrator ("use client")
└── index.ts
```

**`useAudioRecorder` hook behavior:**
- On mount: checks for `navigator.mediaDevices.getUserMedia` support.
- `startRecording()`: requests mic permission if needed, detects the best supported MIME type via `MediaRecorder.isTypeSupported` (prefer `audio/webm;codecs=opus`, fallback `audio/mp4`), starts `MediaRecorder`, and connects an `AnalyserNode` for waveform data.
- `stopRecording()`: stops `MediaRecorder`, collects `ondataavailable` chunks into a `Blob`, converts to base64, emits `onComplete({ audioBase64, mimeType })`.
- State machine: `'idle' | 'requesting-permission' | 'recording' | 'processing'`.

**`WaveformVisualizer`** renders 20 animated `<div>` bars whose heights are driven by `requestAnimationFrame` reading from the `AnalyserNode`. Uses CSS keyframe animations for a smooth, pulsing effect.

Keyboard shortcut: pressing `Space` toggles recording when the recorder is focused.

## Acceptance criteria

- [ ] `RecordButton` cycles through idle → recording → processing → idle states with distinct visual styles for each.
- [ ] `WaveformVisualizer` shows animated bars only while recording; bars are static when idle.
- [ ] `PermissionPrompt` is displayed when mic permission is denied, with a link to browser settings instructions.
- [ ] `onComplete({ audioBase64, mimeType })` callback fires after stopping with a valid non-empty base64 string.
- [ ] Detected MIME type is correctly reported (e.g., `audio/webm;codecs=opus` on Chrome, `audio/mp4` on Safari).
- [ ] Space key toggles recording when the button is focused.
- [ ] `useAudioRecorder` cleans up `MediaStream` tracks and `AudioContext` on unmount (no memory leaks).
- [ ] Component renders correctly on mobile (touch-friendly button, minimum 44×44px touch target).
- [ ] Unit tests cover: idle→recording→idle transitions, `onComplete` callback firing, cleanup on unmount.

## Blocked by

- `04-shadcn-design-system.md`

## Status
Pending
