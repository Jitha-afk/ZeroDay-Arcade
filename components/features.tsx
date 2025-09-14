import {
  PersonIcon,
  LightningBoltIcon,
  LockClosedIcon,
  LayersIcon,
  ReloadIcon,
  BarChartIcon,
  RocketIcon,
  GearIcon,
} from '@radix-ui/react-icons';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// Product-specific capabilities reflecting the cybersecurity simulation platform.
const features = [
  {
    icon: PersonIcon,
    title: 'Role-Based Personas',
    description: 'Play as CISO, Blue Team, Compliance, Legal and more for perspective-rich decision practice.',
  },
  {
    icon: LightningBoltIcon,
    title: 'Real-Time Incident Rounds',
    description: 'Fast, timed rounds simulate evolving attack chains requiring rapid prioritization.',
  },
  {
    icon: GearIcon,
    title: 'Adaptive Difficulty Engine',
    description: 'System dynamically escalates complexity based on performance to keep mastery challenging.',
  },
  {
    icon: LockClosedIcon,
    title: 'Resource & Risk Management',
    description: 'Balance budget, authority, reputation and control coverage under pressure.',
  },
  {
    icon: ReloadIcon,
    title: 'Replayable Scenarios',
    description: 'Instant play with branching outcomes enables iterative skill refinement and comparison.',
  },
  {
    icon: BarChartIcon,
    title: 'Persona Scoring & Leaderboards',
    description: 'Track specialized metrics per role plus global rankings to drive competitive learning.',
  },
  {
    icon: LayersIcon,
    title: 'Extensible Content Framework',
    description: 'Add new threat modules, roles and industry variants without core rewrites.',
  },
  {
    icon: RocketIcon,
    title: 'Immediate Feedback & Debriefs',
    description: 'Contextual post-round analysis highlights tradeoffs and missed countermeasures.',
  },
];

export function Features() {
  return (
    <section className="container max-w-7xl py-24">
      <h2 className="mb-12 text-3xl font-bold tracking-tight">Features</h2>
      <div className="grid gap-12 md:grid-cols-3">
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

