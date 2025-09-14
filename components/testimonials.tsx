"use client";
import React, { useLayoutEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
    <figure className="testimonial-card w-[280px] shrink-0 rounded-xl border bg-card p-4 shadow-sm transition-shadow duration-300 will-change-transform opacity-0 translate-y-[100px]">
      <blockquote className="text-sm leading-snug text-muted-foreground">“{t.quote}”</blockquote>
      <figcaption className="mt-3 text-xs font-medium text-foreground">
        <span className="block">{t.name}</span>
        <span className="text-[11px] text-muted-foreground/80">{t.role}</span>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!sectionRef.current) return;
    const cards = sectionRef.current.querySelectorAll<HTMLElement>('.testimonial-card');
    if (!cards.length) return;

    const ctx = gsap.context(() => {
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        ease: 'power3.out',
        duration: 0.9,
        stagger: { each: 0.12, from: 0 },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} aria-label="Testimonials" className="relative w-full overflow-hidden py-24">
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
