## What to build

Set up the NestJS backend application (`apps/api`) end-to-end for the single critical API endpoint: `POST /api/tutor/chat`. This slice wires together the Gemini SDK and Edge TTS into a working `TutorService`, making the full audio-in → response-out pipeline functional and testable before any frontend work.

**API Flow for `POST /api/tutor/chat`:**
1. Receive a `TutorRequest` body (audio base64, mimeType, history, mode, scenario).
2. Build a structured Gemini prompt from the mode/scenario and conversation history.
3. Call `gemini-2.0-flash` with the audio as `inlineData` and a strict `responseSchema` enforcing the `TutorResponse` JSON shape.
4. Parse Gemini's structured JSON response.
5. Call `msedge-tts` server-side to synthesize the `tutorText` into an MP3 buffer, selecting the voice by mode (IELTS → `en-GB-SoniaNeural`, Business/Casual → `en-US-JennyNeural`).
6. Base64-encode the MP3 buffer and attach it to the response as `audioBase64`.
7. Return the full `TutorResponse` JSON.

Also expose `POST /api/tutor/evaluate` — identical to `/chat` but instructs Gemini to compile and return the complete `ScoreReport` in `scoreSnapshot`.

`ConfigModule` loads `GEMINI_API_KEY` from `.env`. CORS must allow `http://localhost:3000`.

## Acceptance criteria

- [ ] `POST /api/tutor/chat` accepts a valid `TutorRequest` body and returns a valid `TutorResponse`.
- [ ] The response includes a non-empty `userTranscript` (transcribed from the audio by Gemini).
- [ ] The response includes `tutorText` (Gemini's conversational reply).
- [ ] The response includes `audioBase64` (an Edge TTS MP3 for `tutorText`).
- [ ] The response includes `corrections` array (empty array if no errors).
- [ ] `POST /api/tutor/evaluate` returns a `TutorResponse` where `scoreSnapshot` is populated.
- [ ] API returns a structured 400 error for missing required fields.
- [ ] API returns a structured 500 error (with a user-friendly message) if Gemini or Edge TTS fails.
- [ ] `GEMINI_API_KEY` is read from environment — not hardcoded.
- [ ] CORS allows `http://localhost:3000`.
- [ ] `TutorService` integration test passes with a mocked Gemini response.

## Blocked by

- `02-shared-types-library.md`

## Status
Pending
