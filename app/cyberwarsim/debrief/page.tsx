"use client";

import { useRouter } from 'next/navigation';
import DebriefPanel from '../../../components/cyberwarsim/DebriefPanel';
import { Button } from '../../../components/ui/button';

export default function Page() {
  const router = useRouter();
  // Minimal mock data
  const mockDebriefData = {
    sessionData: { name: 'AI Breach Response Training', duration: 2700, totalEvents: 15, completedEvents: 12 },
    playerStats: { name: 'Demo Player', persona: 'CISO', score: 85, decisions: 4, responseTime: 180, correctDecisions: 3 },
    teamStats: [
      { name: 'Maria Santos', persona: 'SOC_LEAD', score: 95, decisions: 7, responseTime: 120 },
      { name: 'Demo Player', persona: 'CISO', score: 85, decisions: 4, responseTime: 180 },
      { name: 'Sarah Johnson', persona: 'IT_HEAD', score: 82, decisions: 6, responseTime: 150 }
    ],
    microsoftRecommendations: [
      { solution: 'Microsoft Defender for Endpoint', description: 'Would have detected initial access.', preventionScore: 95 },
      { solution: 'Azure Sentinel', description: 'Would have correlated unusual activity.', preventionScore: 88 }
    ]
  };

  return (
    <main className="min-h-screen w-full">
      <div className="p-6">
        <div className="mb-4">
          <Button variant="outline" onClick={() => router.push('/cyberwarsim')}>← BACK</Button>
        </div>
        <DebriefPanel {...mockDebriefData} onRestartSession={() => router.push('/cyberwarsim')} onExitGame={() => router.push('/')} />
      </div>
    </main>
  );
}
