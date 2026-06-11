'use client';

import React from 'react';
import { useTheme } from './theme-provider';
import { Button } from '@/components/ui';
import { Sun, Moon, Sparkles, Zap } from 'lucide-react';

export default function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="absolute inset-0 glass-strong border-b border-border/40" />
      <div className="relative container mx-auto flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 animate-glow">
            <Zap className="h-4 w-4 fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="font-outfit font-black text-base tracking-tight leading-none gradient-text">
              Axiom Tutor
            </span>
            <span className="text-[10px] font-medium text-muted-foreground leading-none mt-0.5 tracking-wide uppercase">
              AI Speaking Coach
            </span>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Powered by badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full glass border border-primary/20 text-primary">
            <Sparkles className="h-3 w-3 animate-pulse-slow" />
            <span className="text-[11px] font-semibold tracking-wide uppercase font-outfit">
              Gemini 3.5
            </span>
          </div>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="Toggle theme"
            className="relative w-9 h-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-200"
            id="theme-toggle"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
