'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mic, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export function LandingCta() {
  return (
    <section className="relative py-28 px-4 overflow-hidden">
      {/* Strong central glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, hsl(262 88% 68% / 0.22) 0%, transparent 65%)',
        }}
      />

      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative glass-strong rounded-3xl border border-primary/30 gradient-border p-10 md:p-16 text-center shadow-2xl shadow-primary/20"
        >
          {/* Floating sparkles */}
          {['top-4 right-6', 'bottom-6 left-8', 'top-1/2 right-2'].map((pos, i) => (
            <motion.div
              key={i}
              className={`absolute ${pos} text-primary/30`}
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
            >
              <Sparkles className="h-4 w-4" />
            </motion.div>
          ))}

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-semibold tracking-widest uppercase font-outfit mb-8">
            <Sparkles className="h-3 w-3 animate-pulse-slow" />
            Free Forever · No Sign-up Required
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black font-outfit tracking-tight leading-[1.05] mb-6">
            Your Speaking Journey
            <span className="block gradient-text mt-1">Starts Right Now</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            Stop reading. Start speaking. One conversation with Axiom Tutor is worth more than
            hours of passive studying.
          </p>

          {/* Primary CTA */}
          <Link
            href="/dashboard"
            id="cta-footer-btn"
            className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-2xl shadow-primary/40 hover:shadow-primary/60 hover:brightness-110 active:scale-95 transition-all duration-200 animate-glow"
          >
            <Mic className="h-5 w-5" />
            Start Your First Session
            <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>

          <p className="mt-6 text-sm text-muted-foreground">
            Bring your{' '}
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4 hover:text-primary/80"
            >
              free Gemini API key
            </a>{' '}
            — no credit card needed.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
