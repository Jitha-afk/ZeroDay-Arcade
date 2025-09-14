"use client";

import {
  PersonIcon,
  LightningBoltIcon,
  LockClosedIcon,
  BarChartIcon,
} from '@radix-ui/react-icons';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Consolidated into four key pillars.
const features = [
  {
    icon: PersonIcon,
    title: 'Multi-Role Simulation',
    description: 'Play as CISO, Blue Team, Compliance or Legal across branching attack narratives for perspective-rich decisions.',
  },
  {
    icon: LightningBoltIcon,
    title: 'Dynamic Incident Engine',
    description: 'Timed evolving rounds with adaptive difficulty and replayable branches keep challenge and mastery in sync.',
  },
  {
    icon: LockClosedIcon,
    title: 'Risk & Resource Strategy',
    description: 'Balance budget, control coverage, authority and reputation under pressure to mitigate cascading impact.',
  },
  {
    icon: BarChartIcon,
    title: 'Analytics & Feedback Loop',
    description: 'Persona scoring, leaderboards and fast debrief insights highlight tradeoffs and skill growth paths.',
  },
];

export function Features() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!cardsRef.current) return;
    const cards = cardsRef.current.querySelectorAll<HTMLElement>('[data-feature-card]');
    if (!cards.length) return;
    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        gsap.set(card, { y: 40, opacity: 0 });
        gsap.to(card, {
            y: 0,
            opacity: 1,
            ease: 'power3.out',
            duration: 0.8,
            delay: i * 0.1,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 65%',
              toggleActions: 'play none none reverse'
            }
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="container max-w-7xl py-32 snap-start" id="features">
      <h2 className="mb-16 text-4xl font-bold tracking-tight">Features</h2>
      <div ref={cardsRef} className="grid gap-14 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, description }) => (
          <Card
            key={title}
            data-feature-card
            className="relative flex h-full flex-col justify-start border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-md hover:shadow-lg transition-shadow"
          >
            <CardHeader className="p-8">
              <Icon className="mb-6 h-8 w-8 text-primary" aria-hidden="true" />
              <CardTitle className="mb-3 text-xl leading-tight">{title}</CardTitle>
              <CardDescription className="leading-relaxed text-sm">{description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}

