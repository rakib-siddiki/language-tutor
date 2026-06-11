'use client';

import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter,
  Button, 
  Badge, 
  Skeleton 
} from '@/components/ui';
import { 
  Trophy, 
  TrendingUp, 
  Printer, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle, 
  BookOpen, 
  FileText,
  Sparkles
} from 'lucide-react';
import { ConversationMode, ConversationTurn, ScoreReport } from '@language-tutor/shared-types';

interface EvaluationDashboardContainerProps {
  history: ConversationTurn[];
  config: {
    mode: ConversationMode;
    scenario: string;
    apiKey: string;
  };
  onRestart: () => void;
}

export default function EvaluationDashboardContainer({
  history,
  config,
  onRestart,
}: EvaluationDashboardContainerProps) {
  const [report, setReport] = useState<ScoreReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [animateWidths, setAnimateWidths] = useState(false);

  useEffect(() => {
    const fetchEvaluation = async () => {
      setLoading(true);
      setError(null);
      
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      try {
        const response = await fetch(`${apiBase}/api/tutor/evaluate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': config.apiKey,
          },
          body: JSON.stringify({
            history,
            mode: config.mode,
            scenario: config.scenario,
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || `Evaluation Error: ${response.statusText}`);
        }

        const data = await response.json();
        setReport(data);
        
        // Trigger sliding widths animation
        setTimeout(() => setAnimateWidths(true), 150);
      } catch (err: any) {
        console.error('Error fetching session evaluation:', err);
        setError(err.message || 'Failed to analyze conversation. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (history && history.length > 0) {
      fetchEvaluation();
    } else {
      setError('Cannot evaluate an empty session. Please speak to the tutor first.');
      setLoading(false);
    }
  }, [history, config]);

  const handlePrint = () => {
    window.print();
  };

  // Render skeletons during loading
  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8 animate-pulse">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-28" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 border-border/40">
            <CardContent className="p-6 flex flex-col items-center space-y-4">
              <Skeleton className="h-32 w-32 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>

          <Card className="md:col-span-2 border-border/40">
            <CardContent className="p-6 space-y-6">
              <Skeleton className="h-6 w-1/3" />
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                    <Skeleton className="h-3 w-full rounded-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/40">
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render error view
  if (error || !report) {
    return (
      <div className="container max-w-md mx-auto px-4 py-12 text-center space-y-6 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h2 className="font-outfit text-2xl font-bold">Analysis Failed</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">{error || 'Unknown error occurred.'}</p>
        <Button onClick={onRestart} className="font-outfit">
          <RotateCcw className="h-4 w-4 mr-2" />
          Restart Session
        </Button>
      </div>
    );
  }

  // Math for SVG overall band circle
  const strokeWidth = 8;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const percentage = (report.overallBand / 9) * 100;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const categories = [
    { name: 'Fluency & Coherence', score: report.fluencyScore, desc: 'Flow of speech, hesitations, structuring.' },
    { name: 'Lexical Resource', score: report.vocabularyScore, desc: 'Vocabulary variety, suitability, upgrades.' },
    { name: 'Grammatical Range', score: report.grammarScore, desc: 'Syntax accuracy, complexity, tenses.' },
    { name: 'Pronunciation', score: report.pronunciationScore, desc: 'Intonation, stress patterns, clarity.' },
  ];

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-8 animate-fade-in relative">
      {/* Dynamic print hide styling */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          header,
          .no-print,
          button,
          .bg-background {
            background-color: white !important;
            color: black !important;
          }
          header, .no-print, button {
            display: none !important;
          }
          .container {
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .print-card {
            border: 1px solid #e2e8f0 !important;
            box-shadow: none !important;
            background: transparent !important;
          }
        }
      `}} />

      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/40 pb-6 shrink-0 no-print">
        <div>
          <h1 className="text-3xl font-black font-outfit bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent flex items-center gap-2">
            <Trophy className="h-7 w-7 text-primary" />
            Speaking Performance Report
          </h1>
          <p className="text-muted-foreground text-xs font-sans mt-1">
            Official evaluation compiled by AI examiner based on {history.length} speaking turns.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePrint}
            className="flex-1 sm:flex-initial font-outfit gap-1.5"
          >
            <Printer className="h-4 w-4" />
            Export PDF
          </Button>
          <Button 
            size="sm" 
            onClick={onRestart}
            className="flex-1 sm:flex-initial font-outfit gap-1.5 shadow-md shadow-primary/5"
          >
            <RotateCcw className="h-4 w-4" />
            New Session
          </Button>
        </div>
      </div>

      {/* Grid: Donut + Progress bars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ring Chart displaying Overall Band */}
        <Card className="md:col-span-1 border-border/30 bg-card/25 backdrop-blur-sm print-card">
          <CardHeader className="text-center pb-2">
            <CardTitle className="font-outfit text-lg font-bold">Overall Rating</CardTitle>
            <CardDescription className="text-xs">IELTS equivalent scoring</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6 relative">
            <div className="relative w-36 h-36 flex items-center justify-center mb-4">
              <svg className="w-full h-full transform -rotate-90">
                {/* Background Ring */}
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  className="stroke-muted/30 fill-none"
                  strokeWidth={strokeWidth}
                />
                {/* Foreground Filled Ring */}
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  className="stroke-primary fill-none transition-all duration-1000 ease-out"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={animateWidths ? strokeDashoffset : circumference}
                  strokeLinecap="round"
                />
              </svg>
              {/* Score text in middle */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-outfit font-black text-4xl leading-none">{report.overallBand.toFixed(1)}</span>
                <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider mt-1">Band Score</span>
              </div>
            </div>
            
            <Badge className="font-outfit bg-primary/10 border-primary/20 text-primary py-1 px-3">
              {report.overallBand >= 7.5 ? 'Advanced Speaker' : report.overallBand >= 6.0 ? 'Competent Speaker' : 'Developing Speaker'}
            </Badge>
          </CardContent>
        </Card>

        {/* Progress bars representing rubrics */}
        <Card className="md:col-span-2 border-border/30 bg-card/25 backdrop-blur-sm print-card">
          <CardHeader>
            <CardTitle className="font-outfit text-lg font-bold flex items-center gap-1.5">
              <TrendingUp className="h-5 w-5 text-primary" /> Scoring Categories
            </CardTitle>
            <CardDescription className="text-xs">Breakdown across language assessment rubrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {categories.map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm font-bold text-foreground/90 font-outfit">{cat.name}</span>
                    <span className="hidden sm:inline text-[10px] text-muted-foreground ml-2 font-sans">({cat.desc})</span>
                  </div>
                  <span className="text-sm font-black font-outfit">{cat.score.toFixed(1)} / 9.0</span>
                </div>
                {/* Horizontal Progress Bar */}
                <div className="w-full bg-secondary/60 rounded-full h-2 overflow-hidden border border-border/10">
                  <div 
                    className="bg-primary h-full rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: animateWidths ? `${(cat.score / 9) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* prose: General Feedback */}
      <Card className="border-border/30 bg-card/25 backdrop-blur-sm print-card">
        <CardHeader>
          <CardTitle className="font-outfit text-lg font-bold flex items-center gap-1.5">
            <FileText className="h-5 w-5 text-primary" /> Assessor's Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground/80 leading-relaxed font-sans whitespace-pre-line">
            {report.feedbackSummary}
          </p>
        </CardContent>
      </Card>

      {/* Column List: Common Mistakes */}
      {report.commonMistakes && report.commonMistakes.length > 0 && (
        <Card className="border-border/30 bg-card/25 backdrop-blur-sm print-card">
          <CardHeader>
            <CardTitle className="font-outfit text-lg font-bold flex items-center gap-1.5 text-destructive">
              <AlertTriangle className="h-5 w-5 fill-destructive/10" /> Common Mistakes
            </CardTitle>
            <CardDescription className="text-xs">Top issues identified across spelling, grammar, and pronunciation</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {report.commonMistakes.map((mistake, idx) => (
                <li key={idx} className="flex gap-2.5 items-start text-sm text-foreground/80 leading-relaxed">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-destructive/10 text-destructive text-xs shrink-0 font-bold font-outfit mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Two Column comparison: Improvement examples */}
      {report.exampleImprovements && report.exampleImprovements.length > 0 && (
        <Card className="border-border/30 bg-card/25 backdrop-blur-sm print-card">
          <CardHeader>
            <CardTitle className="font-outfit text-lg font-bold flex items-center gap-1.5 text-emerald-500">
              <BookOpen className="h-5 w-5 text-emerald-500" /> Improvement Suggestions
            </CardTitle>
            <CardDescription className="text-xs">Original sentences vs native rephrasing guide</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {report.exampleImprovements.map((imp, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-border/20 rounded-xl overflow-hidden shadow-sm">
                {/* Original */}
                <div className="bg-destructive/5 p-4 border-b md:border-b-0 md:border-r border-border/20">
                  <div className="flex items-center gap-1.5 text-xs text-destructive uppercase font-bold tracking-wider mb-2 font-outfit">
                    <AlertTriangle className="h-3.5 w-3.5" /> What You Said:
                  </div>
                  <p className="text-sm italic text-foreground/80 leading-relaxed font-sans">
                    "{imp.original}"
                  </p>
                </div>
                {/* Improved */}
                <div className="bg-emerald-500/5 p-4">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 uppercase font-bold tracking-wider mb-2 font-outfit">
                    <CheckCircle className="h-3.5 w-3.5" /> Native Rephrasing:
                  </div>
                  <p className="text-sm font-semibold text-foreground/95 leading-relaxed font-sans">
                    "{imp.improved}"
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Print-only Footer details */}
      <div className="hidden print:block text-center text-[10px] text-muted-foreground border-t border-border/20 pt-4 mt-8">
        <p>Axiom Language Tutor Report — Generated on {new Date().toLocaleDateString()}</p>
        <p className="mt-1">Analyze and master language patterns with Gemini AI.</p>
      </div>
    </div>
  );
}
