import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const members = [
  { name: 'Jitesh Thakur', roles: ['Sr. Security Engineer', 'Designer'] },
  { name: 'Shalabh Pradhan', roles: ['GTM Manager - Security', 'Architect'] },
];

export function Team() {
  return (
    <section className="container max-w-7xl py-32 snap-start">
      <h2 className="mb-12 text-3xl font-bold tracking-tight">Our Team</h2>
      <div className="grid gap-12 md:grid-cols-2">
        {members.map((member) => (
          <Card key={member.name} className="text-center">
            <CardHeader className="items-center space-y-2">
              <div className="mb-2 h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 shadow" />
              <CardTitle>{member.name}</CardTitle>
              <CardDescription>
                <div className="flex flex-col gap-0.5">
                  {member.roles.map((r) => (
                    <span key={r}>{r}</span>
                  ))}
                </div>
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}

