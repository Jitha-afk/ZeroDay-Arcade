"use client";

import { useRouter } from 'next/navigation';
import { Button } from '../../../../components/ui/button';

// Briefing / Intro page shown before players proceed to the join (PlayerEntry) screen.
// Path: /cyberwarsim/join/briefing
// On Acknowledge it navigates to /cyberwarsim/join
export default function BriefingPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-950 to-black px-4 py-10 text-slate-100">
      <div className="w-full max-w-5xl">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-teal-300 drop-shadow-sm">
            GLITCH IN THE CART
          </h1>
          <p className="mt-2 text-lg md:text-xl font-semibold text-rose-400">
            The Crisis Unfolds
          </p>
        </header>

        <section className="grid md:grid-cols-2 gap-8 bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-700/60 p-8 shadow-xl">
          <div>
            <h2 className="text-xl font-bold text-teal-300 mb-4 uppercase tracking-wide">The Crisis Unfolds</h2>
            <p className="text-sm leading-relaxed text-slate-300 mb-4">
              In the bustling digital ecosystem of a global retail enterprise, an AI system designed to serve customers becomes the source of chaos. What starts as a rumor&mdash;a security incident&mdash;quickly spirals into a full-scale cyber crisis, threatening data integrity, operational continuity, and stakeholder trust.
            </p>
            <p className="text-sm leading-relaxed text-slate-300 mb-4">
              You are about to experience a major cyber-crisis situation in <span className="font-semibold">ABC Retail Company</span>, a large MNC selling across 20 countries. They have adopted AI in all their operations&mdash;and that prized artifact which handles customer queries, and order processing.
            </p>
            <p className="text-sm leading-relaxed text-amber-300 font-semibold">
              Welcome to the frontline of AI security warfare.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-teal-300 mb-4 uppercase tracking-wide">Your Mission</h2>
            <ul className="list-disc list-outside space-y-3 pl-5 text-sm text-slate-300">
              <li>Step into specialized roles: SOC Analyst, IT Head, SOC Lead, CISO, Legal, PR.</li>
              <li>Respond to escalating threat levels across the incident timeline.</li>
              <li>Make critical decisions under pressure: monitor, isolate, outsource, shut down.</li>
              <li>Coordinate forensic investigations and external response teams.</li>
              <li>Balance legal, reputational, and operational risks.</li>
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-rose-400 font-semibold">
              The next 10 minutes will test your ability to lead, adapt, and protect your organization from an intelligent threat.
            </p>
          </div>
        </section>

        <div className="flex justify-center mt-10">
          <Button
            size="lg"
            onClick={() => {
              try {
                localStorage.setItem('briefingAcknowledged', 'true');
              } catch (e) {
                // non-blocking
              }
              router.push('/cyberwarsim/join');
            }}
            className="px-10 font-semibold"
          >
            Acknowledge & Continue →
          </Button>
        </div>
      </div>
    </main>
  );
}
