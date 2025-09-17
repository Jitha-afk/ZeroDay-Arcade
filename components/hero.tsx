"use client";

import { useLayoutEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { UnicornBackground } from '@/components/unicorn-background';
import gsap from 'gsap';
import { useRouter } from 'next/navigation';

// Utility to split a phrase into word wrappers (overflow-hidden) and character spans.
function SplitHeadline({
  text,
  group = '',
  charClass = 'inline-block will-change-transform',
}: {
  text: string;
  group?: string;
  charClass?: string;
}) {
  const words = text.split(' ');
  return (
    <div aria-label={text} role="text" className="flex flex-wrap gap-x-2">
      {words.map((word, wi) => (
        <div
          key={wi}
          className="relative inline-block overflow-hidden"
          data-word
          style={{ lineHeight: '1.05', paddingBottom: '2px' }}
        >
          {word.split('').map((char, ci) => (
            <span
              key={ci}
              className={charClass}
              data-char
              data-group={group}
              data-anim
              style={{ display: 'inline-block' }}
            >
              {char}
            </span>
          ))}
          {wi < words.length - 1 && <span className="inline-block" style={{ width: '0.5ch' }} />}
        </div>
      ))}
    </div>
  );
}

export function Hero() {
  const rootRef = useRef<HTMLHeadingElement | null>(null);
  const router = useRouter();

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    const chars = rootRef.current.querySelectorAll<HTMLElement>('[data-anim][data-group="headline"]');
    if (!chars.length) return;

    const ctx = gsap.context(() => {
      // Set initial off-screen position (below container)
      gsap.set(chars, { yPercent: 120 });
      // Animate upward with a subtle bounce (down then up feel)
      gsap.to(chars, {
        yPercent: 0,
        ease: 'back.out(1.8)',
        duration: 0.8,
        stagger: { each: 0.035, from: 0 },
        force3D: true,
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
  <section id="hero" className="relative flex min-h-screen w-full flex-col snap-start">
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
                  <SplitHeadline text="The Cyber Wargame Simulation" group="headline" />
                </div>
              </div>
            </h1>
            <div>
              <Button size="lg" onClick={() => router.push('/cyberwarsim')}>Try It Out</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
