"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent, SheetClose } from '@/components/ui/sheet';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '#scenarios', label: 'Scenarios' },
  { href: '#features', label: 'Features' },
  { href: '#leagues', label: 'Leagues' },
  { href: '#team', label: 'Team' },
  { href: '#contact', label: 'Contact' },
];

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="fixed top-0 z-40 w-full border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left: Logo */}
        <div className="flex flex-1 items-center">
          <Link href="/" className="flex items-center font-semibold tracking-tight text-lg md:text-xl">
            <span className="text-primary">ZeroDay</span>&nbsp;Arcade
          </Link>
        </div>
        {/* Center: Primary Nav (desktop) */}
        <nav className="hidden flex-1 justify-center md:flex">
          <ul className="flex items-center gap-6 text-sm font-medium">
            {navItems.map(item => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'transition-colors hover:text-primary',
                    pathname === item.href && 'text-primary'
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {/* Right: CTAs */}
        <div className="hidden flex-1 items-center justify-end gap-3 md:flex">
          <Button variant="secondary" size="sm">Login</Button>
          <Button size="sm">Join Up</Button>
        </div>
        {/* Mobile Menu */}
        <div className="flex items-center md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 w-9 px-0">
                <HamburgerMenuIcon className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="w-80 pr-0">
              <div className="flex flex-col gap-6 py-2">
                <div className="px-1">
                  <Link href="/" className="font-semibold tracking-tight text-lg" >
                    <span className="text-primary">ZeroDay</span> Arcade
                  </Link>
                </div>
                <ul className="flex flex-col gap-2 px-1">
                  {navItems.map(item => (
                    <li key={item.href}>
                      <SheetClose asChild>
                        <Link
                          href={item.href}
                          className="block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          {item.label}
                        </Link>
                      </SheetClose>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col gap-3 px-1 pb-8">
                  <Button variant="secondary" className="w-full" size="sm">Login</Button>
                  <Button className="w-full" size="sm">Join Up</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
