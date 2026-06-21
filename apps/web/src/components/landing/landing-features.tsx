'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Mic,
  BrainCircuit,
  BarChart3,
  Globe2,
  Zap,
  ShieldCheck,
  Volume2,
  MessageSquare,
} from 'lucide-react';

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.65, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  accent: string;
  colSpan?: string;
  extra?: React.ReactNode;
}

const features: Feature[] = [
  {
    icon: <Mic className="h-6 w-6" />,
    title: 'Voice-First Conversations',
    description:
      'Speak naturally via your browser mic. No apps or installs needed — just open and talk. The AI listens, understands context, and responds in real time.',
    accent: 'from-violet-500 to-purple-600',
    colSpan: 'md:col-span-2',
    extra: (
      <div className="mt-4 flex items-center gap-1.5" style={{ height: 48, contain: 'layout style' }}>
        {[5, 10, 16, 24, 16, 10, 24, 16, 10, 5, 8, 16].map((h, i) => (
          <motion.div
            key={i}
            className="w-1.5 rounded-full bg-violet-400/70"
            animate={{ height: [h, h * 2, h] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.08, ease: 'easeInOut' }}
            style={{ minHeight: 4 }}
          />
        ))}
      </div>
    ),
  },
  {
    icon: <BrainCircuit className="h-6 w-6" />,
    title: 'Gemini AI Brain',
    description:
      'Powered by Google Gemini — the most capable AI for language understanding, empathy, and nuance.',
    accent: 'from-blue-500 to-cyan-500',
    colSpan: 'md:col-span-2',
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: 'Detailed Performance Reports',
    description:
      'After every session, get a comprehensive breakdown of fluency, grammar, vocabulary range, and IELTS band score projections.',
    accent: 'from-emerald-500 to-teal-500',
    colSpan: 'md:col-span-2',
    extra: (
      <div className="mt-4 grid grid-cols-4 gap-2">
        {[
          { label: 'Fluency', val: 82 },
          { label: 'Grammar', val: 75 },
          { label: 'Vocab', val: 88 },
          { label: 'Coherence', val: 71 },
        ].map((m) => (
          <div key={m.label} className="flex flex-col items-center gap-1.5">
            <div className="relative w-12 h-12">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
                <motion.circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${(m.val / 100) * 94.2} 94.2`}
                  initial={{ strokeDasharray: '0 94.2' }}
                  animate={{ strokeDasharray: `${(m.val / 100) * 94.2} 94.2` }}
                  transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold">
                {m.val}
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground">{m.label}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: <Globe2 className="h-6 w-6" />,
    title: '3 Learning Modes',
    description: 'IELTS Speaking, Business English, and Casual conversation — pick your goal and dive in.',
    accent: 'from-orange-500 to-amber-500',
  },
  {
    icon: <Volume2 className="h-6 w-6" />,
    title: 'Pronunciation Tips',
    description:
      'Clickable pronunciation badges in the conversation pane let you hear the correct articulation instantly via the Web Speech API.',
    accent: 'from-pink-500 to-rose-500',
  },
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: 'Real-Time Grammar Fixes',
    description:
      'Corrections appear inline as you speak, so you immediately see and hear the right form — not just at the end.',
    accent: 'from-indigo-500 to-violet-500',
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: 'Instant Session Start',
    description:
      'No sign-up, no subscription. Bring your Gemini API key and start your first session in under 30 seconds.',
    accent: 'from-yellow-500 to-orange-500',
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: 'Privacy First',
    description:
      'Your API key and conversations never leave your browser. Everything is processed client-side — your data stays yours.',
    accent: 'from-green-500 to-emerald-500',
    colSpan: 'md:col-span-2',
  },
];

export function LandingFeatures() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="features" className="relative py-28 px-4 overflow-hidden">
      {/* Section glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse at 80% 50%, hsl(220 88% 68% / 0.07) 0%, transparent 65%)',
        }}
      />

      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-primary/20 text-primary text-xs font-semibold tracking-widest uppercase font-outfit mb-5">
            Everything You Need
          </div>
          <h2 className="text-4xl sm:text-5xl font-black font-outfit tracking-tight mb-4">
            Built for Serious{' '}
            <span className="gradient-text">Language Learners</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every feature is designed with a single goal: help you speak English with confidence as
            quickly as possible.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              whileHover={{ scale: 1.02, y: -4 }}
              className={`group relative glass rounded-3xl border border-border/50 p-6 cursor-default overflow-hidden gradient-border transition-shadow duration-300 hover:shadow-xl hover:shadow-primary/10 ${feature.colSpan ?? ''}`}
            >
              {/* Hover gradient fill */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.accent} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-300 rounded-3xl`}
                aria-hidden="true"
              />

              <div
                className={`inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br ${feature.accent} text-white shadow-lg mb-4`}
              >
                {feature.icon}
              </div>

              <h3 className="font-outfit font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>

              {feature.extra}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
