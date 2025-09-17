"use client";

import React from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

interface TimelineEventProps {
  id: string;
  title: string;
  description: string;
  eventType: string; // 'alert' | 'decision_point' | 'ending'
  endingType?: string; // optional ending classification (good_ending, bad_ending, etc.)
  severity: string;
  scheduledTime: number;
  isTriggered?: boolean;
  targetPersonas?: string[];
  isVisible?: boolean;
  onDecision?: (eventId: string, decision: string, reasoning: string, path?: string) => void;
  options?: Array<{ id: string; label: string; description?: string; path?: string }>;
  resolution?: { decision: string; reasoning: string } | null;
  allowDecision?: boolean;
}

export default function TimelineEvent({
  id,
  title,
  description,
  eventType,
  endingType,
  severity,
  scheduledTime,
  isTriggered = false,
  targetPersonas = [],
  isVisible = true,
  onDecision,
  options = [],
  resolution = null,
  allowDecision = true
}: TimelineEventProps) {
  const [showReasoning, setShowReasoning] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState<{ id: string; label: string; description?: string; path?: string } | null>(null);
  const [reasoning, setReasoning] = React.useState("");

  const beginDecision = (opt: { id: string; label: string; description?: string; path?: string }) => {
    setSelectedOption(opt);
    setReasoning("");
    setShowReasoning(true);
  };

  const cancelDecision = () => {
    setSelectedOption(null);
    setReasoning("");
    setShowReasoning(false);
  };

  const confirmDecision = () => {
    if (!selectedOption) return;
    const rationale = reasoning.trim();
    if (!rationale) return; // guard
    onDecision?.(id, selectedOption.id, rationale, selectedOption.path);
    setShowReasoning(false);
  };

  if (!isVisible) return null;

  const endingStyles: Record<string, string> = {
    good_ending: 'bg-green-600/10 border-green-600 text-green-700 dark:text-green-400 shadow-[0_0_0_1px_rgba(16,185,129,0.4)]',
    bad_ending: 'bg-red-600/10 border-red-600 text-red-700 dark:text-red-400 shadow-[0_0_0_1px_rgba(220,38,38,0.4)]',
    moderate_ending: 'bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-400',
    high_impact_ending: 'bg-fuchsia-600/10 border-fuchsia-600 text-fuchsia-700 dark:text-fuchsia-400'
  };
  const baseCls = 'p-4 border rounded relative transition-colors';
  const containerCls = eventType === 'ending'
    ? `${baseCls} ${endingStyles[endingType || ''] || 'bg-slate-500/10 border-slate-500 text-slate-700 dark:text-slate-300'} animate-pulse`
    : `${baseCls} ${isTriggered ? 'bg-card' : 'bg-muted/10'}`;

  return (
    <div className={containerCls} data-ending={eventType === 'ending' ? (endingType || 'true') : undefined}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-mono font-semibold flex items-center gap-2">
          {eventType === 'ending' && (
            <span className="text-[10px] leading-none tracking-wide px-2 py-1 rounded bg-black/10 dark:bg-white/10 font-bold uppercase">
              {(endingType || 'Ending').replace(/_/g,' ')}
            </span>
          )}
          {title}
        </h4>
        <span className="text-xs text-muted-foreground">{eventType === 'ending' ? 'FINAL' : severity.toUpperCase()}</span>
      </div>
      <p className="text-sm text-muted-foreground mb-3">{description}</p>

      {targetPersonas.length > 0 && (
        <div className="mb-3 text-xs flex gap-2 flex-wrap">
          <strong className="mr-2">Intended:</strong>
          {targetPersonas.map(persona => (
            <span key={persona} className="px-2 py-1 border rounded">{persona.replace('_', ' ')}</span>
          ))}
        </div>
      )}

      {resolution ? (
        <div className="mb-3 p-3 bg-muted/10 rounded border">
          <div className="text-sm font-mono font-semibold">Decision Taken: <span className="font-normal">{resolution.decision}</span></div>
          <div className="text-xs text-muted-foreground mt-1">{resolution.reasoning}</div>
        </div>
      ) : null}

      {eventType === 'decision_point' && !resolution && (
        <div className="space-y-3">
          {!showReasoning && (
            <div className="flex gap-2 flex-wrap">
              {options.length > 0 ? (
                options.map(opt => (
                  <Button key={opt.id} size="sm" onClick={() => beginDecision(opt)} disabled={!allowDecision}>{opt.label}</Button>
                ))
              ) : (
                <>
                  <Button size="sm" onClick={() => beginDecision({ id: 'A', label: 'Option A' })} disabled={!allowDecision}>Option A</Button>
                  <Button size="sm" onClick={() => beginDecision({ id: 'B', label: 'Option B' })} disabled={!allowDecision}>Option B</Button>
                  <Button size="sm" variant="outline" onClick={() => beginDecision({ id: 'C', label: 'Defer' })} disabled={!allowDecision}>Defer</Button>
                </>
              )}
            </div>
          )}
          {showReasoning && selectedOption && (
            <Card className="border-dashed">
              <CardContent className="pt-4 space-y-3">
                <div className="text-xs text-muted-foreground font-mono">Provide reasoning for selecting: <span className="font-semibold text-foreground">{selectedOption.label}</span></div>
                <textarea
                  className="w-full h-24 text-sm p-2 rounded border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="Explain your rationale, considerations, trade-offs..."
                  value={reasoning}
                  onChange={(e) => setReasoning(e.target.value)}
                  disabled={!allowDecision}
                />
                <div className="flex gap-2 justify-end">
                  <Button size="sm" variant="outline" onClick={cancelDecision}>Cancel</Button>
                  <Button size="sm" onClick={confirmDecision} disabled={!allowDecision || reasoning.trim().length < 3}>Confirm Decision</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
      {eventType === 'ending' && (
        <div className="mt-4 text-xs font-mono opacity-70">Scenario branch resolved.</div>
      )}
    </div>
  );
}
