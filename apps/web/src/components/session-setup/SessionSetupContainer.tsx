'use client';

import React, { useState, useEffect } from 'react';
import {
  Button,
  Input,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Alert,
  AlertTitle,
  AlertDescription,
  Badge
} from '@/components/ui';
import {
  GraduationCap,
  Briefcase,
  MessageCircle,
  Key,
  Volume2,
  Play,
  Eye,
  EyeOff,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Globe,
  Mic,
  Award,
} from 'lucide-react';
import { ConversationMode } from '@language-tutor/shared-types';

interface SessionSetupContainerProps {
  onStartSession: (config: {
    mode: ConversationMode;
    scenario: string;
    apiKey: string;
    voice: string;
  }) => void;
}

const VOICES = [
  { value: 'en-US-AriaNeural', label: 'Aria', accent: 'US Female', flag: '🇺🇸' },
  { value: 'en-US-GuyNeural', label: 'Guy', accent: 'US Male', flag: '🇺🇸' },
  { value: 'en-GB-SoniaNeural', label: 'Sonia', accent: 'UK Female', flag: '🇬🇧' },
  { value: 'en-GB-RyanNeural', label: 'Ryan', accent: 'UK Male', flag: '🇬🇧' },
  { value: 'en-AU-NatashaNeural', label: 'Natasha', accent: 'AU Female', flag: '🇦🇺' },
  { value: 'en-IN-NeerjaNeural', label: 'Neerja', accent: 'IN Female', flag: '🇮🇳' },
];

const MODES = [
  {
    id: 'ielts' as ConversationMode,
    icon: GraduationCap,
    label: 'IELTS Speaking',
    badge: 'Academic',
    badgeColor: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
    description: 'Practice Parts 1–3 with simulated exam conditions and official band score feedback.',
    accentColor: 'violet',
    features: ['Band score feedback', 'Official exam format', 'Timed practice'],
  },
  {
    id: 'business' as ConversationMode,
    icon: Briefcase,
    label: 'Business English',
    badge: 'Professional',
    badgeColor: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    description: 'Rehearse interviews, presentations, and team standups to master executive communication.',
    accentColor: 'blue',
    features: ['Interview roleplay', 'Client scenarios', 'Leadership tone'],
  },
  {
    id: 'casual' as ConversationMode,
    icon: MessageCircle,
    label: 'Casual Chat',
    badge: 'Social',
    badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    description: 'Build fluency through natural conversations about travel, culture, hobbies, and daily life.',
    accentColor: 'emerald',
    features: ['Natural dialogue', 'No pressure', 'Fun topics'],
  },
];

const MODE_ACCENT_STYLES: Record<string, {
  active: string;
  activeIcon: string;
  hover: string;
  glow: string;
}> = {
  violet: {
    active: 'border-violet-500/60 bg-violet-500/5 shadow-violet-500/10',
    activeIcon: 'bg-violet-500 text-white shadow-violet-500/30',
    hover: 'hover:border-violet-500/30 hover:bg-violet-500/5',
    glow: 'shadow-lg shadow-violet-500/10',
  },
  blue: {
    active: 'border-blue-500/60 bg-blue-500/5 shadow-blue-500/10',
    activeIcon: 'bg-blue-500 text-white shadow-blue-500/30',
    hover: 'hover:border-blue-500/30 hover:bg-blue-500/5',
    glow: 'shadow-lg shadow-blue-500/10',
  },
  emerald: {
    active: 'border-emerald-500/60 bg-emerald-500/5 shadow-emerald-500/10',
    activeIcon: 'bg-emerald-500 text-white shadow-emerald-500/30',
    hover: 'hover:border-emerald-500/30 hover:bg-emerald-500/5',
    glow: 'shadow-lg shadow-emerald-500/10',
  },
};

export default function SessionSetupContainer({ onStartSession }: SessionSetupContainerProps) {
  const [mode, setMode] = useState<ConversationMode | null>(null);
  const [scenario, setScenario] = useState<string>('');
  const [apiKey, setApiKey] = useState('');
  const [voice, setVoice] = useState('en-US-AriaNeural');

  const [showKey, setShowKey] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('language-tutor-api-key') || '';
      const savedVoice = localStorage.getItem('language-tutor-voice') || 'en-US-AriaNeural';
      setApiKey(savedKey);
      setVoice(savedVoice);
    }
  }, []);

  useEffect(() => {
    if (mode === 'ielts') {
      setScenario('ielts-part-1');
    } else if (mode === 'business') {
      setScenario('job-interview');
    } else if (mode === 'casual') {
      setScenario('general-chitchat');
    } else {
      setScenario('');
    }
  }, [mode]);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!mode) {
      setErrorMsg('Please select a learning mode to continue.');
      return;
    }

    if (!apiKey.trim()) {
      setErrorMsg('A Gemini API key is required to start your session.');
      return;
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('language-tutor-api-key', apiKey.trim());
      localStorage.setItem('language-tutor-voice', voice);
    }

    setIsStarting(true);
    setTimeout(() => {
      onStartSession({ mode, scenario, apiKey: apiKey.trim(), voice });
      setIsStarting(false);
    }, 400);
  };

  if (!isMounted) return null;

  const isFormValid = mode !== null && apiKey.trim() !== '';
  const selectedVoice = VOICES.find((v) => v.value === voice);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-16 animate-fade-in">
      {/* ── Hero Section ── */}
      <div className="text-center mb-14">
        {/* Floating orb decorations */}
        <div
          className="absolute left-1/4 -translate-x-1/2 -top-12 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, hsl(262 88% 68% / 0.10) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
          aria-hidden="true"
        />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/25 text-primary mb-6 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 animate-pulse-slow" />
          <span className="text-xs font-bold uppercase tracking-widest font-outfit">
            Powered by Gemini 2.0 Multimodal
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight font-outfit mb-5 leading-[1.05]">
          <span className="gradient-text">Speak Fluent.</span>
          <br />
          <span className="text-foreground/90">Think Confident.</span>
        </h1>

        <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto font-sans leading-relaxed">
          Your real-time AI conversation partner for IELTS, Business, and everyday English fluency.
        </p>

        {/* Stats row */}
        <div className="flex items-center justify-center gap-6 mt-8 flex-wrap">
          {[
            { icon: Mic, label: 'Real-time Voice' },
            { icon: Award, label: 'Band Score Feedback' },
            { icon: Globe, label: '6 Accent Voices' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon className="h-4 w-4 text-primary/70" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleStart} className="space-y-8">
        {/* ── Section 1: Choose Mode ── */}
        <section aria-labelledby="mode-heading" className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-black shadow-lg shadow-primary/30">
              1
            </div>
            <h2 id="mode-heading" className="text-lg font-bold font-outfit text-foreground">
              Choose Your Training Mode
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {MODES.map((m) => {
              const isActive = mode === m.id;
              const accent = MODE_ACCENT_STYLES[m.accentColor];
              const Icon = m.icon;

              return (
                <button
                  key={m.id}
                  type="button"
                  id={`mode-${m.id}`}
                  onClick={() => setMode(m.id)}
                  className={`
                    relative text-left rounded-2xl border p-6 transition-all duration-300 group cursor-pointer
                    ${isActive
                      ? `${accent.active} shadow-xl ring-1 ring-inset ${accent.glow}`
                      : `border-border/60 bg-card/40 glass ${accent.hover}`
                    }
                  `}
                >
                  {/* Selected check */}
                  <div className={`
                    absolute top-4 right-4 transition-all duration-300
                    ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
                  `}>
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>

                  {/* Icon */}
                  <div className={`
                    p-3 rounded-xl w-fit mb-4 transition-all duration-300 shadow-md
                    ${isActive
                      ? accent.activeIcon
                      : 'bg-muted text-muted-foreground group-hover:scale-110'
                    }
                  `}>
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Badge */}
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border mb-3 ${m.badgeColor}`}>
                    {m.badge}
                  </span>

                  <h3 className="text-base font-bold font-outfit mb-2 text-foreground">{m.label}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">{m.description}</p>

                  {/* Features */}
                  <ul className="space-y-1.5">
                    {m.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/50 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Section 2: Sub-scenario ── */}
        {mode && (
          <section
            aria-labelledby="scenario-heading"
            className="space-y-5 animate-slide-up"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-black shadow-lg shadow-primary/30">
                2
              </div>
              <h2 id="scenario-heading" className="text-lg font-bold font-outfit text-foreground">
                Configure Your Scenario
              </h2>
            </div>

            <div className="glass rounded-2xl border border-border/50 p-6">
              {mode === 'ielts' && (
                <div className="space-y-3">
                  <Label htmlFor="ielts-part" className="text-sm font-semibold text-foreground">
                    Select Exam Part
                  </Label>
                  <Select value={scenario} onValueChange={(val) => setScenario(val || '')}>
                    <SelectTrigger id="ielts-part" className="w-full bg-background/60 border-border/60 h-11 rounded-xl">
                      <SelectValue placeholder="Choose a part" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ielts-part-1">Part 1 — Introduction & Familiar Topics</SelectItem>
                      <SelectItem value="ielts-part-2">Part 2 — Individual Long Turn (Cue Card)</SelectItem>
                      <SelectItem value="ielts-part-3">Part 3 — Two-Way Analytical Discussion</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {scenario === 'ielts-part-1' && '💬 The examiner will ask questions about yourself, hobbies, and your home.'}
                    {scenario === 'ielts-part-2' && '🗣️ You will be given a cue card prompt to speak about for 1–2 minutes.'}
                    {scenario === 'ielts-part-3' && '🧠 Abstract, thematic questions linked to your Part 2 topic.'}
                  </p>
                </div>
              )}

              {mode === 'business' && (
                <div className="space-y-3">
                  <Label htmlFor="business-scenario" className="text-sm font-semibold text-foreground">
                    Select Business Scenario
                  </Label>
                  <Select value={scenario} onValueChange={(val) => setScenario(val || '')}>
                    <SelectTrigger id="business-scenario" className="w-full bg-background/60 border-border/60 h-11 rounded-xl">
                      <SelectValue placeholder="Choose a scenario" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="job-interview">💼 Job Interview — Hiring Manager Roleplay</SelectItem>
                      <SelectItem value="client-presentation">📊 Client Presentation — Pitching & Q&A</SelectItem>
                      <SelectItem value="team-meeting">🤝 Team Standup — Project Status Update</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {scenario === 'job-interview' && '✨ Practice selling your skills and answering behavioral interview questions.'}
                    {scenario === 'client-presentation' && '✨ Practice defending your project plan or addressing tough client objections.'}
                    {scenario === 'team-meeting' && '✨ Practice presenting your tasks, collaborating, and expressing status clearly.'}
                  </p>
                </div>
              )}

              {mode === 'casual' && (
                <div className="space-y-3">
                  <Label htmlFor="casual-topic" className="text-sm font-semibold text-foreground">
                    Choose a Conversation Topic
                  </Label>
                  <Select value={scenario} onValueChange={(val) => setScenario(val || '')}>
                    <SelectTrigger id="casual-topic" className="w-full bg-background/60 border-border/60 h-11 rounded-xl">
                      <SelectValue placeholder="Choose a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general-chitchat">☀️ General Daily Chit-Chat</SelectItem>
                      <SelectItem value="traveling">✈️ Travel & Tourism Plans</SelectItem>
                      <SelectItem value="movies-and-books">🎬 Movies, Books & Culture</SelectItem>
                      <SelectItem value="hobbies-and-sports">⚽ Hobbies, Fitness & Sports</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    ✨ Practice describing casual experiences, sharing opinions, and connecting naturally.
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Section 3: Settings & Voice ── */}
        <section aria-labelledby="settings-heading" className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-black shadow-lg shadow-primary/30">
              {mode ? '3' : '2'}
            </div>
            <h2 id="settings-heading" className="text-lg font-bold font-outfit text-foreground">
              Settings & Voice
            </h2>
          </div>

          <div className="glass rounded-2xl border border-border/50 p-6 space-y-6">
            {/* API Key */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="api-key" className="text-sm font-semibold flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <Key className="h-3.5 w-3.5 text-primary" />
                  </div>
                  Gemini API Key
                </Label>
                <a
                  href="https://aistudio.google.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-primary hover:text-primary/80 font-semibold underline-offset-4 hover:underline transition-colors"
                >
                  Get a free key →
                </a>
              </div>
              <div className="relative">
                <Input
                  id="api-key"
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="pr-11 font-mono text-sm h-11 rounded-xl bg-background/60 border-border/60"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted"
                  aria-label={showKey ? 'Hide API key' : 'Show API key'}
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                🔒 Stored only in your browser's local storage. Never shared or logged.
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-border/40" />

            {/* Voice Selector */}
            <div className="space-y-3">
              <Label htmlFor="voice-select" className="text-sm font-semibold flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <Volume2 className="h-3.5 w-3.5 text-primary" />
                </div>
                Tutor Voice & Accent
              </Label>
              <Select value={voice} onValueChange={(val) => setVoice(val || '')}>
                <SelectTrigger id="voice-select" className="w-full bg-background/60 border-border/60 h-11 rounded-xl">
                  {selectedVoice ? (
                    <span className="flex items-center gap-2">
                      <span>{selectedVoice.flag}</span>
                      <span className="font-medium">{selectedVoice.label}</span>
                      <span className="text-muted-foreground text-xs">— {selectedVoice.accent}</span>
                    </span>
                  ) : (
                    <SelectValue placeholder="Select accent voice" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {VOICES.map((v) => (
                    <SelectItem key={v.value} value={v.value}>
                      <span className="flex items-center gap-2">
                        <span>{v.flag}</span>
                        <span className="font-medium">{v.label}</span>
                        <span className="text-muted-foreground text-xs">— {v.accent}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedVoice && (
                <p className="text-xs text-muted-foreground">
                  {selectedVoice.flag} {selectedVoice.label} speaks in a natural {selectedVoice.accent} accent, powered by Edge TTS.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ── Error ── */}
        {errorMsg && (
          <Alert variant="destructive" className="animate-shake rounded-xl border-destructive/40 bg-destructive/5">
            <AlertTitle className="font-bold">Cannot Start Session</AlertTitle>
            <AlertDescription>{errorMsg}</AlertDescription>
          </Alert>
        )}

        {/* ── CTA Button ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            {isFormValid
              ? '✅ Ready to start. Click the button to begin your session.'
              : '👈 Select a mode and enter your API key to continue.'}
          </p>

          <Button
            type="submit"
            id="start-session-btn"
            size="lg"
            disabled={!isFormValid || isStarting}
            className={`
              relative w-full sm:w-auto font-outfit font-bold gap-3 h-13 px-8 text-base rounded-xl
              transition-all duration-300
              ${isFormValid
                ? 'shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] active:scale-[0.98] animate-glow'
                : 'opacity-50 cursor-not-allowed'
              }
            `}
          >
            {isStarting ? (
              <>
                <div className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                Launching…
              </>
            ) : (
              <>
                <Play className="h-5 w-5 fill-current" />
                Start Speaking Session
                <ChevronRight className="h-4 w-4 opacity-70" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
