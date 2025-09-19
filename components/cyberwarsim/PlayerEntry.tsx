"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { PERSONAS } from "./personas";
import { Shield, User, ArrowRight, Terminal } from "lucide-react";

const backgroundImage = '/image.png';

interface PlayerAssignment {
  id: string;
  name: string;
  persona: string;
  assigned: boolean;
}

interface PlayerEntryProps {
  onEnterGame?: (playerName: string, persona: string) => void;
  assignedPlayers?: Array<{ id: string; name: string; persona: string; assigned: boolean }>;
}

export default function PlayerEntry({ onEnterGame, assignedPlayers = [] }: PlayerEntryProps) {
  const router = useRouter();
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [availablePlayers, setAvailablePlayers] = useState<PlayerAssignment[]>(assignedPlayers || []);

  useEffect(() => {
    // Load session from sessionStorage
    try {
      const raw = sessionStorage.getItem('cyberwarsim_session');
      if (raw) {
        const parsed = JSON.parse(raw) as { sessionName: string; players: PlayerAssignment[] };
        // only include assigned players
        const assigned = (parsed.players || []).filter(p => p.assigned);
        setAvailablePlayers(assigned.length > 0 ? assigned : []);
      }
    } catch (e) {
      console.error('Failed to read session storage', e);
    }
  }, []);

  const handleEnterGame = () => {
    const player = availablePlayers.find(p => p.id === selectedPlayer);
    if (player) {
      try {
        sessionStorage.setItem('cyberwarsim_current_player', JSON.stringify(player));
      } catch (e) {
        console.error('Failed to persist current player', e);
      }
      onEnterGame?.(player.name, player.persona);
      router.push('/cyberwarsim/game');
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

          <Card data-testid="card-player-selection" className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-mono">
                <Terminal className="w-5 h-5 text-primary" />
                ASSIGNED_PERSONAS.exe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availablePlayers.length === 0 && (
                  <div className="p-6 text-center text-muted-foreground">No assigned players found. Ask an admin to initialize a session.</div>
                )}

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
                      <span className={`text-xs px-2 py-1 rounded ${selectedPlayer === player.id ? 'bg-slate-100' : 'bg-gray-100'}`}>
                        {player.persona.replace('_', ' ')}
                      </span>
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
