import { RocketIcon, LockClosedIcon, LightningBoltIcon } from '@radix-ui/react-icons';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const features = [
  {
    icon: RocketIcon,
    title: 'Fast Setup',
    description: 'Get up and running quickly with minimal configuration.',
  },
  {
    icon: LockClosedIcon,
    title: 'Secure by Default',
    description: 'Built with security best practices to keep your data safe.',
  },
  {
    icon: LightningBoltIcon,
    title: 'Blazing Performance',
    description: 'Optimized for speed to deliver a snappy user experience.',
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

