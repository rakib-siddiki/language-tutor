"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Mic,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Volume2,
  Star,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const floatVariant = {
  animate: {
    y: [0, -18, 0],
    rotate: [0, 1.5, -1.5, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

export function LandingHero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-16 px-4 overflow-hidden">
      {/* Top radial glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at center, hsl(262 88% 68% / 0.18) 0%, transparent 65%)",
        }}
      />

      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-12">
          {/* Left: Text Content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Eyebrow */}
            <motion.div
              variants={fadeUp}
              custom={0}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/25 text-primary mb-6"
            >
              <Sparkles className="h-3.5 w-3.5 animate-pulse-slow" />
              <span className="text-xs font-semibold tracking-widest uppercase font-outfit">
                Powered by Gemini AI · 100% Free
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              custom={1}
              initial="hidden"
              animate="visible"
              className="text-5xl sm:text-6xl lg:text-7xl font-black font-outfit tracking-tight leading-[1.05] mb-6"
            >
              Speak Fluently.{" "}
              <span className="gradient-text">Think Clearly.</span>{" "}
              <span className="block">Score Higher.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeUp}
              custom={2}
              initial="hidden"
              animate="visible"
              className="text-lg sm:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed"
            >
              A browser-native AI speaking partner for{" "}
              <strong className="text-foreground font-semibold">
                IELTS prep
              </strong>
              ,{" "}
              <strong className="text-foreground font-semibold">
                Business English
              </strong>
              , and{" "}
              <strong className="text-foreground font-semibold">
                casual fluency
              </strong>
              . Real-time corrections, instant feedback — zero cost.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeUp}
              custom={3}
              initial="hidden"
              animate="visible"
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <Link
                href="/dashboard"
                id="hero-start-btn"
                className="group relative inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-base shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:brightness-110 active:scale-95 transition-all duration-200 animate-glow"
              >
                <Mic className="h-5 w-5" />
                Start Practicing Free
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              <a
                href="#how-it-works"
                id="hero-how-it-works-btn"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl glass border border-border/60 font-semibold text-sm text-foreground hover:border-primary/40 hover:text-primary transition-all duration-200"
              >
                See How It Works
                <ChevronDown className="h-4 w-4" />
              </a>
            </motion.div>

            {/* Social proof */}
            <motion.div
              variants={fadeUp}
              custom={4}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-3 mt-8 justify-center lg:justify-start"
            >
              <div className="flex -space-x-2">
                {["#7C3AED", "#3B82F6", "#10B981", "#F59E0B"].map(
                  (color, i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ background: color }}
                    >
                      {["A", "B", "R", "M"][i]}
                    </div>
                  ),
                )}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-3 w-3 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  Trusted by 1,000+ learners
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right: Floating UI Mockup */}
          <motion.div
            variants={floatVariant}
            animate="animate"
            className="flex-shrink-0 relative w-full max-w-sm lg:max-w-md"
          >
            {/* Outer glow ring */}
            <div
              className="absolute inset-0 rounded-3xl"
              style={{
                background:
                  "radial-gradient(ellipse, hsl(262 88% 68% / 0.25) 0%, transparent 70%)",
                filter: "blur(40px)",
                transform: "scale(1.15)",
              }}
              aria-hidden="true"
            />

            {/* Main Card */}
            <div className="relative glass-strong rounded-3xl border border-border/60 gradient-border p-6 shadow-2xl shadow-black/20">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse-slow" />
                  <span className="text-sm font-semibold">Live Session</span>
                </div>
                <span className="text-xs text-muted-foreground glass px-2.5 py-1 rounded-full border border-border/40">
                  IELTS Speaking Part 2
                </span>
              </div>

              {/* Conversation Bubbles */}
              <div className="space-y-3 mb-5">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="glass rounded-2xl rounded-tl-sm px-3.5 py-2.5 border border-border/40 max-w-[220px]">
                    <p className="text-xs text-muted-foreground font-medium mb-0.5">
                      AI Tutor
                    </p>
                    <p className="text-sm leading-relaxed">
                      Describe a place you've visited that left a strong
                      impression on you.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <div className="bg-primary rounded-2xl rounded-tr-sm px-3.5 py-2.5 max-w-[200px]">
                    <p className="text-xs text-primary-foreground/70 font-medium mb-0.5">
                      You
                    </p>
                    <p className="text-sm text-primary-foreground leading-relaxed">
                      I'd like to talk about Kyoto, Japan. It's absolutely...
                    </p>
                  </div>
                </div>
              </div>

              {/* Waveform animation */}
              <div
                className="flex items-center gap-1.5 justify-center mb-4"
                style={{ height: 36, contain: "layout style" }}
              >
                {[4, 8, 14, 20, 14, 8, 20, 14, 8, 4, 8, 14, 20, 14, 8, 4].map(
                  (h, i) => (
                    <motion.div
                      key={i}
                      className="w-1 rounded-full bg-primary/70"
                      animate={{ height: [h, h * 1.8, h] }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.06,
                        ease: "easeInOut",
                      }}
                      style={{ minHeight: 4 }}
                    />
                  ),
                )}
              </div>

              {/* Feedback badge */}
              <div className="glass rounded-2xl p-3 border border-emerald-500/20">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-xs font-semibold text-emerald-400">
                    Instant Feedback
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  ✓ Great use of past tense &nbsp;•&nbsp; ✓ Clear topic sentence
                  <span className="text-amber-400">
                    {" "}
                    • Try: "It had a profound impact..."
                  </span>
                </p>
              </div>
            </div>

            {/* Floating badges */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="absolute -left-10 top-1/3 glass rounded-2xl px-3 py-2 border border-border/50 shadow-lg hidden lg:block"
            >
              <div className="flex items-center gap-2">
                <Volume2 className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-xs font-semibold">Pronunciation AI</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="absolute -right-8 bottom-1/4 glass rounded-2xl px-3 py-2 border border-border/50 shadow-lg hidden lg:block"
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold">Real-time Grammar</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
      >
        <span className="text-xs tracking-widest uppercase font-medium">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}
