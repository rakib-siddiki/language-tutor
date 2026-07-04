'use client';

import React from 'react';
import { useTheme } from './theme-provider';
import { Button, Switch, Label } from '@/components/ui';
import { Sun, Moon, Sparkles, ChevronDown, LogOut } from 'lucide-react';

interface HeaderProps {
  showFeedbackToggle?: boolean;
  feedbackChecked?: boolean;
  onFeedbackChange?: (checked: boolean) => void;
  showEndButton?: boolean;
  onEndSession?: () => void;
  endButtonDisabled?: boolean;
}

export default function Header({
  showFeedbackToggle = false,
  feedbackChecked = false,
  onFeedbackChange,
  showEndButton = false,
  onEndSession,
  endButtonDisabled = false,
}: HeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="absolute inset-0 glass-strong border-b border-border/40" />
      <div className="relative container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center size-9 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 animate-glow">
            <Sparkles className="size-4 fill-current" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-outfit font-black text-base tracking-tight leading-none gradient-text">
              Axiom Tutor
            </span>
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-wide">
              Powered by Gemini
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Show Grammar Feedback Toggle (In Header) */}
          {showFeedbackToggle && (
            <div className="flex items-center gap-1.5 sm:gap-2 bg-secondary/30 px-2 sm:px-3 py-1.5 rounded-lg border border-border/30">
              <Switch 
                id="header-show-corrections" 
                checked={feedbackChecked}
                onCheckedChange={onFeedbackChange}
              />
              <Label htmlFor="header-show-corrections" className="text-xs font-semibold cursor-pointer hidden md:inline">
                Show Grammar Feedback
              </Label>
            </div>
          )}

          {/* End & Evaluate Button (In Header) */}
          {showEndButton && (
            <Button 
              variant="destructive"
              size="sm"
              onClick={onEndSession}
              disabled={endButtonDisabled}
              className="font-outfit gap-1 sm:gap-1.5 shadow-md shadow-destructive/5 bg-[#e15252] hover:bg-[#d04242] text-white border-none font-semibold text-xs py-1.5 px-2.5 sm:px-3.5 cursor-pointer"
            >
              <LogOut className="size-3.5" />
              <span className="hidden sm:inline">End & Evaluate</span>
              <span className="inline sm:hidden">End</span>
            </Button>
          )}

          {/* Theme toggle dropdown-style (collapses to icon button on mobile) */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="Toggle theme"
            className="relative h-9 w-9 sm:w-auto sm:px-3 rounded-xl border border-border/40 hover:bg-primary/10 hover:text-primary transition-all duration-200 flex items-center justify-center sm:gap-1.5 text-xs font-semibold text-muted-foreground cursor-pointer"
            id="theme-toggle"
          >
            <div className="relative size-4 flex items-center justify-center">
              <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </div>
            <span className="font-sans hidden sm:inline">Theme</span>
            <ChevronDown className="size-3.5 opacity-60 hidden sm:inline" />
          </Button>
        </div>
      </div>
    </header>
  );
}
