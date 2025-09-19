"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";

interface TimelineEventProps {
  id: string;
  title: string;
  description: string;
  eventType: string;
  severity: string;
  alertType?: string | null;
  emoji?: string | null;
  scheduledTime: number;
  isTriggered?: boolean;
  targetPersonas?: string[];
  isVisible?: boolean;
  onDecision?: (eventId: string, decision: string, reasoning: string) => void;
  options?: Array<{ id: string; label: string; description?: string; path?: string }>;
  resolution?: { decision: string; decisionLabel?: string; reasoning: string } | null;
  allowDecision?: boolean;
  nextInSeconds?: number; // countdown until next event appears
  nextDelayTotal?: number; // total seconds for the delay (for progress bar calc)
  onAcknowledge?: () => void; // skip countdown
}

export default function TimelineEvent({
  id,
  title,
  description,
  eventType,
  severity,
  alertType = null,
  emoji = null,
  scheduledTime,
  isTriggered = false,
  targetPersonas = [],
  isVisible = true,
  onDecision,
  options = [],
  resolution = null,
  allowDecision = true,
  nextInSeconds,
  nextDelayTotal = 20,
  onAcknowledge
}: TimelineEventProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [reasoning, setReasoning] = useState<string>("");
  const [touched, setTouched] = useState<boolean>(false);

  const submitDecision = () => {
    if (!selectedOption || !allowDecision) return;
    const reason = reasoning.trim() || "No reasoning provided";
    onDecision?.(id, selectedOption, reason);
  };

  // Provide quick access to the currently selected option's metadata (e.g., description)
  const activeOption = options.find(o => o.id === selectedOption) || null;

  if (!isVisible) return null;

  return (
    <div className={`p-4 border rounded ${isTriggered ? 'bg-card' : 'bg-muted/10'} relative`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          {emoji ? <div className="text-2xl leading-none">{emoji}</div> : null}
          <h4 className="font-mono font-semibold">{title}</h4>
        </div>
        <div className="flex items-center gap-2">
          {alertType ? <span className="text-xs font-mono text-foreground px-2 py-1 border rounded">{alertType}</span> : null}
          <span className="text-xs text-muted-foreground">{severity.toUpperCase()}</span>
        </div>
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
          <div className="text-sm font-mono font-semibold">
            Decision Taken: <span className="font-normal">{resolution.decisionLabel || resolution.decision}</span>
          </div>
            <div className="text-xs text-muted-foreground mt-1 whitespace-pre-line">{resolution.reasoning}</div>
        </div>
      ) : null}

      {eventType === 'decision_point' && !resolution && allowDecision && (
        <div className="space-y-3 mt-2">
          <div className="flex gap-2 flex-wrap">
            {options.length > 0 ? (
              options.map(opt => {
                const active = selectedOption === opt.id;
                return (
                  <Button
                    key={opt.id}
                    size="sm"
                    variant={active ? 'default' : 'outline'}
                    onClick={() => allowDecision && setSelectedOption(opt.id)}
                    title={opt.description || opt.label}
                    disabled={!allowDecision}
                  >
                    {opt.label}
                  </Button>
                );
              })
            ) : (
              [
                { id: 'A', label: 'Option A' },
                { id: 'B', label: 'Option B' },
                { id: 'C', label: 'Defer', outline: true }
              ].map(opt => {
                const active = selectedOption === opt.id;
                return (
                  <Button
                    key={opt.id}
                    size="sm"
                    variant={active ? 'default' : (opt.outline ? 'outline' : 'secondary')}
                    onClick={() => allowDecision && setSelectedOption(opt.id)}
                    disabled={!allowDecision}
                  >
                    {opt.label}
                  </Button>
                );
              })
            )}
          </div>
          {allowDecision && (
            <div className="space-y-2">
              {activeOption?.description && (
                <div className="p-2 border rounded bg-muted/10 text-xs font-mono text-muted-foreground">
                  {activeOption.description}
                </div>
              )}
              <textarea
                className="w-full text-sm p-2 border rounded bg-background resize-y min-h-[70px] font-mono"
                placeholder="Enter reasoning / analysis before submitting..."
                value={reasoning}
                onChange={e => { setReasoning(e.target.value); if (!touched) setTouched(true); }}
                disabled={!allowDecision}
              />
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground font-mono">
                  {selectedOption ? 'Ready to submit' : 'Select an option to enable submit'}
                </div>
                <Button size="sm" onClick={submitDecision} disabled={!selectedOption || !allowDecision}>Submit Decision</Button>
              </div>
            </div>
          )}
        </div>
      )}
      {eventType === 'decision_point' && !resolution && !allowDecision && (
        <div className="mt-2 text-xs text-muted-foreground font-mono italic">Decision pending another role...</div>
      )}
      {/* Countdown indicator for next event */}
      {typeof nextInSeconds === 'number' && nextInSeconds > 0 && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span className="font-mono">NEXT_EVENT_IN</span>
            <div className="flex items-center gap-2">
              <span className="font-mono">{nextInSeconds}s</span>
              {onAcknowledge && (
                <Button size="sm" variant="outline" className="h-6 px-2 text-xs" onClick={onAcknowledge}>Acknowledge</Button>
              )}
            </div>
          </div>
          <div className="h-1 w-full bg-muted/30 rounded overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-1000"
              style={{ width: `${(1 - nextInSeconds / nextDelayTotal) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
