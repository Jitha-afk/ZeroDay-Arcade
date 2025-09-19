import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PERSONAS } from "@shared/schema";
import ChatInterface from "./ChatInterface";
import TimelineEvent from "./TimelineEvent";
import PersonaCard from "./PersonaCard";
import GameTimer from "./GameTimer";
import { Users, Clock, Activity, Award, Shield } from "lucide-react";
import backgroundImage from "@assets/generated_images/Cyber_command_center_background_88f7c95c.png";

interface GameRoomProps {
  currentPlayer: { name: string; persona: string };
  onLeaveGame?: () => void;
}

export default function GameRoom({ currentPlayer, onLeaveGame }: GameRoomProps) {
  const [currentRoom, setCurrentRoom] = useState("main");
  const [activeTab, setActiveTab] = useState("timeline");
  
  // Mock data - todo: remove mock functionality
  const gameSession = {
    name: "AI Breach Response Training",
    phase: "simulation" as const,
    duration: 2700, // 45 minutes
    timeLeft: 2400
  };

  const mockPlayers = [
    { name: "Alex Chen", persona: PERSONAS.CISO, isOnline: true, currentRoom: "executive", score: 85, decisionsCount: 3 },
    { name: "Maria Santos", persona: PERSONAS.SOC_LEAD, isOnline: true, currentRoom: "soc", score: 92, decisionsCount: 5 },
    { name: "David Kim", persona: PERSONAS.SOC_ANALYST, isOnline: true, currentRoom: "soc", score: 78, decisionsCount: 2 },
    { name: "Sarah Johnson", persona: PERSONAS.IT_HEAD, isOnline: true, currentRoom: "it", score: 88, decisionsCount: 4 },
    { name: "Michael Brown", persona: PERSONAS.PR_HEAD, isOnline: false, currentRoom: "public", score: 76, decisionsCount: 1 },
    { name: "Emily Davis", persona: PERSONAS.CEO, isOnline: true, currentRoom: "executive", score: 90, decisionsCount: 2 },
    { name: "Robert Wilson", persona: PERSONAS.LEGAL_HEAD, isOnline: false, currentRoom: "legal", score: 70, decisionsCount: 1 },
  ];

  // Get persona-specific timeline events for AI breach scenario
  const getPersonaEvents = (persona: string) => {
    const allEvents = {
      [PERSONAS.SOC_ANALYST]: [
        {
          id: "soc_analyst_1",
          title: "Suspicious AI Model Query Patterns",
          description: "Machine learning inference API showing 400% increase in requests with unusual query patterns. Potential data exfiltration through AI model interactions detected.",
          eventType: "alert" as const,
          severity: "medium" as const,
          scheduledTime: 300,
          isTriggered: true
        },
        {
          id: "soc_analyst_2",
          title: "Malicious AI Training Data Injection",
          description: "Anomalous training data uploads detected. Files contain embedded scripts and potential backdoor patterns. AI model integrity compromised.",
          eventType: "decision_point" as const,
          severity: "high" as const,
          scheduledTime: 600,
          isTriggered: true
        },
        {
          id: "soc_analyst_3",
          title: "Automated Attack Progression",
          description: "AI-powered attack tools detected moving laterally through network. Automated credential harvesting and privilege escalation in progress.",
          eventType: "alert" as const,
          severity: "critical" as const,
          scheduledTime: 1200,
          isTriggered: false
        }
      ],
      [PERSONAS.SOC_LEAD]: [
        {
          id: "soc_lead_1",
          title: "Team Coordination Required",
          description: "Multiple SOC analysts reporting AI-related anomalies. Need to coordinate response teams and escalate to management. Consider activating incident response plan.",
          eventType: "decision_point" as const,
          severity: "medium" as const,
          scheduledTime: 420,
          isTriggered: true
        },
        {
          id: "soc_lead_2",
          title: "External Threat Intelligence",
          description: "Threat intel feeds reporting similar AI-targeting attacks on other organizations. Pattern matches current incident. Recommend immediate containment.",
          eventType: "notification" as const,
          severity: "high" as const,
          scheduledTime: 900,
          isTriggered: true
        },
        {
          id: "soc_lead_3",
          title: "Escalation Decision Point",
          description: "Attack has progressed beyond initial containment. Need executive decision on whether to shut down AI systems or maintain operations with increased monitoring.",
          eventType: "decision_point" as const,
          severity: "critical" as const,
          scheduledTime: 1500,
          isTriggered: false
        }
      ],
      [PERSONAS.IT_HEAD]: [
        {
          id: "it_head_1",
          title: "User Access Issues Reported",
          description: "Help desk receiving 50+ tickets about AI-powered tools not responding. Users unable to access document processing and analytics platforms.",
          eventType: "notification" as const,
          severity: "medium" as const,
          scheduledTime: 360,
          isTriggered: true
        },
        {
          id: "it_head_2",
          title: "Infrastructure Performance Degradation",
          description: "AI model servers showing 90% CPU utilization. Suspected of running unauthorized processes. Decision needed on emergency shutdown vs investigation.",
          eventType: "decision_point" as const,
          severity: "high" as const,
          scheduledTime: 780,
          isTriggered: true
        },
        {
          id: "it_head_3",
          title: "Data Center Isolation Required",
          description: "Containment measures require isolating primary AI infrastructure. Will impact 200+ users and halt all machine learning operations for 24-48 hours.",
          eventType: "decision_point" as const,
          severity: "critical" as const,
          scheduledTime: 1320,
          isTriggered: false
        }
      ],
      [PERSONAS.CISO]: [
        {
          id: "ciso_1",
          title: "Executive Briefing Required",
          description: "AI security incident detected. Board notification required within 2 hours per policy. Potential data breach involving AI training data and customer information.",
          eventType: "decision_point" as const,
          severity: "high" as const,
          scheduledTime: 480,
          isTriggered: true
        },
        {
          id: "ciso_2",
          title: "Regulatory Compliance Risk",
          description: "AI incident may trigger GDPR/SOX reporting requirements. Customer PII potentially accessed through compromised ML models. Legal team consultation needed.",
          eventType: "notification" as const,
          severity: "critical" as const,
          scheduledTime: 960,
          isTriggered: true
        },
        {
          id: "ciso_3",
          title: "Strategic Response Decision",
          description: "Attack targeting competitive AI advantage. Intellectual property theft suspected. Decide on public disclosure timeline and competitor notification strategy.",
          eventType: "decision_point" as const,
          severity: "critical" as const,
          scheduledTime: 1680,
          isTriggered: false
        }
      ],
      [PERSONAS.PR_HEAD]: [
        {
          id: "pr_head_1",
          title: "Media Inquiry Received",
          description: "TechCrunch reporter asking about rumors of AI security incident. Customer concerns rising on social media. Prepare holding statement immediately.",
          eventType: "notification" as const,
          severity: "medium" as const,
          scheduledTime: 720,
          isTriggered: true
        },
        {
          id: "pr_head_2",
          title: "Customer Communication Strategy",
          description: "Need to decide on customer notification approach. Option 1: Proactive disclosure. Option 2: Minimal communication. Option 3: Wait for investigation completion.",
          eventType: "decision_point" as const,
          severity: "high" as const,
          scheduledTime: 1080,
          isTriggered: true
        },
        {
          id: "pr_head_3",
          title: "Crisis Communication Response",
          description: "News story published about AI breach. Stock price down 8%. Investor relations requesting immediate response. Prepare for emergency press conference.",
          eventType: "decision_point" as const,
          severity: "critical" as const,
          scheduledTime: 1800,
          isTriggered: false
        }
      ],
      [PERSONAS.CEO]: [
        {
          id: "ceo_1",
          title: "Board Emergency Notification",
          description: "Major AI security incident impacting core business operations. Board chair requesting immediate briefing. Potential impact on Q4 earnings and AI product roadmap.",
          eventType: "notification" as const,
          severity: "critical" as const,
          scheduledTime: 600,
          isTriggered: true
        },
        {
          id: "ceo_2",
          title: "Business Continuity Decision",
          description: "IT recommends shutting down all AI systems. Will halt 60% of product features and impact customer SLAs. Decide on business vs security priority balance.",
          eventType: "decision_point" as const,
          severity: "critical" as const,
          scheduledTime: 1200,
          isTriggered: true
        },
        {
          id: "ceo_3",
          title: "Strategic Partnership Impact",
          description: "Key AI partnership at risk due to security incident. Partner threatening contract termination. $50M deal in jeopardy. Executive decision required.",
          eventType: "decision_point" as const,
          severity: "critical" as const,
          scheduledTime: 2100,
          isTriggered: false
        }
      ],
      [PERSONAS.LEGAL_HEAD]: [
        {
          id: "legal_head_1",
          title: "Regulatory Notification Timeline",
          description: "GDPR breach notification required within 72 hours if personal data compromised. AI models may contain customer PII. Assess notification requirements immediately.",
          eventType: "notification" as const,
          severity: "high" as const,
          scheduledTime: 540,
          isTriggered: true
        },
        {
          id: "legal_head_2",
          title: "Liability Assessment Required",
          description: "Customer data potentially accessed through AI system compromise. Review insurance coverage and potential class action exposure. Litigation risk assessment needed.",
          eventType: "decision_point" as const,
          severity: "high" as const,
          scheduledTime: 1140,
          isTriggered: true
        },
        {
          id: "legal_head_3",
          title: "Law Enforcement Coordination",
          description: "FBI cyber division offering assistance with AI attack investigation. Decision needed on law enforcement cooperation vs internal investigation priority.",
          eventType: "decision_point" as const,
          severity: "medium" as const,
          scheduledTime: 1980,
          isTriggered: false
        }
      ]
    };
    
    return (allEvents as Record<string, any>)[persona] || [];
  };
  
  const personaEvents = getPersonaEvents(currentPlayer.persona);

  const handleEventDecision = (eventId: string, decision: string, reasoning: string) => {
    console.log("Event decision:", { eventId, decision, reasoning });
    // Handle event decision logic here
  };

  const handleRoomChange = (room: string) => {
    setCurrentRoom(room);
    console.log("Room changed to:", room);
  };

  const handleSendMessage = (message: string) => {
    console.log("Message sent to room:", currentRoom, message);
    // Handle message sending logic here
  };

  const onlineCount = mockPlayers.filter(p => p.isOnline).length;
  const totalScore = mockPlayers.find(p => p.name === currentPlayer.name)?.score || 0;
  const playerDecisions = mockPlayers.find(p => p.name === currentPlayer.name)?.decisionsCount || 0;

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="min-h-screen bg-background/95 backdrop-blur-sm">
        {/* Header */}
        <div className="border-b bg-card/90 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-6 h-6 text-primary" />
                  <h1 className="text-xl font-mono text-primary">[CYBER_WAR_SIM]</h1>
                </div>
                <Badge variant="outline" className="font-mono">
                  {currentPlayer.persona.replace('_', ' ')}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {currentPlayer.name}
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4" />
                  <span>{onlineCount}/7 Online</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Award className="w-4 h-4" />
                  <span>{totalScore} Points</span>
                </div>
                <Button
                  data-testid="button-leave-game"
                  variant="outline"
                  size="sm"
                  onClick={onLeaveGame}
                >
                  Leave Game
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-12 gap-6 h-[calc(100vh-140px)]">
            {/* Left Sidebar - Game Info */}
            <div className="col-span-3 space-y-4">
              <GameTimer
                duration={gameSession.duration}
                phase={gameSession.phase}
                onPhaseComplete={() => console.log("Phase completed")}
              />
              
              <Card data-testid="card-session-info">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-mono">SESSION_INFO</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm text-muted-foreground">Scenario:</span>
                    <div className="font-mono text-sm text-foreground">{gameSession.name}</div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Phase:</span>
                    <div className="font-mono text-sm text-primary">{gameSession.phase.toUpperCase()}</div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Your Stats:</span>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div className="text-center p-2 bg-muted/20 rounded">
                        <div className="font-mono text-sm font-semibold">{totalScore}</div>
                        <div className="text-xs text-muted-foreground">Points</div>
                      </div>
                      <div className="text-center p-2 bg-muted/20 rounded">
                        <div className="font-mono text-sm font-semibold">{playerDecisions}</div>
                        <div className="text-xs text-muted-foreground">Decisions</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-online-players">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-mono flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    ACTIVE_PLAYERS
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {mockPlayers.filter(p => p.isOnline).map((player) => (
                    <div key={player.name} className="flex items-center justify-between p-2 bg-muted/10 rounded text-sm">
                      <div>
                        <div className="font-mono">{player.name}</div>
                        <div className="text-xs text-muted-foreground">{player.persona.replace('_', ' ')}</div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {player.currentRoom}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="col-span-9">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="timeline" data-testid="tab-timeline">
                    <Clock className="w-4 h-4 mr-2" />
                    Timeline
                  </TabsTrigger>
                  <TabsTrigger value="chat" data-testid="tab-chat">
                    <Users className="w-4 h-4 mr-2" />
                    Communications
                  </TabsTrigger>
                  <TabsTrigger value="overview" data-testid="tab-overview">
                    <Activity className="w-4 h-4 mr-2" />
                    Team Overview
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="timeline" className="h-full">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="font-mono">INCIDENT_TIMELINE</CardTitle>
                    </CardHeader>
                    <CardContent className="h-full overflow-auto">
                      <div className="space-y-4">
                        {personaEvents.map((event: any) => (
                          <TimelineEvent
                            key={event.id}
                            {...event}
                            targetPersonas={[currentPlayer.persona]}
                            isVisible={true}
                            onDecision={handleEventDecision}
                          />
                        ))}
                        {personaEvents.length === 0 && (
                          <div className="text-center p-8 text-muted-foreground">
                            <p className="font-mono">No specific events for {currentPlayer.persona.replace('_', ' ')} role yet.</p>
                            <p className="text-sm mt-2">Events will appear as the simulation progresses...</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="chat" className="h-full">
                  <Card className="h-full">
                    <ChatInterface
                      currentRoom={currentRoom}
                      currentPlayer={currentPlayer}
                      onSendMessage={handleSendMessage}
                      onRoomChange={handleRoomChange}
                    />
                  </Card>
                </TabsContent>

                <TabsContent value="overview" className="h-full">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="font-mono">TEAM_STATUS</CardTitle>
                    </CardHeader>
                    <CardContent className="h-full overflow-auto">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {mockPlayers.map((player) => (
                          <PersonaCard
                            key={player.name}
                            name={player.name}
                            persona={player.persona}
                            isOnline={player.isOnline}
                            currentRoom={player.currentRoom}
                            score={player.score}
                            decisionsCount={player.decisionsCount}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}