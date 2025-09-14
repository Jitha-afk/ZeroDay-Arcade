import {
  PersonIcon,
  LightningBoltIcon,
  LockClosedIcon,
  BarChartIcon,
} from '@radix-ui/react-icons';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

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
  return (
    <section className="container max-w-7xl py-24">
      <h2 className="mb-12 text-3xl font-bold tracking-tight">Features</h2>
  <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, description }) => (
          <Card key={title} className="">
            <CardHeader>
              <Icon className="mb-4 h-6 w-6 text-primary" aria-hidden="true" />
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}

