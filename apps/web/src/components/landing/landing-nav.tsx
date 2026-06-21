'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Sparkles } from 'lucide-react';
import Link from 'next/link';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Modes', href: '#features' },
];

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass-strong border-b border-border/40 shadow-lg shadow-black/5'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 animate-glow group-hover:scale-105 transition-transform duration-200">
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
        </Link>

        {/* Nav Links — desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full glass border border-primary/20 text-primary">
            <Sparkles className="h-3 w-3 animate-pulse-slow" />
            <span className="text-[11px] font-semibold tracking-wide uppercase font-outfit">
              Gemini AI
            </span>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-md shadow-primary/30 hover:shadow-primary/50 hover:brightness-110 transition-all duration-200"
            id="nav-cta"
          >
            Start Free
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
