import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PERSONAS } from "@shared/schema";
import { Shield, Users, Play, Settings } from "lucide-react";
import backgroundImage from "@assets/generated_images/Cyber_command_center_background_88f7c95c.png";

interface PlayerAssignment {
  id: string;
  name: string;
  persona: string;
  assigned: boolean;
}

interface AdminDashboardProps {
  onStartGame?: (players: PlayerAssignment[], sessionName: string) => void;
  initialPlayers?: PlayerAssignment[];
  initialSessionName?: string;
}

export default function AdminDashboard({ onStartGame, initialPlayers = [], initialSessionName = "AI Breach Response Training" }: AdminDashboardProps) {
  const [sessionName, setSessionName] = useState(initialSessionName);
  const [players, setPlayers] = useState<PlayerAssignment[]>(initialPlayers.length > 0 ? initialPlayers : [
    // Default starter players if none provided
    { id: "1", name: "Alex Chen", persona: PERSONAS.CISO, assigned: false },
    { id: "2", name: "Maria Santos", persona: PERSONAS.SOC_LEAD, assigned: false },
  ]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [selectedPersona, setSelectedPersona] = useState<string>(PERSONAS.SOC_ANALYST);

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      const newPlayer: PlayerAssignment = {
        id: Date.now().toString(),
        name: newPlayerName.trim(),
        persona: selectedPersona,
        assigned: false,
      };
      setPlayers([...players, newPlayer]);
      setNewPlayerName("");
      console.log("Player added:", newPlayer);
    }
  };

  const toggleAssignment = (playerId: string) => {
    setPlayers(players.map(player => 
      player.id === playerId 
        ? { ...player, assigned: !player.assigned }
        : player
    ));
    console.log("Player assignment toggled:", playerId);
  };

  const removePlayer = (playerId: string) => {
    setPlayers(players.filter(player => player.id !== playerId));
    console.log("Player removed:", playerId);
  };

  const assignedCount = players.filter(p => p.assigned).length;

  return (
    <div 
      className="min-h-screen p-6 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="min-h-screen bg-background/90 backdrop-blur-sm p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-mono text-primary">[CYBER_WAR_SIM]</h1>
            </div>
            <p className="text-muted-foreground font-mono">Admin Control Panel - Configure Game Session</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Session Configuration */}
            <Card data-testid="card-session-config">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Session Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Session Name</label>
                  <Input
                    data-testid="input-session-name"
                    value={sessionName}
                    onChange={(e) => setSessionName(e.target.value)}
                    className="font-mono"
                    placeholder="Enter simulation scenario name"
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Duration:</span>
                  <Badge variant="outline">45 min + 10 min debrief</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Scenario:</span>
                  <Badge variant="destructive">AI-Related Data Breach</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Player Assignment */}
            <Card data-testid="card-player-assignment">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Player Assignment ({assignedCount}/7)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    data-testid="input-player-name"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    placeholder="Player name"
                    className="flex-1"
                    onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
                  />
                  <select
                    data-testid="select-persona"
                    value={selectedPersona}
                    onChange={(e) => setSelectedPersona(e.target.value)}
                    className="px-3 py-2 border rounded-md bg-background"
                  >
                    {Object.values(PERSONAS).map(persona => (
                      <option key={persona} value={persona}>{persona.replace('_', ' ')}</option>
                    ))}
                  </select>
                  <Button data-testid="button-add-player" onClick={addPlayer} size="sm">
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Player List */}
          <Card data-testid="card-player-list">
            <CardHeader>
              <CardTitle>Assigned Players</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className={`p-4 border rounded-lg hover-elevate ${
                      player.assigned ? 'bg-card border-primary/20' : 'bg-muted/20 border-muted'
                    }`}
                    data-testid={`player-card-${player.id}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-mono font-medium">{player.name}</h4>
                      <Badge 
                        variant={player.assigned ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {player.persona.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        data-testid={`button-toggle-${player.id}`}
                        variant={player.assigned ? "destructive" : "default"}
                        size="sm"
                        onClick={() => toggleAssignment(player.id)}
                        className="flex-1"
                      >
                        {player.assigned ? "Unassign" : "Assign"}
                      </Button>
                      <Button
                        data-testid={`button-remove-${player.id}`}
                        variant="outline"
                        size="sm"
                        onClick={() => removePlayer(player.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Start Game */}
          <div className="text-center">
            <Button
              data-testid="button-start-game"
              onClick={() => {
                console.log("Starting game session:", sessionName, "with players:", players);
                onStartGame?.(players, sessionName);
              }}
              size="lg"
              className="px-8 py-3 text-lg font-mono"
              disabled={assignedCount < 3}
            >
              <Play className="w-5 h-5 mr-2" />
              [INITIALIZE_SIMULATION]
            </Button>
            {assignedCount < 3 && (
              <p className="text-sm text-muted-foreground mt-2">
                Minimum 3 players required to start simulation
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}