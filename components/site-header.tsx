import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="font-bold tracking-tight">
          ZeroDay Arcade
        </Link>
        <Button size="sm">Get Started</Button>
      </div>
    </header>
  );
}
