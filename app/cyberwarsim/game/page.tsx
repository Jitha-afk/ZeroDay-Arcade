"use client";

import { useRouter } from 'next/navigation';
import GameRoom from '../../../components/cyberwarsim/GameRoom';
import { Button } from '../../../components/ui/button';

export default function Page() {
  const router = useRouter();
  return (
    <main className="min-h-screen w-full">
      <div className="p-6">
        <div className="mb-4">
          <Button variant="outline" onClick={() => router.push('/cyberwarsim')}>← BACK</Button>
        </div>
        {/* GameRoom will load current player and scenario from sessionStorage */}
        <GameRoom onLeaveGame={() => router.push('/cyberwarsim')} />
      </div>
    </main>
  );
}
