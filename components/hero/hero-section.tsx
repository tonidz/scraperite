"use client";

import { HeroContent } from "./hero-content";
import { HeroScrollAnimation } from "./hero-scroll-animation";

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
    <section>
      <HeroScrollAnimation>
        <HeroContent dict={dict} />
      </HeroScrollAnimation>
    </section>
  );
}
