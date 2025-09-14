import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function Contact() {
  return (
    <section className="container max-w-7xl py-32 snap-start">
      <h2 className="mb-12 text-3xl font-bold tracking-tight">Contact</h2>
      <Card className="mx-auto max-w-xl">
        <CardHeader>
          <CardTitle>Get in touch</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-sm text-muted-foreground">
            Have questions? We'd love to hear from you.
          </p>
          <Button>Contact Us</Button>
        </CardContent>
      </Card>
    </section>
  );
}

