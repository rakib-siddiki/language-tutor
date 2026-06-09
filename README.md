# 🎙️ Language Tutor

> **Zero-cost, real-time AI-powered speaking partner** for IELTS Speaking prep, Business English, and Casual conversation practice.

Built with **NX monorepo**, **Next.js 15** (App Router), **NestJS**, **Gemini 2.0 Flash** (multimodal audio), and **Edge TTS**.

---

## ✨ Features

- 🎯 **3 Practice Modes** — IELTS Speaking (Band 1-9), Business English, and Casual Conversation
- 🧠 **Gemini 2.0 Flash** — Transcribes your audio, generates a contextual response, and grades you simultaneously
- 🔊 **Edge TTS** — Natural-sounding Microsoft Edge voices for the tutor's responses
- 📝 **Inline Corrections** — Grammar and vocabulary errors highlighted directly in the transcript
- 📊 **Session Report** — Detailed IELTS-style evaluation at the end of each session
- 💰 **Zero cost** — Bring your own free Gemini API key; no subscriptions

---

## 🏗️ Monorepo Structure

```
language-tutor/
├── apps/
│   ├── web/          # Next.js 15 App Router frontend
│   └── api/          # NestJS backend
├── libs/
│   ├── shared-types/ # Shared TypeScript interfaces (TutorRequest, TutorResponse, ScoreReport)
│   └── ui/           # Shared shadcn/ui components
├── issues/           # Project issue tracking files
├── prd.md            # Product Requirements Document
├── nx.json           # NX workspace configuration
└── pnpm-workspace.yaml
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v22+
- **pnpm** v10+ (`npm install -g pnpm`)
- A free **Gemini API key** from [Google AI Studio](https://aistudio.google.com)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/rakib-siddiki/language-tutor.git
cd language-tutor

# 2. Install dependencies
pnpm install

# 3. Configure environment variables
cp .env.example apps/api/.env
# Edit apps/api/.env and add your GEMINI_API_KEY

# 4. Start the development servers (in separate terminals)
pnpm dev:web    # Next.js on http://localhost:3000
pnpm dev:api    # NestJS on http://localhost:3001
```

Or use NX directly:

```bash
npx nx serve web    # Frontend
npx nx serve api    # Backend
```

### Running Both Simultaneously

```bash
npx nx run-many --target=serve --projects=web,api --parallel
```

---

## 🔧 Development Commands

| Command | Description |
|---------|-------------|
| `pnpm dev:web` | Start Next.js dev server |
| `pnpm dev:api` | Start NestJS dev server |
| `pnpm build:web` | Build Next.js for production |
| `pnpm build:api` | Build NestJS for production |
| `pnpm lint` | Lint all projects |
| `pnpm test` | Run all tests |
| `npx nx graph` | Visualize the project dependency graph |

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/tutor/chat` | Submit audio turn, receive response + corrections |
| `POST` | `/api/tutor/evaluate` | End session and receive full ScoreReport |

---

## 🗺️ Roadmap

See [prd.md](./prd.md) for the full Product Requirements Document and [issues/](./issues/) for the implementation backlog.

---

## 📄 License

MIT — See [LICENSE](./LICENSE) for details.
