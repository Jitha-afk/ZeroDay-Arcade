"use client";
import React from 'react';
import { cn } from '@/lib/utils';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
}

const testimonials: Testimonial[] = [
  { id: 1, name: 'Ava K.', role: 'Red Team Analyst', quote: 'The gauntlet sharpened my live pivoting instincts.' },
  { id: 2, name: 'Leon P.', role: 'Blue Team Lead', quote: 'Best simulated breach pressure I have experienced.' },
  { id: 3, name: 'Mina S.', role: 'SOC Engineer', quote: 'Forced me to operationalize detection ideas fast.' },
  { id: 4, name: 'Carlos R.', role: 'Incident Responder', quote: 'Like compressed years of IR experience into hours.' },
  { id: 5, name: 'Jules T.', role: 'Threat Hunter', quote: 'Scenario chaining felt eerily real-world.' },
  { id: 6, name: 'Nadia Q.', role: 'Purple Team Strategist', quote: 'Invaluable for testing our internal hypotheses.' },
  { id: 7, name: 'Omar V.', role: 'Malware Analyst', quote: 'Payload variety kept me guessing every round.' },
  { id: 8, name: 'Priya D.', role: 'AppSec Engineer', quote: 'Loved the exploit-to-detection feedback loop.' },
  { id: 9, name: 'Zane H.', role: 'CTF Player', quote: 'Bridges fun and production-grade TTP realism.' },
  { id: 10, name: 'Riko E.', role: 'Security Researcher', quote: 'Crafted adversary paths worthy of real reports.' },
];

// Duplicate arrays for seamless marquee looping
const loopA = [...testimonials, ...testimonials];
const loopB = [...testimonials, ...testimonials];

function Card({ t }: { t: Testimonial }) {
  return (
    <figure className="w-[280px] shrink-0 rounded-xl border bg-card p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
      <blockquote className="text-sm leading-snug text-muted-foreground">“{t.quote}”</blockquote>
      <figcaption className="mt-3 text-xs font-medium text-foreground">
        <span className="block">{t.name}</span>
        <span className="text-[11px] text-muted-foreground/80">{t.role}</span>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  return (
    <section aria-label="Testimonials" className="relative w-full overflow-hidden py-24">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background" />
      <div className="space-y-14">
        <div className="flex gap-6 animate-marquee-left will-change-transform" aria-hidden>
          {loopA.map((t, i) => (
            <Card key={`top-${t.id}-${i}`} t={t} />
          ))}
        </div>
        <div className="flex gap-6 animate-marquee-right will-change-transform" aria-hidden>
          {loopB.map((t, i) => (
            <Card key={`bottom-${t.id}-${i}`} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
