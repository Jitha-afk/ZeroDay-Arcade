"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import PlayerEntry from '../../../components/cyberwarsim/PlayerEntry';
import { Button } from '../../../components/ui/button';

export default function Page() {
  const router = useRouter();
  useEffect(() => {
    try {
      const acknowledged = typeof window !== 'undefined' && localStorage.getItem('briefingAcknowledged') === 'true';
      if (!acknowledged) {
        router.replace('/cyberwarsim/join/briefing');
      }
    } catch (e) {
      // If storage fails, still allow but could choose to redirect
    }
  }, [router]);
  return (
    <main className="min-h-screen w-full">
      <div className="p-6">
        <div className="mb-4">
          <Button variant="outline" onClick={() => router.push('/cyberwarsim')}>← BACK</Button>
        </div>
        <PlayerEntry />
      </div>
    </main>
  );
}
