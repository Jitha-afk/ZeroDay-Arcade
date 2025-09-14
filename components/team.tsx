import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const members = [
  { name: 'Alex Doe', role: 'Founder' },
  { name: 'Sam Lee', role: 'Designer' },
  { name: 'Jordan Kim', role: 'Engineer' },
];

export function Team() {
  return (
    <section className="container max-w-7xl py-24">
      <h2 className="mb-12 text-3xl font-bold tracking-tight">Our Team</h2>
      <div className="grid gap-12 md:grid-cols-3">
        {members.map((member) => (
          <Card key={member.name} className="text-center">
            <CardHeader className="items-center">
              <div className="mb-4 h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 shadow" />
              <CardTitle>{member.name}</CardTitle>
              <CardDescription>{member.role}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}

