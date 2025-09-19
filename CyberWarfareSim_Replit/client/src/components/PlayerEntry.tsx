import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PERSONAS } from "@shared/schema";
import { Shield, User, ArrowRight, Terminal } from "lucide-react";
import backgroundImage from "@assets/generated_images/Cyber_command_center_background_88f7c95c.png";

interface PlayerEntryProps {
  onEnterGame?: (playerName: string, persona: string) => void;
  assignedPlayers?: Array<{ id: string; name: string; persona: string; assigned: boolean }>;
}

export default function PlayerEntry({ onEnterGame, assignedPlayers = [] }: PlayerEntryProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  
  // Use actual assigned players from admin dashboard
  const availablePlayers = assignedPlayers.length > 0 ? assignedPlayers : [
    // Fallback if no players assigned yet
    { id: "1", name: "Default Player", persona: PERSONAS.CISO, assigned: true },
  ];

  const handleEnterGame = () => {
    const player = availablePlayers.find(p => p.id === selectedPlayer);
    if (player) {
      console.log("Entering game as:", player);
      onEnterGame?.(player.name, player.persona);
    }
  };

  const getPersonaDescription = (persona: string) => {
    const descriptions: Record<string, string> = {
      [PERSONAS.CISO]: "Strategic security oversight and risk management",
      [PERSONAS.SOC_LEAD]: "Security operations coordination and incident response",
      [PERSONAS.SOC_ANALYST]: "Threat detection and technical analysis",
      [PERSONAS.IT_HEAD]: "Infrastructure management and system recovery",
      [PERSONAS.PR_HEAD]: "Communication strategy and public relations",
      [PERSONAS.CEO]: "Executive decisions and business continuity",
      [PERSONAS.LEGAL_HEAD]: "Compliance, legal implications and regulatory response",
    };
    return descriptions[persona] || "Specialized role in cybersecurity response";
  };

  return (
    <div 
      className="min-h-screen p-6 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="min-h-screen bg-background/95 backdrop-blur-sm p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="w-10 h-10 text-primary animate-pulse" />
              <h1 className="text-4xl font-mono text-primary">[CYBER_WAR_SIM]</h1>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-mono text-foreground">SELECT YOUR IDENTITY</h2>
              <p className="text-muted-foreground font-mono text-sm">
                // AI-Related Data Breach Scenario - 45 Minutes Active Simulation
              </p>
            </div>
          </div>

          {/* Player Selection */}
          <Card data-testid="card-player-selection" className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-mono">
                <Terminal className="w-5 h-5 text-primary" />
                ASSIGNED_PERSONAS.exe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availablePlayers.map((player) => (
                  <div
                    key={player.id}
                    data-testid={`persona-card-${player.id}`}
                    className={`p-6 border-2 rounded-lg cursor-pointer transition-all hover-elevate ${
                      selectedPlayer === player.id
                        ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => {
                      setSelectedPlayer(player.id);
                      console.log("Selected player:", player);
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        <h3 className="font-mono font-semibold">{player.name}</h3>
                      </div>
                      <Badge 
                        variant={selectedPlayer === player.id ? "default" : "secondary"}
                        className="font-mono text-xs"
                      >
                        {player.persona.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {getPersonaDescription(player.persona)}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-primary">
                        STATUS: READY
                      </span>
                      {selectedPlayer === player.id && (
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Game Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card data-testid="card-scenario-info" className="border-destructive/20">
              <CardContent className="p-4">
                <h3 className="font-mono text-sm font-semibold text-destructive mb-2">
                  THREAT_LEVEL
                </h3>
                <p className="text-xs text-muted-foreground">
                  Advanced AI-powered attack targeting enterprise infrastructure
                </p>
              </CardContent>
            </Card>
            <Card data-testid="card-duration-info" className="border-yellow-500/20">
              <CardContent className="p-4">
                <h3 className="font-mono text-sm font-semibold text-yellow-500 mb-2">
                  SIMULATION_TIME
                </h3>
                <p className="text-xs text-muted-foreground">
                  45 minutes active + 10 minutes debrief session
                </p>
              </CardContent>
            </Card>
            <Card data-testid="card-objective-info" className="border-primary/20">
              <CardContent className="p-4">
                <h3 className="font-mono text-sm font-semibold text-primary mb-2">
                  OBJECTIVE
                </h3>
                <p className="text-xs text-muted-foreground">
                  Coordinate response, minimize damage, learn prevention
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Enter Button */}
          <div className="text-center">
            <Button
              data-testid="button-enter-game"
              onClick={handleEnterGame}
              disabled={!selectedPlayer}
              size="lg"
              className="px-12 py-4 text-lg font-mono bg-primary hover:bg-primary/90"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              [ENTER_SIMULATION]
            </Button>
            {!selectedPlayer && (
              <p className="text-sm text-muted-foreground mt-2 font-mono">
                // SELECT A PERSONA TO CONTINUE
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}