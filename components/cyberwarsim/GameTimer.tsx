"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Clock } from "lucide-react";

interface GameTimerProps {
  duration: number;
  phase: string;
  onPhaseComplete?: () => void;
}

export default function GameTimer({ duration, phase, onPhaseComplete }: GameTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(interval);
          onPhaseComplete?.();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [duration]);

  const format = (s: number) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-mono flex items-center gap-2"><Clock className="w-4 h-4" /> SESSION TIMER</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <div className="text-2xl font-mono font-semibold">{format(timeLeft)}</div>
          <div className="text-sm text-muted-foreground">{phase.toUpperCase()}</div>
        </div>
      </CardContent>
    </Card>
  );
}
