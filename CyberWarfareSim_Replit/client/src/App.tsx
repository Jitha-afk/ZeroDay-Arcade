import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminDashboard from "@/components/AdminDashboard";
import PlayerEntry from "@/components/PlayerEntry";
import GameRoom from "@/components/GameRoom";
import DebriefPanel from "@/components/DebriefPanel";
import { PERSONAS } from "@shared/schema";
import { Shield, Users, Settings } from "lucide-react";

type AppState = "home" | "admin" | "entry" | "game" | "debrief";

interface CurrentPlayer {
  name: string;
  persona: string;
}

interface PlayerAssignment {
  id: string;
  name: string;
  persona: string;
  assigned: boolean;
}

function HomePage({ onNavigate }: { onNavigate: (state: AppState) => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Shield className="w-12 h-12 text-primary animate-pulse" />
            <h1 className="text-5xl font-mono text-primary">[CYBER_WAR_SIM]</h1>
          </div>
          <h2 className="text-2xl font-mono text-foreground">Cybersecurity Breach Response Training</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Experience realistic AI-powered cyberattack scenarios. Train your incident response team 
            through immersive role-playing simulations with real-time decision making.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-md mx-auto">
          <Card className="hover-elevate cursor-pointer" onClick={() => onNavigate("admin")}>
            <CardHeader className="text-center">
              <Settings className="w-8 h-8 mx-auto text-primary" />
              <CardTitle className="font-mono text-lg">Admin Panel</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Configure game sessions, assign player personas, and manage simulations
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate cursor-pointer" onClick={() => onNavigate("entry")}>
            <CardHeader className="text-center">
              <Users className="w-8 h-8 mx-auto text-primary" />
              <CardTitle className="font-mono text-lg">Join Game</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Enter an active simulation with your assigned cybersecurity role
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="pt-8 border-t">
          <h3 className="text-lg font-mono text-primary mb-4">SIMULATION_FEATURES</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 bg-card rounded-lg">
              <h4 className="font-mono text-primary mb-2">Real-time Events</h4>
              <p className="text-muted-foreground">Dynamic AI-driven scenario with timeline-based incident progression</p>
            </div>
            <div className="p-4 bg-card rounded-lg">
              <h4 className="font-mono text-primary mb-2">Role-based Play</h4>
              <p className="text-muted-foreground">7 specialized personas from CISO to SOC analysts with unique perspectives</p>
            </div>
            <div className="p-4 bg-card rounded-lg">
              <h4 className="font-mono text-primary mb-2">Microsoft Solutions</h4>
              <p className="text-muted-foreground">Learn how security products could prevent and mitigate cyber threats</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Router() {
  const [, setLocation] = useLocation();
  const [appState, setAppState] = useState<AppState>("home");
  const [currentPlayer, setCurrentPlayer] = useState<CurrentPlayer | null>(null);
  const [players, setPlayers] = useState<PlayerAssignment[]>([]);
  const [sessionName, setSessionName] = useState("AI Breach Response Training");

  // No auto-advance timer - simulation runs for full 45 minutes until manually ended

  const handleEnterGame = (playerName: string, persona: string) => {
    setCurrentPlayer({ name: playerName, persona });
    setAppState("game");
  };

  const handleStartGame = (updatedPlayers: PlayerAssignment[], sessionName: string) => {
    setPlayers(updatedPlayers);
    setSessionName(sessionName);
    setAppState("entry");
  };

  const handleLeaveGame = () => {
    setAppState("home");
    setCurrentPlayer(null);
  };

  const handleRestartSession = () => {
    setAppState("entry");
  };

  const handleExitGame = () => {
    setAppState("home");
    setCurrentPlayer(null);
  };

  // Mock debrief data
  const mockDebriefData = {
    sessionData: {
      name: "AI Breach Response Training",
      duration: 2700,
      totalEvents: 15,
      completedEvents: 12
    },
    playerStats: {
      name: currentPlayer?.name || "Player",
      persona: currentPlayer?.persona || PERSONAS.CISO,
      score: 85,
      decisions: 4,
      responseTime: 180,
      correctDecisions: 3
    },
    teamStats: [
      { name: "Maria Santos", persona: PERSONAS.SOC_LEAD, score: 95, decisions: 7, responseTime: 120 },
      { name: currentPlayer?.name || "Player", persona: currentPlayer?.persona || PERSONAS.CISO, score: 85, decisions: 4, responseTime: 180 },
      { name: "Sarah Johnson", persona: PERSONAS.IT_HEAD, score: 82, decisions: 6, responseTime: 150 },
      { name: "David Kim", persona: PERSONAS.SOC_ANALYST, score: 78, decisions: 4, responseTime: 200 }
    ],
    microsoftRecommendations: [
      {
        solution: "Microsoft Defender for Endpoint",
        description: "Advanced threat protection would have detected the AI-generated phishing emails and blocked the initial access attempt.",
        preventionScore: 95
      },
      {
        solution: "Azure Sentinel",
        description: "Intelligent security analytics would have correlated the unusual traffic patterns and file encryption activities.",
        preventionScore: 88
      },
      {
        solution: "Microsoft Purview",
        description: "Data loss prevention policies would have detected and prevented the unauthorized data exfiltration.",
        preventionScore: 75
      }
    ]
  };

  return (
    <Switch>
      <Route path="/">
        {appState === "home" && <HomePage onNavigate={setAppState} />}
        {appState === "admin" && (
          <div>
            <div className="fixed top-4 left-4 z-50">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setAppState("home")}
                className="font-mono"
              >
                ← HOME
              </Button>
            </div>
            <AdminDashboard 
              onStartGame={handleStartGame}
              initialPlayers={players}
              initialSessionName={sessionName}
            />
          </div>
        )}
        {appState === "entry" && (
          <div>
            <div className="fixed top-4 left-4 z-50">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setAppState("home")}
                className="font-mono"
              >
                ← HOME
              </Button>
            </div>
            <PlayerEntry 
              onEnterGame={handleEnterGame}
              assignedPlayers={players.filter(p => p.assigned)}
            />
          </div>
        )}
        {appState === "game" && currentPlayer && (
          <GameRoom currentPlayer={currentPlayer} onLeaveGame={handleLeaveGame} />
        )}
        {appState === "debrief" && (
          <DebriefPanel
            {...mockDebriefData}
            onRestartSession={handleRestartSession}
            onExitGame={handleExitGame}
          />
        )}
      </Route>
    </Switch>
  );
}

function App() {
  // Set dark mode by default for hacker theme
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;