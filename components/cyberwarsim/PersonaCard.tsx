"use client";

import React from "react";
import { Card, CardContent } from "../ui/card";
import { Shield, Users, Search, Server, Megaphone, Building, Scale } from "lucide-react";

interface PersonaCardProps {
  name: string;
  persona: string;
  isOnline?: boolean;
  currentRoom?: string;
  score?: number;
  decisionsCount?: number;
}

export default function PersonaCard({
  name,
  persona,
  isOnline = false,
  currentRoom = "lobby",
  score = 0,
  decisionsCount = 0
}: PersonaCardProps) {
  const getPersonaIcon = (persona: string) => {
    const icons: Record<string, any> = {
      "CISO": Shield,
      "SOC_LEAD": Users,
      "SOC_ANALYST": Search,
      "IT_HEAD": Server,
      "PR_HEAD": Megaphone,
      "CEO": Building,
      "LEGAL_HEAD": Scale,
    };
    return icons[persona] || Shield;
  };

  const getPersonaColor = (persona: string) => {
    const colors: Record<string, string> = {
      "CISO": "text-blue-400",
      "SOC_LEAD": "text-green-400",
      "SOC_ANALYST": "text-cyan-400",
      "IT_HEAD": "text-purple-400",
      "PR_HEAD": "text-yellow-400",
      "CEO": "text-red-400",
      "LEGAL_HEAD": "text-orange-400",
    };
    return colors[persona] || "text-primary";
  };

  const getPersonaDescription = (persona: string) => {
    const descriptions: Record<string, string> = {
      "CISO": "Strategic security oversight",
      "SOC_LEAD": "Operations coordination",
      "SOC_ANALYST": "Threat analysis",
      "IT_HEAD": "Infrastructure response",
      "PR_HEAD": "Communications strategy",
      "CEO": "Executive decisions",
      "LEGAL_HEAD": "Compliance oversight",
    };
    return descriptions[persona] || "Cybersecurity role";
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const IconComponent = getPersonaIcon(persona);

  return (
    <Card 
      data-testid={`persona-card-${persona.toLowerCase()}`}
      className={`hover-elevate transition-all ${isOnline ? 'border-primary/40 bg-primary/5' : 'border-muted'}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full border-2 border-background flex items-center justify-center bg-card text-sm font-mono">
              {getInitials(name)}
            </div>
            <div 
              className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                isOnline ? 'bg-green-500' : 'bg-muted'
              }`}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <IconComponent className={`w-4 h-4 ${getPersonaColor(persona)}`} />
              <h3 className="font-mono font-semibold text-sm truncate">{name}</h3>
            </div>
            
            <div className="space-y-1">
              <span className="text-xs font-mono border px-2 py-1 rounded">{persona.replace('_', ' ')}</span>
              <p className="text-xs text-muted-foreground">
                {getPersonaDescription(persona)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="font-mono text-foreground">{score}</div>
              <div className="text-muted-foreground">Points</div>
            </div>
            <div className="text-center">
              <div className="font-mono text-foreground">{decisionsCount}</div>
              <div className="text-muted-foreground">Decisions</div>
            </div>
            <div className="text-center">
              <div className={`font-mono text-xs ${isOnline ? 'text-green-500' : 'text-muted-foreground'}`}>
                {isOnline ? 'ONLINE' : 'OFFLINE'}
              </div>
              <div className="text-muted-foreground text-xs truncate">
                {currentRoom.replace('_', ' ')}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
