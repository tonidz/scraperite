'use client';

import { HeroContent } from './hero-content';

interface HeroSectionProps {
  dict: {
    title: string;
    description: string;
    button: string;
    stats: {
      monthlyTraffic: string;
      happyCustomers: string;
    };
  };
}

export function HeroSection({ dict }: HeroSectionProps) {
  return (
    <section className="min-h-[400px] flex items-center">
      <div className="w-full max-w-7xl mx-auto px-4">
        <HeroContent dict={dict} />
      </div>
    </section>
  );
}