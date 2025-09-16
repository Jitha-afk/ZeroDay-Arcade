import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Info, AlertCircle, Zap, Clock, User } from "lucide-react";

interface TimelineEventProps {
  id: string;
  title: string;
  description: string;
  eventType: "alert" | "notification" | "decision_point" | "info";
  severity: "low" | "medium" | "high" | "critical";
  targetPersonas: string[];
  scheduledTime: number; // seconds from game start
  isTriggered?: boolean;
  isVisible?: boolean;
  onDecision?: (eventId: string, decision: string, reasoning: string) => void;
}

export default function TimelineEvent({
  id,
  title,
  description,
  eventType,
  severity,
  targetPersonas,
  scheduledTime,
  isTriggered = false,
  isVisible = true,
  onDecision
}: TimelineEventProps) {
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState("");
  const [reasoning, setReasoning] = useState("");

  if (!isVisible) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getEventIcon = () => {
    switch (eventType) {
      case "alert":
        return <AlertTriangle className="w-5 h-5" />;
      case "decision_point":
        return <AlertCircle className="w-5 h-5" />;
      case "notification":
        return <Zap className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getSeverityColor = () => {
    switch (severity) {
      case "critical":
        return "destructive";
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "outline";
    }
  };

  const getEventTypeColor = () => {
    switch (eventType) {
      case "alert":
        return "text-destructive";
      case "decision_point":
        return "text-yellow-500";
      case "notification":
        return "text-primary";
      default:
        return "text-muted-foreground";
    }
  };

  const handleDecisionSubmit = () => {
    if (selectedDecision && reasoning.trim()) {
      onDecision?.(id, selectedDecision, reasoning);
      setShowDecisionModal(false);
      console.log("Decision submitted:", { eventId: id, decision: selectedDecision, reasoning });
    }
  };

  const getDecisionOptions = () => {
    // Mock decision options based on event type - todo: remove mock functionality
    switch (eventType) {
      case "decision_point":
        return [
          "Immediately isolate affected systems",
          "Gather more information before acting",
          "Escalate to senior management",
          "Implement emergency protocols",
          "Contact external security experts"
        ];
      default:
        return ["Acknowledge", "Investigate", "Monitor"];
    }
  };

  return (
    <>
      <Card 
        data-testid={`timeline-event-${id}`}
        className={`border-l-4 transition-all ${
          isTriggered 
            ? `border-l-primary shadow-lg shadow-primary/20 ${severity === 'critical' ? 'animate-pulse' : ''}` 
            : 'border-l-muted opacity-60'
        }`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <span className={getEventTypeColor()}>
                {getEventIcon()}
              </span>
              {title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={getSeverityColor()} className="text-xs font-mono">
                {severity.toUpperCase()}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span className="font-mono">{formatTime(scheduledTime)}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-sm text-foreground">{description}</p>
          
          {targetPersonas.length > 0 && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Target:</span>
              <div className="flex gap-1 flex-wrap">
                {targetPersonas.map((persona) => (
                  <Badge key={persona} variant="outline" className="text-xs">
                    {persona.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {isTriggered && eventType === "decision_point" && (
            <div className="pt-2 border-t">
              <Button
                data-testid={`button-make-decision-${id}`}
                onClick={() => setShowDecisionModal(true)}
                className="w-full font-mono"
                variant="default"
              >
                [MAKE_DECISION]
              </Button>
            </div>
          )}

          {isTriggered && eventType !== "decision_point" && (
            <div className="pt-2 border-t">
              <Button
                data-testid={`button-acknowledge-${id}`}
                onClick={() => {
                  console.log("Event acknowledged:", id);
                  onDecision?.(id, "acknowledged", "Event acknowledged by user");
                }}
                variant="outline"
                size="sm"
                className="font-mono"
              >
                [ACKNOWLEDGE]
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Decision Modal */}
      {showDecisionModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl border-primary">
            <CardHeader>
              <CardTitle className="font-mono text-primary">DECISION_REQUIRED.exe</CardTitle>
              <p className="text-sm text-muted-foreground">{title}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Select your response:</label>
                <div className="space-y-2">
                  {getDecisionOptions().map((option, index) => (
                    <label key={index} className="flex items-start gap-2 cursor-pointer p-2 hover:bg-muted/50 rounded">
                      <input
                        type="radio"
                        name="decision"
                        value={option}
                        checked={selectedDecision === option}
                        onChange={(e) => setSelectedDecision(e.target.value)}
                        className="mt-1"
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Reasoning:</label>
                <textarea
                  data-testid="textarea-reasoning"
                  value={reasoning}
                  onChange={(e) => setReasoning(e.target.value)}
                  placeholder="Explain your decision reasoning..."
                  className="w-full p-3 border rounded-md bg-background min-h-[100px] text-sm"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  data-testid="button-cancel-decision"
                  variant="outline"
                  onClick={() => setShowDecisionModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  data-testid="button-submit-decision"
                  onClick={handleDecisionSubmit}
                  disabled={!selectedDecision || !reasoning.trim()}
                  className="font-mono"
                >
                  [SUBMIT_DECISION]
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}