import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="container grid max-w-7xl items-center gap-6 py-24 md:grid-cols-2 md:gap-16">
      <div className="flex flex-col gap-6">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Launch Your Next Project
        </h1>
        <p className="text-lg text-muted-foreground">
          Build stunning experiences with our toolkit of modern components and
          utilities.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button size="lg">Get Started</Button>
          <Button variant="secondary" size="lg">
            Learn More
          </Button>
        </div>
      </div>
      <div className="h-64 w-full rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 shadow-lg" />
    </section>
  );
}
