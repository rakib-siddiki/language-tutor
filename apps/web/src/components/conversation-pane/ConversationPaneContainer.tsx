'use client';

import React from 'react';
import { Badge, Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui';
import { Sparkles, User, AlertTriangle, BookOpen, Volume2, Paperclip, Send, MoreHorizontal } from 'lucide-react';
import { useConversationPaneContainer, Message } from '@/hooks';

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
  const {
    containerRef,
    speakingWord,
    speakWord,
    renderHighlightedText,
  } = useConversationPaneContainer({
    messages,
    isProcessing,
    showCorrections,
  });

  return (
    <Card className="flex-1 flex flex-col min-h-0 border-border/30 bg-card/25 backdrop-blur-sm rounded-xl overflow-hidden w-full h-full">
      {/* Card Header matching status style */}
      <CardHeader className="pb-2 flex flex-row items-center justify-between shrink-0 border-b border-border/10 py-3 px-4">
        <CardTitle className="text-xs font-bold text-muted-foreground/80 font-outfit uppercase tracking-wider">
          Conversation
        </CardTitle>
        <MoreHorizontal className="size-4 text-muted-foreground/60 cursor-pointer hover:text-foreground transition-colors" />
      </CardHeader>

      {/* Scrollable Conversation Viewport */}
      <CardContent 
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-5 scrollbar-thin"
        style={{ contentVisibility: 'auto' }}
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground py-16 gap-3">
            <div className="size-12 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center text-primary/60">
              <Sparkles className="size-5" />
            </div>
            <p className="font-outfit font-medium text-sm">No conversation history yet.</p>
            <p className="text-xs max-w-xs font-sans leading-relaxed">Start speaking to open the dialog loop with the AI language examiner.</p>
          </div>
        ) : (
          messages.map((message) => {
            const isTutor = message.role === 'tutor';
            const hasCorrections = !isTutor && showCorrections && message.corrections && message.corrections.length > 0;
            
            return (
              <div 
                key={message.id}
                className="flex flex-col gap-2 animate-fade-in border-b border-border/5 pb-4 last:border-b-0 last:pb-0"
              >
                {/* Labeled Direct Message Row */}
                <p className="text-sm md:text-base leading-relaxed">
                  <span className={`font-black font-outfit mr-2 select-none ${
                    isTutor ? 'text-primary' : 'text-foreground/90'
                  }`}>
                    {isTutor ? 'Tutor:' : 'Student:'}
                  </span>
                  {isTutor ? (
                    <span className="text-foreground/85 font-sans">{message.text}</span>
                  ) : (
                    renderHighlightedText(message.text, message.corrections)
                  )}
                </p>
 
                {/* ── Secondary Grammar Explanations & Suggestions ── */}
                {hasCorrections && (
                  <div className="rounded-xl border border-destructive/15 bg-destructive/5 dark:bg-destructive/10 p-3.5 flex flex-col gap-3.5 border-l-4 border-l-destructive/60 mt-1">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-destructive/90 flex items-center gap-1.5">
                      <AlertTriangle className="size-3.5" /> Grammar Corrections Detailed List
                    </p>
                    <div className="flex flex-col gap-3">
                      {message.corrections!.map((c, idx) => (
                        <div key={idx} className="flex flex-col gap-1">
                          <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
                            <span className="line-through text-destructive decoration-wavy decoration-1">
                              {c.original}
                            </span>
                            <span className="text-muted-foreground/60 text-[10px]">→</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 dark:bg-emerald-400/10 px-1.5 py-0.5 rounded text-[11px]">
                              {c.corrected}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed pl-0.5 font-sans">
                            {c.explanation}
                          </p>
                          {idx < message.corrections!.length - 1 && (
                            <div className="border-t border-border/30 pt-2 mt-2" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
 
                {/* Vocabulary & Pronunciation helper badges */}
                {!isTutor && showCorrections && (
                  <div className="flex flex-col gap-2 px-1">
                    {/* Vocabulary Suggestions */}
                    {message.vocabularySuggestions && message.vocabularySuggestions.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground flex items-center gap-1.5 shrink-0">
                          <BookOpen className="size-3" /> Vocabulary:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {message.vocabularySuggestions.map((suggestion, idx) => (
                            <span 
                              key={idx} 
                              className="relative group inline-block"
                            >
                              <Badge 
                                variant="outline" 
                                className="text-[10px] cursor-help bg-secondary/40 hover:bg-primary/10 border-primary/20 text-foreground font-medium px-2 py-0.5 rounded-full transition-colors"
                              >
                                {suggestion.original} → {suggestion.suggestion}
                              </Badge>
                              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 rounded-lg border border-border bg-popover text-popover-foreground shadow-xl text-xs opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 z-50">
                                <span className="font-bold text-primary block mb-0.5">Use in Context:</span>
                                <span className="text-muted-foreground block leading-relaxed italic">"{suggestion.context}"</span>
                              </span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
 
                    {/* Pronunciation Tips */}
                    {message.pronunciationTips && message.pronunciationTips.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground flex items-center gap-1.5 shrink-0">
                          <Volume2 className="size-3" /> Pronunciation:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {message.pronunciationTips.map((tip, idx) => {
                            const isSpeaking = speakingWord === tip.word;
                            return (
                              <span 
                                key={idx} 
                                className="relative group inline-block"
                              >
                                <Badge 
                                  variant="outline" 
                                  className={`text-[10px] cursor-pointer font-medium px-2 py-0.5 rounded-full transition-all flex items-center gap-1 active:scale-95 ${
                                    isSpeaking 
                                      ? 'bg-orange-500/20 border-orange-500 text-orange-600 dark:text-orange-300 animate-pulse'
                                      : 'bg-secondary/40 hover:bg-orange-500/10 border-orange-500/20 text-orange-500 dark:text-orange-400'
                                  }`}
                                  onClick={() => speakWord(tip.word)}
                                  title="Click to hear pronunciation"
                                >
                                  <Volume2 className={`size-2.5 shrink-0 ${isSpeaking ? 'animate-bounce' : ''}`} />
                                  {tip.word}
                                </Badge>
                                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 rounded-lg border border-border bg-popover text-popover-foreground shadow-xl text-xs opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 z-50">
                                  <span className="font-bold text-orange-500 block mb-0.5">Tip:</span>
                                  <span className="text-muted-foreground block leading-relaxed">{tip.tip}</span>
                                  <span className="text-[10px] text-primary/70 block mt-1 font-semibold">💡 Click word to hear pronunciation</span>
                                </span>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
 
        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex gap-3 items-center mt-2 animate-fade-in">
            <span className="font-black font-outfit text-primary select-none text-sm md:text-base">Tutor:</span>
            <div className="flex gap-1 items-center">
              <span className="size-2 rounded-full bg-primary animate-bounce delay-100" />
              <span className="size-2 rounded-full bg-primary animate-bounce delay-200" />
              <span className="size-2 rounded-full bg-primary animate-bounce delay-300" />
            </div>
          </div>
        )}
      </CardContent>

      {/* Decorative input bar matching mockup */}
      <CardFooter className="p-3 border-t border-border/10 bg-card/5 shrink-0">
        <div className="relative flex items-center w-full bg-secondary/30 rounded-xl px-3.5 py-2.5 border border-border/30 gap-2">
          <Paperclip className="size-4 text-muted-foreground/60 cursor-pointer hover:text-primary transition-colors shrink-0" />
          <input 
            type="text" 
            placeholder="Voice practice active. Speak or type..." 
            disabled={isProcessing}
            className="flex-1 bg-transparent border-none text-sm outline-none text-foreground placeholder:text-muted-foreground/50 w-full select-all font-sans"
          />
          <Send className="size-4 text-muted-foreground/60 cursor-pointer hover:text-primary transition-colors shrink-0" />
        </div>
      </CardFooter>
    </Card>
  );
}
