"use client";

import { useRouter } from 'next/navigation';
import AdminDashboard from '../../../components/cyberwarsim/AdminDashboard';
import { Button } from '../../../components/ui/button';

export default function Page() {
  const router = useRouter();
  return (
    <main className="min-h-screen w-full">
      <div className="p-6">
        <div className="mb-4">
          <Button variant="outline" onClick={() => router.push('/cyberwarsim')}>← BACK</Button>
        </div>
        <AdminDashboard />
      </div>
    </main>
  );
}
