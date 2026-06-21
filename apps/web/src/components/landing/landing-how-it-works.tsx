'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { KeyRound, Mic, BrainCircuit, BarChart3 } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: <KeyRound className="h-6 w-6" />,
    title: 'Add Your Gemini API Key',
    description:
      'Get a free Google Gemini API key in minutes. Paste it into the session setup — it stays in your browser, never on our servers.',
    accent: 'from-violet-500 to-purple-600',
    detail: (
      <div className="mt-4 glass rounded-2xl px-4 py-3 border border-border/40 font-mono text-xs text-muted-foreground">
        <span className="text-primary">API_KEY</span> = <span className="text-emerald-400">AIzaSy••••••••••••••••••</span>
        <span className="animate-pulse ml-1 text-foreground">|</span>
      </div>
    ),
  },
  {
    number: '02',
    icon: <Mic className="h-6 w-6" />,
    title: 'Choose Your Mode & Scenario',
    description:
      'Select from IELTS Speaking, Business English, or Casual conversation. Set a scenario topic and preferred AI voice — then hit Start.',
    accent: 'from-blue-500 to-cyan-500',
    detail: (
      <div className="mt-4 flex flex-wrap gap-2">
        {['🎓 IELTS Speaking', '💼 Business English', '💬 Casual Chat'].map((m) => (
          <span
            key={m}
            className="glass rounded-xl px-3 py-1.5 border border-border/40 text-xs font-semibold"
          >
            {m}
          </span>
        ))}
      </div>
    ),
  },
  {
    number: '03',
    icon: <BrainCircuit className="h-6 w-6" />,
    title: 'Have a Real Conversation',
    description:
      'Speak naturally. The Gemini AI listens, responds, corrects your grammar in real time, and offers pronunciation tips inline.',
    accent: 'from-emerald-500 to-teal-500',
    detail: (
      <div className="mt-4 space-y-2">
        <div className="flex gap-2 items-start">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
          <span className="text-xs text-muted-foreground">✓ Real-time grammar corrections inline</span>
        </div>
        <div className="flex gap-2 items-start">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
          <span className="text-xs text-muted-foreground">✓ Clickable pronunciation audio badges</span>
        </div>
        <div className="flex gap-2 items-start">
          <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 flex-shrink-0" />
          <span className="text-xs text-muted-foreground">✓ Contextual vocabulary suggestions</span>
        </div>
      </div>
    ),
  },
  {
    number: '04',
    icon: <BarChart3 className="h-6 w-6" />,
    title: 'Review Your Performance',
    description:
      'After the session, get a full AI-generated report covering fluency, grammar accuracy, vocabulary range, and IELTS band estimates.',
    accent: 'from-orange-500 to-amber-500',
    detail: (
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          { label: 'Band Score', val: '7.0', icon: '🏆' },
          { label: 'Fluency', val: '82%', icon: '🎙️' },
          { label: 'Grammar', val: '75%', icon: '📝' },
        ].map((s) => (
          <div
            key={s.label}
            className="glass rounded-2xl p-2.5 border border-border/40 text-center"
          >
            <div className="text-base mb-0.5">{s.icon}</div>
            <div className="font-bold text-sm font-outfit">{s.val}</div>
            <div className="text-[10px] text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    ),
  },
];

export function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="relative py-28 px-4 overflow-hidden">
      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse at 20% 60%, hsl(262 88% 68% / 0.07) 0%, transparent 60%)',
        }}
      />

      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-primary/20 text-primary text-xs font-semibold tracking-widest uppercase font-outfit mb-5">
            How It Works
          </div>
          <h2 className="text-4xl sm:text-5xl font-black font-outfit tracking-tight mb-4">
            From Zero to{' '}
            <span className="gradient-text">Fluent in 4 Steps</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            No complicated onboarding. Just you, your voice, and an AI that actually helps.
          </p>
        </motion.div>

        {/* Steps — alternating zig-zag */}
        <div className="space-y-14">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className={`flex flex-col ${
                i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              } items-center gap-10`}
            >
              {/* Content side */}
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <span
                    className="text-6xl font-black font-outfit tracking-tighter opacity-10"
                    aria-hidden="true"
                  >
                    {step.number}
                  </span>
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${step.accent} text-white shadow-lg`}
                  >
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold font-outfit mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed max-w-sm">{step.description}</p>
              </div>

              {/* Visual side */}
              <div className="flex-1 w-full">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="glass-strong rounded-3xl border border-border/50 p-6 gradient-border shadow-xl shadow-black/10"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br ${step.accent} text-white`}
                    >
                      {step.icon}
                    </div>
                    <span className="font-semibold text-sm">{step.title}</span>
                  </div>
                  {step.detail}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
