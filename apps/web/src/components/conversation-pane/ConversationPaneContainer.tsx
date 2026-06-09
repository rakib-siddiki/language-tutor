'use client';

import React, { useEffect, useRef } from 'react';
import { Card, CardContent, Badge, Separator } from '@language-tutor/ui';
import { Sparkles, User, AlertTriangle, BookOpen, VolumeX } from 'lucide-react';

export interface Message {
  id: string;
  role: 'user' | 'tutor';
  text: string;
  corrections?: Array<{
    original: string;
    corrected: string;
    explanation: string;
  }>;
  vocabularySuggestions?: Array<{
    original: string;
    suggestion: string;
    context: string;
  }>;
  pronunciationTips?: Array<{
    word: string;
    tip: string;
  }>;
}

interface ConversationPaneContainerProps {
  messages: Message[];
  isProcessing?: boolean;
  showCorrections?: boolean;
}

export default function ConversationPaneContainer({
  messages,
  isProcessing = false,
  showCorrections = true,
}: ConversationPaneContainerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      if (typeof container.scrollTo === 'function') {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth',
        });
      } else {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [messages, isProcessing]);

  // Robust inline highlighting function
  const renderHighlightedText = (text: string, corrections?: any[]) => {
    if (!showCorrections || !corrections || corrections.length === 0) {
      return <span className="font-sans text-sm md:text-base leading-relaxed">{text}</span>;
    }

    const sortedCorrections = [...corrections].sort((a, b) => b.original.length - a.original.length);
    interface Match {
      start: number;
      end: number;
      original: string;
      corrected: string;
      explanation: string;
    }
    const matches: Match[] = [];

    for (const corr of sortedCorrections) {
      if (!corr.original) continue;
      let pos = text.indexOf(corr.original);
      while (pos !== -1) {
        const isOverlapping = matches.some(m => 
          (pos >= m.start && pos < m.end) || 
          (pos + corr.original.length > m.start && pos + corr.original.length <= m.end)
        );

        if (!isOverlapping) {
          matches.push({
            start: pos,
            end: pos + corr.original.length,
            original: corr.original,
            corrected: corr.corrected,
            explanation: corr.explanation,
          });
        }
        pos = text.indexOf(corr.original, pos + 1);
      }
    }

    matches.sort((a, b) => a.start - b.start);

    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    matches.forEach((match, idx) => {
      if (match.start > lastIndex) {
        elements.push(<span key={`text-${lastIndex}`} className="font-sans text-sm md:text-base leading-relaxed">{text.substring(lastIndex, match.start)}</span>);
      }

      elements.push(
        <span key={`match-${idx}`} className="relative group inline-block cursor-help mx-0.5">
          <span className="line-through text-destructive font-semibold decoration-wavy decoration-destructive/60 decoration-2">
            {match.original}
          </span>
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-lg border border-border bg-popover text-popover-foreground shadow-xl text-xs opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50">
            <span className="font-bold text-emerald-500 flex items-center gap-1 mb-1">
              <Sparkles className="h-3 w-3" /> Correct: {match.corrected}
            </span>
            <span className="text-muted-foreground block leading-relaxed">{match.explanation}</span>
          </span>
        </span>
      );

      lastIndex = match.end;
    });

    if (lastIndex < text.length) {
      elements.push(<span key={`text-${lastIndex}`} className="font-sans text-sm md:text-base leading-relaxed">{text.substring(lastIndex)}</span>);
    }

    return <>{elements}</>;
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 border border-border/30 bg-card/20 backdrop-blur-sm rounded-xl overflow-hidden w-full">
      {/* Scrollable Conversation Viewport */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin"
        style={{ contentVisibility: 'auto' }}
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground py-16 space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center text-primary/60">
              <Sparkles className="h-5 w-5" />
            </div>
            <p className="font-outfit font-medium text-sm">No conversation history yet.</p>
            <p className="text-xs max-w-xs font-sans leading-relaxed">Start speaking to open the dialog loop with the AI language examiner.</p>
          </div>
        ) : (
          messages.map((message) => {
            const isTutor = message.role === 'tutor';
            
            return (
              <div 
                key={message.id}
                className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${
                  isTutor ? 'mr-auto' : 'ml-auto flex-row-reverse'
                } animate-fade-in`}
              >
                {/* Avatar */}
                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 border ${
                  isTutor 
                    ? 'bg-primary text-primary-foreground border-primary/20' 
                    : 'bg-secondary text-secondary-foreground border-border'
                }`}>
                  {isTutor ? <Sparkles className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>

                {/* Bubble Container */}
                <div className="space-y-1.5 flex flex-col">
                  {/* Bubble */}
                  <div className={`p-4 rounded-2xl ${
                    isTutor 
                      ? 'bg-card text-card-foreground rounded-tl-none border border-border/30' 
                      : 'bg-primary text-primary-foreground rounded-tr-none shadow-md shadow-primary/5'
                  }`}>
                    {isTutor ? (
                      <span className="font-sans text-sm md:text-base leading-relaxed">{message.text}</span>
                    ) : (
                      renderHighlightedText(message.text, message.corrections)
                    )}
                  </div>

                  {/* Corrections & Suggestions Drawer (Only for User message & if enabled) */}
                  {!isTutor && showCorrections && (
                    <div className="space-y-2 px-1">
                      {/* Vocabulary Suggestions */}
                      {message.vocabularySuggestions && message.vocabularySuggestions.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                            <BookOpen className="h-3 w-3" /> Vocabulary:
                          </span>
                          {message.vocabularySuggestions.map((suggestion, idx) => (
                            <span 
                              key={idx} 
                              className="relative group inline-block"
                            >
                              <Badge 
                                variant="outline" 
                                className="text-[10px] cursor-help bg-secondary/30 hover:bg-primary/10 border-primary/20 text-foreground font-medium"
                              >
                                {suggestion.original} → {suggestion.suggestion}
                              </Badge>
                              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2 rounded-lg border border-border bg-popover text-popover-foreground shadow-xl text-[10px] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 z-50">
                                <span className="font-bold text-primary block mb-0.5">Use in Context:</span>
                                <span className="text-muted-foreground block leading-relaxed">"{suggestion.context}"</span>
                              </span>
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Pronunciation Tips */}
                      {message.pronunciationTips && message.pronunciationTips.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                            <VolumeX className="h-3 w-3" /> Pronunciation:
                          </span>
                          {message.pronunciationTips.map((tip, idx) => (
                            <span 
                              key={idx} 
                              className="relative group inline-block"
                            >
                              <Badge 
                                variant="outline" 
                                className="text-[10px] cursor-help bg-secondary/30 hover:bg-orange-500/10 border-orange-500/20 text-orange-500 dark:text-orange-400 font-medium"
                              >
                                {tip.word}
                              </Badge>
                              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2 rounded-lg border border-border bg-popover text-popover-foreground shadow-xl text-[10px] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 z-50">
                                <span className="font-bold text-orange-500 block mb-0.5">Tip:</span>
                                <span className="text-muted-foreground block leading-relaxed">{tip.tip}</span>
                              </span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex gap-3 max-w-[85%] md:max-w-[75%] mr-auto animate-fade-in">
            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 border border-primary/20">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="p-4 rounded-2xl rounded-tl-none bg-card text-card-foreground border border-border/30 flex items-center justify-center h-11 w-16">
              <div className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-primary animate-bounce delay-100" />
                <span className="h-2 w-2 rounded-full bg-primary animate-bounce delay-200" />
                <span className="h-2 w-2 rounded-full bg-primary animate-bounce delay-300" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
