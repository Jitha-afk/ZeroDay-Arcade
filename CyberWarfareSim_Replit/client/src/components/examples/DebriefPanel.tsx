import DebriefPanel from '../DebriefPanel';
import { PERSONAS } from "@shared/schema";

export default function DebriefPanelExample() {
  const mockSessionData = {
    name: "AI Breach Response Training",
    duration: 2700,
    totalEvents: 15,
    completedEvents: 12
  };

  const mockPlayerStats = {
    name: "Alex Chen",
    persona: PERSONAS.CISO,
    score: 88,
    decisions: 5,
    responseTime: 180,
    correctDecisions: 4
  };

  const mockTeamStats = [
    { name: "Maria Santos", persona: PERSONAS.SOC_LEAD, score: 95, decisions: 7, responseTime: 120 },
    { name: "Alex Chen", persona: PERSONAS.CISO, score: 88, decisions: 5, responseTime: 180 },
    { name: "Sarah Johnson", persona: PERSONAS.IT_HEAD, score: 82, decisions: 6, responseTime: 150 },
    { name: "David Kim", persona: PERSONAS.SOC_ANALYST, score: 78, decisions: 4, responseTime: 200 },
    { name: "Emily Davis", persona: PERSONAS.CEO, score: 75, decisions: 3, responseTime: 240 },
    { name: "Michael Brown", persona: PERSONAS.PR_HEAD, score: 70, decisions: 2, responseTime: 300 },
    { name: "Robert Wilson", persona: PERSONAS.LEGAL_HEAD, score: 68, decisions: 2, responseTime: 280 }
  ];

  const mockMicrosoftRecommendations = [
    {
      solution: "Microsoft Defender for Endpoint",
      description: "Advanced threat protection would have detected the AI-generated phishing emails and blocked the initial access attempt using behavioral analysis.",
      preventionScore: 95
    },
    {
      solution: "Azure Sentinel",
      description: "Intelligent security analytics would have correlated the unusual traffic patterns and file encryption activities, triggering automated response workflows.",
      preventionScore: 88
    },
    {
      solution: "Microsoft Purview",
      description: "Data loss prevention policies would have detected and prevented the unauthorized data exfiltration from Server-01 before significant damage occurred.",
      preventionScore: 75
    },
    {
      solution: "Microsoft 365 Defender",
      description: "Integrated security across email, endpoints, and cloud apps would have provided unified threat visibility and coordinated incident response.",
      preventionScore: 92
    }
  ];

  return (
    <DebriefPanel
      sessionData={mockSessionData}
      playerStats={mockPlayerStats}
      teamStats={mockTeamStats}
      microsoftRecommendations={mockMicrosoftRecommendations}
      onRestartSession={() => console.log('Restarting session')}
      onExitGame={() => console.log('Exiting game')}
    />
  );
}