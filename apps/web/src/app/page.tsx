import { LandingHero } from '@/components/landing/landing-hero';
import { LandingFeatures } from '@/components/landing/landing-features';
import { LandingHowItWorks } from '@/components/landing/landing-how-it-works';
import { LandingCta } from '@/components/landing/landing-cta';
import { LandingNav } from '@/components/landing/landing-nav';
import { LandingFooter } from '@/components/landing/landing-footer';

export const metadata = {
  title: 'Axiom Tutor — AI-Powered Speaking Partner',
  description:
    'Zero-cost, browser-native conversational language tutor for IELTS Speaking prep, Business English, and Casual practice. Powered by Gemini AI.',
};

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Ambient background */}
      <div className="bg-mesh" aria-hidden="true" />

      <LandingNav />

      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingHowItWorks />
        <LandingCta />
      </main>

      <LandingFooter />
    </div>
  );
}
