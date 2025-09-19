"use client";

import { useRouter } from 'next/navigation';
import PlayerEntry from '../../../components/cyberwarsim/PlayerEntry';
import { Button } from '../../../components/ui/button';

export default function Page() {
  const router = useRouter();
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
