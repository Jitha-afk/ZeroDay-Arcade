"use client";

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { UnicornBackground } from '@/components/unicorn-background';
import gsap from 'gsap';

// Utility to split a phrase into word wrappers (overflow-hidden) and character spans.
function SplitHeadline({
  text,
  className = '',
  wordClass = 'inline-block overflow-hidden',
  charClass = 'inline-block will-change-transform',
  group = '',
}: {
  text: string;
  className?: string;
  wordClass?: string;
  charClass?: string;
  group?: string; // data attribute group for selection
}) {
  return (
    <span className={className} aria-label={text} role="text">
      {text.split(' ').map((word, wi) => (
        <span key={wi} className={wordClass} data-word>
          {word.split('').map((char, ci) => (
            <span
              key={ci}
              className={charClass}
              data-char
              data-group={group}
              style={{ transform: 'translateY(115%)' }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
          {/* Add a space after each word except last */}
          {wi < text.split(' ').length - 1 && (
            <span
              className={charClass}
              aria-hidden
              data-char
              data-group={group}
              style={{ transform: 'translateY(115%)' }}
            >
              {'\u00A0'}
            </span>
          )}
        </span>
      ))}
    </span>
  );
}

export function Hero() {
  const rootRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const chars = rootRef.current.querySelectorAll<HTMLElement>('[data-char][data-group="headline"]');
    if (!chars.length) return;

    const ctx = gsap.context(() => {
      gsap.set(chars, { yPercent: 115 });
      gsap.to(chars, {
        yPercent: 0,
        ease: 'power3.out',
        duration: 0.8,
        stagger: {
          each: 0.035,
          from: 0,
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" className="relative flex min-h-screen w-full flex-col">
      {/* Background placeholder for future unicorn.studio interactive element */}
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background" />
        <div className="absolute inset-0 opacity-40 [mask-image:radial-gradient(circle_at_center,white,transparent)]" />
        <div id="unicorn-background-dev" className="absolute inset-0">
          <div
            data-us-project="RMMwnya8P7v2I9cvfWsa"
            className="h-full w-full"
            style={{ width: '100%', height: '100%' }}
          />
          <UnicornBackground />
        </div>
      </div>

      <div className="flex flex-1 items-end">
        <div className="mx-auto w-full max-w-[1400px] px-4 pb-24 sm:px-6 md:pb-32 lg:px-8">
          <div className="max-w-3xl space-y-8">
            <h1
              ref={rootRef}
              className="text-balance font-extrabold tracking-tight text-4xl leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl"
            >
              <div className="space-y-2">
                <div className="overflow-hidden">
                  <SplitHeadline text="ZeroDay Arcade," group="headline" />
                </div>
                <div className="overflow-hidden text-primary">
                  <SplitHeadline text="The Cyber Wargame Gauntlet" group="headline" />
                </div>
              </div>
            </h1>
            <div>
              <Button size="lg">Try It Out</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
