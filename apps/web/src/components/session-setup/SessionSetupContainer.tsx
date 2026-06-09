'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle,
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
} from '@language-tutor/ui';
import { 
  GraduationCap, 
  Briefcase, 
  MessageCircle, 
  Key, 
  Volume2, 
  Play, 
  Eye, 
  EyeOff, 
  Sparkles 
} from 'lucide-react';
import { ConversationMode, IELTSScenario, BusinessScenario } from '@language-tutor/shared-types';

interface SessionSetupContainerProps {
  onStartSession: (config: {
    mode: ConversationMode;
    scenario: string;
    apiKey: string;
    voice: string;
  }) => void;
}

const VOICES = [
  { value: 'en-US-AriaNeural', label: 'Aria (US Female)' },
  { value: 'en-US-GuyNeural', label: 'Guy (US Male)' },
  { value: 'en-GB-SoniaNeural', label: 'Sonia (UK Female)' },
  { value: 'en-GB-RyanNeural', label: 'Ryan (UK Male)' },
  { value: 'en-AU-NatashaNeural', label: 'Natasha (AU Female)' },
  { value: 'en-IN-NeerjaNeural', label: 'Neerja (IN Female)' },
];

export default function SessionSetupContainer({ onStartSession }: SessionSetupContainerProps) {
  const [mode, setMode] = useState<ConversationMode | null>(null);
  const [scenario, setScenario] = useState<string>('');
  const [apiKey, setApiKey] = useState('');
  const [voice, setVoice] = useState('en-US-AriaNeural');
  
  // UI states
  const [showKey, setShowKey] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('language-tutor-api-key') || '';
      const savedVoice = localStorage.getItem('language-tutor-voice') || 'en-US-AriaNeural';
      setApiKey(savedKey);
      setVoice(savedVoice);
    }
  }, []);

  // Update default scenario when mode changes
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
      setErrorMsg('Please select a learning mode.');
      return;
    }

    if (!apiKey.trim()) {
      setErrorMsg('A Gemini API key is required to start the session.');
      return;
    }

    // Persist to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('language-tutor-api-key', apiKey.trim());
      localStorage.setItem('language-tutor-voice', voice);
    }

    onStartSession({
      mode,
      scenario,
      apiKey: apiKey.trim(),
      voice,
    });
  };

  // Prevent hydration mismatch
  if (!isMounted) {
    return null;
  }

  const isFormValid = mode !== null && apiKey.trim() !== '';

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-16 animate-fade-in">
      <div className="text-center mb-10 md:mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary mb-4">
          <Sparkles className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-wider font-outfit">Powered by Gemini 2.0 Multimodal</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight font-outfit mb-4 bg-gradient-to-r from-primary via-purple-500 to-indigo-500 bg-clip-text text-transparent">
          Axiom Language Tutor
        </h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto font-sans leading-relaxed">
          Improve your English fluency, grammar, and pronunciation with a real-time conversational partner. Select a path below to begin.
        </p>
      </div>

      <form onSubmit={handleStart} className="space-y-8">
        {/* Section 1: Choose Mode */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold font-outfit flex items-center gap-2 text-foreground/90">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-sm">1</span>
            Select Conversation Mode
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* IELTS Prep */}
            <div 
              onClick={() => setMode('ielts')}
              className={`relative cursor-pointer rounded-xl border p-6 transition-all duration-300 group hover:shadow-lg ${
                mode === 'ielts' 
                  ? 'border-primary bg-primary/5 shadow-md shadow-primary/5 ring-1 ring-primary' 
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <div className="absolute top-4 right-4">
                <Badge variant={mode === 'ielts' ? 'default' : 'secondary'} className="font-outfit uppercase text-[10px]">
                  Academic
                </Badge>
              </div>
              <div className={`p-3 rounded-lg w-fit mb-4 transition-colors ${
                mode === 'ielts' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
              }`}>
                <GraduationCap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold font-outfit mb-2">IELTS Speaking</h3>
              <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                Practice Part 1, 2, and 3 under simulated exam conditions. Receive official IELTS band score feedback.
              </p>
            </div>

            {/* Business English */}
            <div 
              onClick={() => setMode('business')}
              className={`relative cursor-pointer rounded-xl border p-6 transition-all duration-300 group hover:shadow-lg ${
                mode === 'business' 
                  ? 'border-primary bg-primary/5 shadow-md shadow-primary/5 ring-1 ring-primary' 
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <div className="absolute top-4 right-4">
                <Badge variant={mode === 'business' ? 'default' : 'secondary'} className="font-outfit uppercase text-[10px]">
                  Professional
                </Badge>
              </div>
              <div className={`p-3 rounded-lg w-fit mb-4 transition-colors ${
                mode === 'business' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
              }`}>
                <Briefcase className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold font-outfit mb-2">Business English</h3>
              <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                Rehearse job interviews, client presentations, or team standups. Master executive communication.
              </p>
            </div>

            {/* Casual Conversation */}
            <div 
              onClick={() => setMode('casual')}
              className={`relative cursor-pointer rounded-xl border p-6 transition-all duration-300 group hover:shadow-lg ${
                mode === 'casual' 
                  ? 'border-primary bg-primary/5 shadow-md shadow-primary/5 ring-1 ring-primary' 
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <div className="absolute top-4 right-4">
                <Badge variant={mode === 'casual' ? 'default' : 'secondary'} className="font-outfit uppercase text-[10px]">
                  Social
                </Badge>
              </div>
              <div className={`p-3 rounded-lg w-fit mb-4 transition-colors ${
                mode === 'casual' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
              }`}>
                <MessageCircle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold font-outfit mb-2">Casual Chat</h3>
              <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                Talk about hobbies, travel, movies, or daily life. Build confidence in fluid, stress-free dialogs.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Sub-scenario Selector (Conditioned on Mode) */}
        {mode && (
          <div className="space-y-4 animate-slide-up">
            <h2 className="text-xl font-bold font-outfit flex items-center gap-2 text-foreground/90">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-sm">2</span>
              Configure Scenario
            </h2>

            <Card className="border-border bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-6 space-y-4">
                {mode === 'ielts' && (
                  <div className="space-y-2">
                    <Label htmlFor="ielts-part" className="text-sm font-semibold">Select Exam Part</Label>
                    <Select value={scenario} onValueChange={(val) => setScenario(val || '')}>
                      <SelectTrigger id="ielts-part" className="w-full">
                        <SelectValue placeholder="Choose a part" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ielts-part-1">Part 1: Introduction & Familiar Topics</SelectItem>
                        <SelectItem value="ielts-part-2">Part 2: Individual Long Turn (Cue Card)</SelectItem>
                        <SelectItem value="ielts-part-3">Part 3: Two-Way Analytical Discussion</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      {scenario === 'ielts-part-1' && 'The examiner will ask simple questions about yourself, your hobbies, or your home.'}
                      {scenario === 'ielts-part-2' && 'You will be given a random prompt card to speak about for 1 to 2 minutes.'}
                      {scenario === 'ielts-part-3' && 'The examiner will challenge you with abstract, thematic questions linked to Part 2.'}
                    </p>
                  </div>
                )}

                {mode === 'business' && (
                  <div className="space-y-2">
                    <Label htmlFor="business-scenario" className="text-sm font-semibold">Select Business Topic</Label>
                    <Select value={scenario} onValueChange={(val) => setScenario(val || '')}>
                      <SelectTrigger id="business-scenario" className="w-full">
                        <SelectValue placeholder="Choose a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="job-interview">Job Interview (Hiring Manager Roleplay)</SelectItem>
                        <SelectItem value="client-presentation">Client Presentation (Pitching Q&A)</SelectItem>
                        <SelectItem value="team-meeting">Team Standup (Project Status Update)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      {scenario === 'job-interview' && 'Practice selling your skills and answering standard behavioral interview questions.'}
                      {scenario === 'client-presentation' && 'Practice defending your project plans or addressing tough client objections.'}
                      {scenario === 'team-meeting' && 'Practice presenting your tasks, collaborating, and expressing status clearly.'}
                    </p>
                  </div>
                )}

                {mode === 'casual' && (
                  <div className="space-y-2">
                    <Label htmlFor="casual-topic" className="text-sm font-semibold">Conversation Topic</Label>
                    <Select value={scenario} onValueChange={(val) => setScenario(val || '')}>
                      <SelectTrigger id="casual-topic" className="w-full">
                        <SelectValue placeholder="Choose a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general-chitchat">General Daily Chit-Chat</SelectItem>
                        <SelectItem value="traveling">Travel & Tourism Plans</SelectItem>
                        <SelectItem value="movies-and-books">Movies, Books & Culture</SelectItem>
                        <SelectItem value="hobbies-and-sports">Hobbies, Fitness & Sports</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      Practice describing casual daily experiences, sharing opinions, and connecting naturally.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Section 3: API Key & Voice Selection */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold font-outfit flex items-center gap-2 text-foreground/90">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-sm">
              {mode ? '3' : '2'}
            </span>
            Settings & Voice
          </h2>

          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6 space-y-6">
              {/* Gemini API Key */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="api-key" className="text-sm font-semibold flex items-center gap-1.5">
                    <Key className="h-4 w-4 text-muted-foreground" />
                    Gemini API Key
                  </Label>
                  <a 
                    href="https://aistudio.google.com/" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    Get a free key here
                  </a>
                </div>
                <div className="relative">
                  <Input
                    id="api-key"
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="pr-10 font-mono text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your key is sent only to your NestJS server to instantiate the Google GenAI Client. It is stored securely in your local browser storage.
                </p>
              </div>

              {/* Voice Selector */}
              <div className="space-y-2">
                <Label htmlFor="voice" className="text-sm font-semibold flex items-center gap-1.5">
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                  Tutor Pronunciation Voice
                </Label>
                <Select value={voice} onValueChange={(val) => setVoice(val || '')}>
                  <SelectTrigger id="voice" className="w-full">
                    <SelectValue placeholder="Select accent voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {VOICES.map((v) => (
                      <SelectItem key={v.value} value={v.value}>
                        {v.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  The Edge TTS engine generates natural sounding audio in the selected accent.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <Alert variant="destructive" className="animate-shake">
            <AlertTitle>Cannot Start Session</AlertTitle>
            <AlertDescription>{errorMsg}</AlertDescription>
          </Alert>
        )}

        {/* Start Button */}
        <div className="flex justify-end pt-4">
          <Button 
            type="submit" 
            size="lg" 
            disabled={!isFormValid}
            className="w-full md:w-auto font-outfit gap-2 h-12 text-base shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Play className="h-5 w-5 fill-current" />
            Start Speaking Session
          </Button>
        </div>
      </form>
    </div>
  );
}
