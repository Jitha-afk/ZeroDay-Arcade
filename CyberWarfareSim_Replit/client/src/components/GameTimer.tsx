import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle } from "lucide-react";

interface GameTimerProps {
  duration: number; // in seconds
  phase: "simulation" | "debrief" | "completed";
  onPhaseComplete?: () => void;
}

export default function GameTimer({ duration, phase, onPhaseComplete }: GameTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) {
      if (timeLeft <= 0) {
        onPhaseComplete?.();
      }
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onPhaseComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    return ((duration - timeLeft) / duration) * 100;
  };

  const isLowTime = timeLeft <= 300; // 5 minutes
  const isCriticalTime = timeLeft <= 60; // 1 minute

  return (
    <Card data-testid="card-game-timer" className={`border ${isCriticalTime ? 'border-destructive' : isLowTime ? 'border-yellow-500' : 'border-primary'}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${isCriticalTime ? 'text-destructive animate-pulse' : 'text-primary'}`} />
            <span className="font-mono text-sm font-semibold">
              {phase === "simulation" ? "SIMULATION" : phase === "debrief" ? "DEBRIEF" : "COMPLETED"}
            </span>
          </div>
          <Badge 
            variant={isCriticalTime ? "destructive" : isLowTime ? "secondary" : "default"}
            className="font-mono"
          >
            {formatTime(timeLeft)}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${
                isCriticalTime ? 'bg-destructive' : isLowTime ? 'bg-yellow-500' : 'bg-primary'
              }`}
              style={{ width: `${getProgress()}%` }}
            />
          </div>
          
          {isLowTime && (
            <div className="flex items-center gap-1 text-xs">
              <AlertTriangle className="w-3 h-3 text-yellow-500" />
              <span className="text-muted-foreground font-mono">
                {isCriticalTime ? "CRITICAL TIME REMAINING" : "LOW TIME WARNING"}
              </span>
            </div>
          )}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-muted-foreground">Phase:</span>
            <div className="font-mono text-foreground">
              {phase === "simulation" ? "Active Breach Response" : 
               phase === "debrief" ? "Post-Incident Analysis" : "Session Complete"}
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Progress:</span>
            <div className="font-mono text-foreground">{Math.round(getProgress())}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}