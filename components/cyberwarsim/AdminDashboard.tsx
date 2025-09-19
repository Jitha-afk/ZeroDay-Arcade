"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { PERSONAS } from "./personas";
import { Shield, Users, Play, Settings } from "lucide-react";
import scenario from '../../Design/scenario.json';

const backgroundImage = '/image.png';

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

export default function AdminDashboard({ onStartGame, initialPlayers = [], initialSessionName = scenario.scenario_name }: AdminDashboardProps) {
  const router = useRouter();
  const [sessionName, setSessionName] = useState(initialSessionName);
  const [players, setPlayers] = useState<PlayerAssignment[]>(initialPlayers.length > 0 ? initialPlayers : []);
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
  };

  const removePlayer = (playerId: string) => {
    setPlayers(players.filter(player => player.id !== playerId));
  };

  const assignedCount = players.filter(p => p.assigned).length;

  const handleStart = () => {
    // save session info (players + sessionName + scenario) to sessionStorage for other pages to consume
    const payload = { sessionName, players, scenarioId: (scenario as any)?.scenario_id, scenario };
    try {
      sessionStorage.setItem('cyberwarsim_session', JSON.stringify(payload));
    } catch (e) {
      console.error('Failed to persist session', e);
    }
    onStartGame?.(players, sessionName);
    router.push('/cyberwarsim/join');
  };

  return (
    <div 
      className="min-h-screen p-6 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="min-h-screen bg-background/90 backdrop-blur-sm p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-mono text-primary">[CYBER_WAR_SIM]</h1>
            </div>
            <p className="text-muted-foreground font-mono">Admin Control Panel - Configure Game Session</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  <input
                    data-testid="input-session-name"
                    value={sessionName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSessionName(e.target.value)}
                    className="font-mono w-full px-3 py-2 border rounded-md bg-background"
                    placeholder="Enter simulation scenario name"
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Duration:</span>
                  <span className="px-2 py-1 border rounded-md text-xs">10 min session + optional debrief</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Scenario:</span>
                  <span className="px-2 py-1 border rounded-md text-xs text-red-600">AI-Related Data Breach</span>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-player-assignment">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Player Assignment ({assignedCount}/7)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <input
                    data-testid="input-player-name"
                    value={newPlayerName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPlayerName(e.target.value)}
                    placeholder="Player name"
                    className="flex-1 px-3 py-2 border rounded-md"
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') addPlayer(); }}
                  />
                  <select
                    data-testid="select-persona"
                    value={selectedPersona}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedPersona(e.target.value)}
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
                      <span className={`text-xs px-2 py-1 rounded ${player.assigned ? 'bg-slate-100' : 'bg-gray-100'}`}>
                        {player.persona.replace('_', ' ')}
                      </span>
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

          <div className="text-center">
            <Button
              data-testid="button-start-game"
              onClick={handleStart}
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
