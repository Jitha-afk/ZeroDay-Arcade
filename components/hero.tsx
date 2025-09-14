import { Button } from '@/components/ui/button';
import { UnicornBackground } from '@/components/unicorn-background';

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen w-full flex-col"
    >
      {/* Background placeholder for future unicorn.studio interactive element */}
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        {/* Gradient fallback */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background" />
        <div className="absolute inset-0 opacity-40 [mask-image:radial-gradient(circle_at_center,white,transparent)]" />
        {/* Unicorn Studio Mount */}
        <div id="unicorn-background-dev" className="absolute inset-0">
          <div
            data-us-project="RMMwnya8P7v2I9cvfWsa"
            className="h-full w-full"
            style={{ width: '100%', height: '100%' }}
          />
          <UnicornBackground />
        </div>
      </div>

      {/* Content container anchored bottom-left */}
      <div className="flex flex-1 items-end">
        <div className="mx-auto w-full max-w-[1400px] px-4 pb-24 sm:px-6 md:pb-32 lg:px-8">
          <div className="max-w-3xl space-y-8">
            <h1 className="text-balance font-extrabold tracking-tight text-4xl leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="block">ZeroDay Arcade,</span>
              <span className="block text-primary">The Cyber Wargame Gauntlet</span>
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
