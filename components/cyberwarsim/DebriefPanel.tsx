"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Award, TrendingUp, Clock, Shield, CheckCircle } from "lucide-react";

interface DebriefPanelProps {
  sessionData: {
    name: string;
    duration: number;
    totalEvents: number;
    completedEvents: number;
  };
  playerStats: {
    name: string;
    persona: string;
    score: number;
    decisions: number;
    responseTime: number;
    correctDecisions: number;
  };
  teamStats: Array<{ name: string; persona: string; score: number; decisions: number; responseTime: number }>;
  microsoftRecommendations: Array<{ solution: string; description: string; preventionScore: number }>;
  onRestartSession?: () => void;
  onExitGame?: () => void;
}

export default function DebriefPanel({
  sessionData,
  playerStats,
  teamStats,
  microsoftRecommendations,
  onRestartSession,
  onExitGame
}: DebriefPanelProps) {
  const teamAverage = Math.round(teamStats.reduce((sum, player) => sum + player.score, 0) / teamStats.length);
  const playerRank = teamStats.sort((a, b) => b.score - a.score).findIndex(p => p.name === playerStats.name) + 1;
  const completionRate = Math.round((sessionData.completedEvents / sessionData.totalEvents) * 100);
  const accuracyRate = Math.round((playerStats.correctDecisions / playerStats.decisions) * 100);

  const getPerformanceLevel = (score: number) => {
    if (score >= 90) return { level: "EXCELLENT", color: "text-green-500", bgColor: "bg-green-500/10" };
    if (score >= 75) return { level: "GOOD", color: "text-blue-500", bgColor: "bg-blue-500/10" };
    if (score >= 60) return { level: "ADEQUATE", color: "text-yellow-500", bgColor: "bg-yellow-500/10" };
    return { level: "NEEDS_IMPROVEMENT", color: "text-destructive", bgColor: "bg-destructive/10" };
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const performance = getPerformanceLevel(playerStats.score);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-mono text-primary">[DEBRIEF_COMPLETE]</h1>
          </div>
          <h2 className="text-xl font-mono text-foreground">{sessionData.name}</h2>
          <p className="text-muted-foreground">Session Analysis & Microsoft Security Solutions Recommendations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className={`border ${performance.color.replace('text-', 'border-')}`}>
            <CardContent className="p-6 text-center">
              <Award className={`w-8 h-8 mx-auto mb-2 ${performance.color}`} />
              <div className="text-2xl font-mono font-bold">{playerStats.score}</div>
              <div className="text-sm text-muted-foreground">Total Score</div>
              <span className={`mt-2 ${performance.bgColor} ${performance.color} border-transparent px-2 py-1 rounded inline-block`}>{performance.level}</span>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-mono font-bold">#{playerRank}</div>
              <div className="text-sm text-muted-foreground">Team Rank</div>
              <div className="text-xs text-muted-foreground mt-1">out of {teamStats.length} players</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <div className="text-2xl font-mono font-bold">{formatDuration(playerStats.responseTime)}</div>
              <div className="text-sm text-muted-foreground">Avg Response</div>
              <div className="text-xs text-muted-foreground mt-1">{playerStats.decisions} decisions made</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-mono font-bold">{accuracyRate}%</div>
              <div className="text-sm text-muted-foreground">Accuracy Rate</div>
              <div className="text-xs text-muted-foreground mt-1">{playerStats.correctDecisions}/{playerStats.decisions} correct</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-mono">TEAM_PERFORMANCE</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">Team Average:</span>
                <span className="px-2 py-1 border rounded">{teamAverage} points</span>
              </div>
              <div className="space-y-3">
                {teamStats.map((player, index) => (
                  <div key={player.name} className={`flex items-center justify-between p-3 rounded-lg border ${player.name === playerStats.name ? 'border-primary bg-primary/5' : 'border-border'}`}>
                    <div className="flex items-center gap-3">
                      <div className="text-lg font-mono">#{index + 1}</div>
                      <div>
                        <div className="font-medium">{player.name}</div>
                        <div className="text-sm text-muted-foreground">{player.persona.replace('_', ' ')}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-semibold">{player.score}</div>
                      <div className="text-xs text-muted-foreground">{formatDuration(player.responseTime)} avg</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-mono text-blue-500">MICROSOFT_SOLUTIONS</CardTitle>
              <p className="text-sm text-muted-foreground">How Microsoft security products could have prevented this breach</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {microsoftRecommendations.map((rec, index) => (
                <div key={index} className="p-4 border rounded-lg bg-blue-500/5 border-blue-500/20">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-blue-600">{rec.solution}</h4>
                    <span className="px-2 py-1 border rounded text-blue-600">{rec.preventionScore}% prevention</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                  <div className="mt-2 h-2 bg-slate-200 rounded">
                    <div style={{ width: `${rec.preventionScore}%` }} className="h-2 bg-blue-500 rounded" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono">SESSION_SUMMARY</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-mono font-bold">{formatDuration(sessionData.duration)}</div>
                <div className="text-sm text-muted-foreground">Total Duration</div>
              </div>
              <div>
                <div className="text-2xl font-mono font-bold">{sessionData.totalEvents}</div>
                <div className="text-sm text-muted-foreground">Total Events</div>
              </div>
              <div>
                <div className="text-2xl font-mono font-bold">{completionRate}%</div>
                <div className="text-sm text-muted-foreground">Completion Rate</div>
              </div>
              <div>
                <div className="text-2xl font-mono font-bold">{teamStats.length}</div>
                <div className="text-sm text-muted-foreground">Team Members</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4">
          <Button onClick={() => onRestartSession?.()} size="lg" className="font-mono">[RESTART_SESSION]</Button>
          <Button onClick={() => onExitGame?.()} variant="outline" size="lg" className="font-mono">[EXIT_SIMULATION]</Button>
        </div>
      </div>
    </div>
  );
}
