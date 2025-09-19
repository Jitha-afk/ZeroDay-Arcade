"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { PERSONAS } from "./personas";
import ChatInterface from "./ChatInterface";
import TimelineEvent from "./TimelineEvent";
import PersonaCard from "./PersonaCard";
import GameTimer from "./GameTimer";
import MoneyIndicator from "./MoneyIndicator";
import { Users, Clock, Activity, Award, Shield } from "lucide-react";

const backgroundImage = '/image.png';

interface GameRoomProps {
  currentPlayer?: { name: string; persona: string };
  onLeaveGame?: () => void;
}

export default function GameRoom({ currentPlayer: propPlayer, onLeaveGame }: GameRoomProps) {
  const router = useRouter();
  const [currentRoom, setCurrentRoom] = useState("main");
  const [activeTab, setActiveTab] = useState("timeline");
  const [sessionName, setSessionName] = useState<string | null>(null);
  const [players, setPlayers] = useState<Array<any>>([]);
  const [currentPlayer, setCurrentPlayer] = useState<{ name: string; persona: string } | null>(propPlayer || null);
  const [scenarioEvents, setScenarioEvents] = React.useState<Array<any>>([]);
  interface Resolution { decision: string; decisionLabel?: string; reasoning: string; manual?: boolean }
  const [resolvedEvents, setResolvedEvents] = React.useState<Record<string, Resolution>>({});
  // load persisted resolved events from sessionStorage
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('cyberwarsim_resolved');
      if (raw) setResolvedEvents(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  // listen for storage changes so other tabs/players get updates
  useEffect(() => {
    const onStorage = (ev: StorageEvent) => {
      if (ev.key === 'cyberwarsim_resolved' && ev.newValue) {
        try { setResolvedEvents(JSON.parse(ev.newValue)); } catch (e) {}
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const [displayedEvents, setDisplayedEvents] = React.useState<Array<any>>([]);
  const [processingIndex, setProcessingIndex] = React.useState<number>(0);
  const [waitingEventId, setWaitingEventId] = React.useState<string | null>(null);
  const [isAdvancing, setIsAdvancing] = React.useState<boolean>(false); // controls delay cycle
  const ADVANCE_DELAY_SECONDS = 10; // 10 second delay between non-decision events
  const [nextDelayRemaining, setNextDelayRemaining] = React.useState<number>(0); // seconds until next event
  const [chosenPaths, setChosenPaths] = React.useState<string[]>([]); // record of loaded decision paths
  const scenarioRef = useRef<any>(null); // full scenario data for branching

  // Normalize role strings to internal persona keys (e.g., "SOC Analyst" -> "SOC_ANALYST")
  const normalizeRole = (role: string) => role?.trim().toUpperCase().replace(/[\s-]+/g, '_');

  useEffect(() => {
    if (!propPlayer) {
      try {
        const rawCurrent = sessionStorage.getItem('cyberwarsim_current_player');
        const rawSession = sessionStorage.getItem('cyberwarsim_session');
        if (rawSession) {
          const parsed = JSON.parse(rawSession) as { sessionName: string; players: Array<any>; scenario?: any };
          setSessionName(parsed.sessionName || parsed?.scenario?.scenario_name || null);
          const assigned = (parsed.players || []).filter((p: any) => p.assigned).map((p: any) => ({ name: p.name, persona: p.persona, isOnline: true, currentRoom: 'lobby', score: 0, decisionsCount: 0 }));
          setPlayers(assigned);
          if (parsed.scenario) {
            // Build scenario events from initial_timeline and alerts
            try {
              const events: any[] = [];

              const addFromTimeline = (timeline: any[] = []) => {
                timeline.forEach((ev: any, idx: number) => {
                  events.push({
                    id: `scenario_init_${idx}`,
                    title: ev.event || ev.title || `Event ${idx}`,
                    description: ev.description || ev.message || '',
                    eventType: ev.decision_required ? 'decision_point' : 'alert',
                    severity: ev.severity || 'medium',
                    scheduledTime: parseTimeStringToSeconds(ev.time) || 0,
                    isTriggered: !!ev.automatic || false,
                    options: ev.decision_required?.options?.map((o: any) => ({ id: o.id, label: o.label, description: o.description, path: o.path })) || [],
                    recipientRole: ev.recipient_role || ev.recipientRole || null,
                    decisionRequired: !!ev.decision_required
                  });
                });
              };

              // helper to parse 'T+HH:MM' or 'T+MM:SS' to seconds
              const parseTimeStringToSeconds = (timeStr: string) => {
                try {
                  if (!timeStr || typeof timeStr !== 'string') return 0;
                  const cleaned = timeStr.replace(/^T\+/, '');
                  const parts = cleaned.split(':').map(p => parseInt(p.replace(/^0+/, '') || '0', 10));
                  if (parts.length === 1) return parts[0] * 60;
                  if (parts.length === 2) return parts[0] * 60 + parts[1];
                  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
                } catch (e) { return 0; }
                return 0;
              };

              addFromTimeline(parsed.scenario.initial_timeline || []);

              // Include alerts (which may include decision_required)
              (parsed.scenario.alerts || []).forEach((alert: any, idx: number) => {
                events.push({
                  id: `scenario_alert_${idx}`,
                  title: alert.title || alert.event || `Alert ${idx}`,
                  description: alert.message || alert.description || '',
                  eventType: alert.decision_required ? 'decision_point' : 'alert',
                  severity: alert.severity || 'medium',
                  scheduledTime: parseTimeStringToSeconds(alert.time) || 0,
                  isTriggered: !!alert.automatic || false,
                  options: alert.decision_required?.options?.map((o: any) => ({ id: o.id, label: o.label, description: o.description, path: o.path })) || [],
                  recipientRole: alert.recipient_role || alert.recipientRole || null,
                  decisionRequired: !!alert.decision_required
                });
              });

              // set scenario events sorted by scheduledTime
              events.sort((a, b) => (a.scheduledTime || 0) - (b.scheduledTime || 0));
              setScenarioEvents(events);
              scenarioRef.current = parsed.scenario;
            } catch (e) {
              console.error('Failed to parse scenario initial timeline', e);
            }
          }
        }
        if (rawCurrent) {
          const parsedCurrent = JSON.parse(rawCurrent) as { name: string; persona: string };
          setCurrentPlayer(parsedCurrent);
        }
      } catch (e) {
        console.error('Failed to load session data', e);
      }
    } else {
      // prop provided: use it and still attempt to load full player list
      try {
        const rawSession = sessionStorage.getItem('cyberwarsim_session');
        if (rawSession) {
          const parsed = JSON.parse(rawSession) as { sessionName: string; players: Array<any>; scenario?: any };
          setSessionName(parsed.sessionName || parsed?.scenario?.scenario_name || null);
          const assigned = (parsed.players || []).filter((p: any) => p.assigned).map((p: any) => ({ name: p.name, persona: p.persona, isOnline: true, currentRoom: 'lobby', score: 0, decisionsCount: 0 }));
          setPlayers(assigned);
          if (parsed.scenario) {
            // Build scenario events from initial_timeline and alerts
            try {
              const events: any[] = [];

              const addFromTimeline = (timeline: any[] = []) => {
                timeline.forEach((ev: any, idx: number) => {
                  events.push({
                    id: `scenario_init_${idx}`,
                    title: ev.event || ev.title || `Event ${idx}`,
                    description: ev.description || ev.message || '',
                    eventType: ev.decision_required ? 'decision_point' : 'alert',
                    severity: ev.severity || 'medium',
                    scheduledTime: parseTimeStringToSeconds(ev.time) || 0,
                    isTriggered: !!ev.automatic || false,
                    options: ev.decision_required?.options?.map((o: any) => ({ id: o.id, label: o.label, description: o.description, path: o.path })) || [],
                    recipientRole: ev.recipient_role || ev.recipientRole || null,
                    decisionRequired: !!ev.decision_required
                  });
                });
              };

              // helper to parse 'T+HH:MM' or 'T+MM:SS' to seconds
              const parseTimeStringToSeconds = (timeStr: string) => {
                try {
                  if (!timeStr || typeof timeStr !== 'string') return 0;
                  const cleaned = timeStr.replace(/^T\+/, '');
                  const parts = cleaned.split(':').map(p => parseInt(p.replace(/^0+/, '') || '0', 10));
                  if (parts.length === 1) return parts[0] * 60;
                  if (parts.length === 2) return parts[0] * 60 + parts[1];
                  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
                } catch (e) { return 0; }
                return 0;
              };

              addFromTimeline(parsed.scenario.initial_timeline || []);

              // Include alerts (which may include decision_required)
              (parsed.scenario.alerts || []).forEach((alert: any, idx: number) => {
                events.push({
                  id: `scenario_alert_${idx}`,
                  title: alert.title || alert.event || `Alert ${idx}`,
                  description: alert.message || alert.description || '',
                  eventType: alert.decision_required ? 'decision_point' : 'alert',
                  severity: alert.severity || 'medium',
                  scheduledTime: parseTimeStringToSeconds(alert.time) || 0,
                  isTriggered: !!alert.automatic || false,
                  options: alert.decision_required?.options?.map((o: any) => ({ id: o.id, label: o.label, description: o.description, path: o.path })) || [],
                  recipientRole: alert.recipient_role || alert.recipientRole || null,
                  decisionRequired: !!alert.decision_required
                });
              });

              // set scenario events sorted by scheduledTime
              events.sort((a, b) => (a.scheduledTime || 0) - (b.scheduledTime || 0));
              setScenarioEvents(events);
              scenarioRef.current = parsed.scenario;
            } catch (e) {
              console.error('Failed to parse scenario initial timeline', e);
            }
          }
        }
      } catch (e) {
        console.error('Failed to load session players', e);
      }
    }
  }, [propPlayer]);

  // NOTE: Previously there was an auto-resolve effect here that picked a random option for
  // decision points not matching the player's role. This caused user-selected decisions
  // to be preempted. It has been removed so the player can always manually choose when
  // a relevant decision point appears. Non-relevant decision points will simply pass
  // through the timeline without automatic resolution.

  // Cleanup: Remove any legacy "auto-resolved" decisions that actually belong to the current player's role.
  // Also roll back any path events that were appended because of those auto resolutions so the player can now choose.
  useEffect(() => {
    if (!currentPlayer || scenarioEvents.length === 0) return;
    const playerRole = normalizeRole(currentPlayer.persona);
    let removedSomething = false;
    const removedPathKeys: string[] = [];

    setResolvedEvents(prev => {
      const next = { ...prev } as typeof prev;
      scenarioEvents.forEach(ev => {
        if (ev.eventType !== 'decision_point') return;
        const res = next[ev.id];
        if (!res) return;
        // Identify legacy auto or non-manual (no manual flag) resolutions
        const isLegacyAuto = !res.manual;
        const recipient = ev.recipientRole;
        const matchRecipient = (r: any) => normalizeRole(r) === playerRole;
        const isRelevant = (!recipient || (Array.isArray(recipient) ? recipient.some(matchRecipient) : matchRecipient(recipient)));
        if (isRelevant) {
          // Find path key that may have been enqueued
          if (ev.options) {
            const opt = ev.options.find((o: any) => o.id === res.decision && o.path);
            if (opt && opt.path) {
              removedPathKeys.push(opt.path);
            }
          }
          delete next[ev.id];
          removedSomething = true;
        }
      });
      if (removedSomething) {
        try {
          sessionStorage.setItem('cyberwarsim_resolved', JSON.stringify(next));
          try { localStorage.setItem('cyberwarsim_resolved_sync', JSON.stringify(next)); localStorage.removeItem('cyberwarsim_resolved_sync'); } catch {}
        } catch {}
      }
      return removedSomething ? next : prev;
    });

    if (removedPathKeys.length > 0) {
      // Remove enqueued path events tied to removed auto decisions so user can legitimately pick a branch now.
      setScenarioEvents(prev => prev.filter(ev => !removedPathKeys.some(pk => ev.id.startsWith(`path_${pk}_`))));
      setChosenPaths(prev => {
        const updated = prev.filter(pk => !removedPathKeys.includes(pk));
        try { sessionStorage.setItem('cyberwarsim_paths', JSON.stringify(updated)); } catch {}
        return updated;
      });
    }
  }, [currentPlayer, scenarioEvents]);

  // Initialization guard so we only reset timeline once per loaded scenario (avoid jump after path append)
  const initializedRef = useRef(false);
  useEffect(() => {
    if (!scenarioEvents || scenarioEvents.length === 0) return;
    if (initializedRef.current) return; // already initialized; do not wipe timeline on subsequent scenarioEvents changes
    setDisplayedEvents([]);
    setProcessingIndex(0);
    setWaitingEventId(null);
    initializedRef.current = true;
  }, [scenarioEvents]);

  // Timed sequential progression: add one event, then wait (20s) before adding next unless a decision point pauses progression.
  useEffect(() => {
    if (!scenarioEvents || scenarioEvents.length === 0) return;
  if (waitingEventId) return; // paused awaiting user decision
    if (processingIndex >= scenarioEvents.length) return; // done
  if (isAdvancing) return; // currently in delay window

    const currentEvent = scenarioEvents[processingIndex];
    if (!currentEvent) return;

    const appendEvent = () => {
      setDisplayedEvents(prev => {
        if (prev.find(p => p.id === currentEvent.id)) return prev; // already appended
        return [...prev, { ...currentEvent, triggered: true }];
      });

      // If it's a decision point, determine relevance
      if (currentEvent.eventType === 'decision_point') {
        const recipient = currentEvent.recipientRole;
        const playerRole = currentPlayer ? normalizeRole(currentPlayer.persona) : null;
        const matchRecipient = (r: any) => playerRole && normalizeRole(r) === playerRole;
        const isRelevant = currentPlayer && (!recipient || (Array.isArray(recipient) ? recipient.some(matchRecipient) : matchRecipient(recipient)));
        if (isRelevant) {
          // pause for player action; do not advance index yet (decision will increment after resolution)
          setWaitingEventId(currentEvent.id);
          return; // stop here; user will continue
        }
        // If not relevant, we now simply allow timeline to continue without auto-picking a path.
      }

      // Advance index for non-pausing events and start delay cycle for next event
      setProcessingIndex(prev => prev + 1);
      setIsAdvancing(true);
      setNextDelayRemaining(ADVANCE_DELAY_SECONDS);
    };

    // Append current event immediately when effect triggers
    appendEvent();
  }, [scenarioEvents, processingIndex, waitingEventId, isAdvancing, currentPlayer]);

  const getPersonaEvents = (persona: string) => {
    const allEvents: Record<string, any> = {
      // persona-specific hardcoded events removed in favor of scenario-driven events
      [PERSONAS.SOC_ANALYST]: [],
      [PERSONAS.SOC_LEAD]: [
        { id: "soc_lead_1", title: "Team Coordination Required", description: "Multiple SOC analysts reporting AI-related anomalies.", eventType: "decision_point", severity: "medium", scheduledTime: 420, isTriggered: true }
      ],
      [PERSONAS.CISO]: [
        { id: "ciso_1", title: "Executive Briefing Required", description: "AI security incident detected.", eventType: "decision_point", severity: "high", scheduledTime: 480, isTriggered: true }
      ]
    };
    return allEvents[persona] || [];
  };

  // Use displayedEvents (processed sequentially) as the timeline visible to all players
  const personaEvents = displayedEvents.length > 0 ? displayedEvents : (currentPlayer ? [...getPersonaEvents(currentPlayer.persona), ...scenarioEvents] : scenarioEvents);

  const handleEventDecision = (eventId: string, decision: string, reasoning: string) => {
    console.log("Event decision:", { eventId, decision, reasoning });

    // Determine if chosen decision points to a path and enqueue that path's events
    const eventObj = scenarioEvents.find(ev => ev.id === eventId) || displayedEvents.find(ev => ev.id === eventId);
    let decisionLabel: string | undefined = undefined;
    if (eventObj && eventObj.options) {
      const opt = eventObj.options.find((o: any) => o.id === decision);
      if (opt) {
        decisionLabel = opt.label || decision;
        if (opt.path) enqueueDecisionPath(opt.path);
      }
    }
    const resolution: Resolution = { decision, decisionLabel, reasoning, manual: true };
    setResolvedEvents(prev => {
      if (prev[eventId] && prev[eventId].manual) return prev; // already resolved manually
      const next = { ...prev, [eventId]: resolution };
      // persist resolved decisions so they survive reloads and notify other clients
      try {
        sessionStorage.setItem('cyberwarsim_resolved', JSON.stringify(next));
        try { localStorage.setItem('cyberwarsim_resolved_sync', JSON.stringify(next)); localStorage.removeItem('cyberwarsim_resolved_sync'); } catch (e) {}
      } catch (e) {
        console.error('Failed to persist resolution', e);
      }
      return next;
    });
    // update displayed event with resolution
    setDisplayedEvents(prev => prev.map(d => d.id === eventId ? { ...d, resolution } : d));
    // clear waiting flag and immediately advance processing index so processing resumes
    if (waitingEventId === eventId) {
      setWaitingEventId(null);
      setProcessingIndex(prev => prev + 1);
      // start delay cycle before next event
      setIsAdvancing(true);
      setNextDelayRemaining(ADVANCE_DELAY_SECONDS);
    }
  };

  // Helper: parse time string to seconds (duplicated from earlier scope for reuse)
  const parseTimeStringToSeconds = (timeStr: string) => {
    try {
      if (!timeStr || typeof timeStr !== 'string') return 0;
      const cleaned = timeStr.replace(/^T\+/, '');
      const parts = cleaned.split(':').map(p => parseInt(p.replace(/^0+/, '') || '0', 10));
      if (parts.length === 1) return parts[0] * 60;
      if (parts.length === 2) return parts[0] * 60 + parts[1];
      if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } catch (e) { return 0; }
    return 0;
  };

  // Enqueue events for a decision path if not already chosen
  const enqueueDecisionPath = (pathKey: string) => {
    if (!scenarioRef.current || !scenarioRef.current.decision_paths) return;
    if (chosenPaths.includes(pathKey)) return; // already loaded
    const pathData = scenarioRef.current.decision_paths[pathKey];
    if (!pathData) return;

    const newEvents: any[] = [];
    // Alerts
    (pathData.alerts || []).forEach((alert: any, idx: number) => {
      newEvents.push({
        id: `path_${pathKey}_alert_${idx}`,
        title: alert.title || alert.event || `Alert ${idx}`,
        description: alert.message || alert.description || '',
        eventType: alert.decision_required ? 'decision_point' : 'alert',
        severity: alert.severity || 'medium',
        scheduledTime: parseTimeStringToSeconds(alert.time) || 0,
        isTriggered: !!alert.automatic || false,
        options: alert.decision_required?.options?.map((o: any) => ({ id: o.id, label: o.label, description: o.description, path: o.path })) || [],
        recipientRole: alert.recipient_role || alert.recipientRole || null,
        decisionRequired: !!alert.decision_required
      });
    });
    // Sub decisions
    const subs = pathData.sub_decisions || {};
    Object.keys(subs).forEach((key) => {
      const sd = subs[key];
      newEvents.push({
        id: `path_${pathKey}_subdecision_${key}`,
        title: sd.title || sd.decision_id || key,
        description: sd.description || '',
        eventType: 'decision_point',
        severity: 'high',
        scheduledTime: parseTimeStringToSeconds(sd.time) || 0,
        isTriggered: true,
        options: (sd.options || []).map((o: any) => ({ id: o.id, label: o.label, description: o.description, path: o.path })),
        recipientRole: sd.recipient_role || sd.recipientRole || null,
        decisionRequired: true
      });
    });
    // Ending
    if (pathData.ending) {
      const end = pathData.ending;
      newEvents.push({
        id: `path_${pathKey}_ending`,
        title: end.title || 'Ending',
        description: end.description || '',
        eventType: 'ending',
        severity: end.type || 'info',
        scheduledTime: parseTimeStringToSeconds(end.time) || 0,
        isTriggered: true
      });
    }

    if (newEvents.length > 0) {
      // Append without re-sorting already processed events; times are scenario relative and later
      setScenarioEvents(prev => [...prev, ...newEvents]);
      setChosenPaths(prev => {
        const updated = [...prev, pathKey];
        try { sessionStorage.setItem('cyberwarsim_paths', JSON.stringify(updated)); } catch {}
        return updated;
      });
    }
  };

  // If a waiting decision somehow got resolved externally (storage sync) auto-advance.
  useEffect(() => {
    if (waitingEventId && resolvedEvents[waitingEventId]) {
      setWaitingEventId(null);
      setProcessingIndex(prev => prev + 1);
      setIsAdvancing(true);
      setNextDelayRemaining(ADVANCE_DELAY_SECONDS);
    }
  }, [waitingEventId, resolvedEvents]);

  // Acknowledge (skip) current delay to immediately show next event
  const acknowledgeDelay = () => {
    if (!isAdvancing || waitingEventId) return; // only skip during passive delay
    setNextDelayRemaining(0); // this will cause countdown effect to flip isAdvancing false
  };

  // Countdown interval for visual indicator
  useEffect(() => {
    if (!isAdvancing) return;
    if (nextDelayRemaining <= 0) {
      // end of delay cycle -> allow next effect run to append next event
      setIsAdvancing(false);
      return;
    }
    const int = setInterval(() => {
      setNextDelayRemaining(prev => {
        if (prev <= 1) {
          // finishing countdown
            setIsAdvancing(false);
            return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(int);
  }, [isAdvancing, nextDelayRemaining]);

  const handleRoomChange = (room: string) => {
    setCurrentRoom(room);
  };

  const handleSendMessage = (message: string) => {
    console.log("Message sent to room:", currentRoom, message);
  };

  const onlineCount = players.filter(p => p.isOnline).length;
  const totalScore = players.find(p => p.name === currentPlayer?.name)?.score || 0;
  const playerDecisions = players.find(p => p.name === currentPlayer?.name)?.decisionsCount || 0;

  const leave = () => {
    try { sessionStorage.removeItem('cyberwarsim_current_player'); } catch {};
    if (onLeaveGame) return onLeaveGame();
    router.push('/cyberwarsim/join');
  };

  if (!sessionName) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No active simulation found. Please start a session from the Admin panel.</p>
          <Button onClick={() => router.push('/cyberwarsim')}>Go to Admin</Button>
        </div>
      </div>
    );
  }

  if (!currentPlayer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No player selected. Please join from the Join page.</p>
          <Button onClick={() => router.push('/cyberwarsim/join')}>Go to Join</Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="min-h-screen bg-background/95 backdrop-blur-sm">
        <div className="border-b bg-card/90 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-6 h-6 text-primary" />
                  <h1 className="text-xl font-mono text-primary">[CYBER_WAR_SIM]</h1>
                </div>
                <span className="px-2 py-1 border rounded text-xs">{currentPlayer.persona.replace('_', ' ')}</span>
                <span className="text-sm text-muted-foreground">{currentPlayer.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm"><Users className="w-4 h-4" /> <span>{onlineCount}/7 Online</span></div>
                <div className="flex items-center gap-2 text-sm"><Award className="w-4 h-4" /> <span>{totalScore} Points</span></div>
                <Button data-testid="button-leave-game" variant="outline" size="sm" onClick={leave}>Leave Game</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-12 gap-6 h-[calc(100vh-140px)]">
            <div className="col-span-3 space-y-4">
              <GameTimer duration={600} phase={"simulation"} onPhaseComplete={() => {}} />
              <MoneyIndicator totalDuration={600} startingAmount={10000} />

              <Card data-testid="card-session-info">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-mono">SESSION_INFO</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm text-muted-foreground">Scenario:</span>
                    <div className="font-mono text-sm text-foreground">{sessionName}</div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Phase:</span>
                    <div className="font-mono text-sm text-primary">SIMULATION</div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Your Stats:</span>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div className="text-center p-2 bg-muted/20 rounded"><div className="font-mono text-sm font-semibold">{totalScore}</div><div className="text-xs text-muted-foreground">Points</div></div>
                      <div className="text-center p-2 bg-muted/20 rounded"><div className="font-mono text-sm font-semibold">{playerDecisions}</div><div className="text-xs text-muted-foreground">Decisions</div></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-online-players">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-mono flex items-center gap-2"><Clock className="w-4 h-4 mr-2" /> ACTIVE_PLAYERS</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {players.filter(p => p.isOnline).map((player) => (
                    <div key={player.name} className="flex items-center justify-between p-2 bg-muted/10 rounded text-sm">
                      <div>
                        <div className="font-mono">{player.name}</div>
                        <div className="text-xs text-muted-foreground">{player.persona.replace('_', ' ')}</div>
                      </div>
                      <span className="px-2 py-1 border rounded text-xs">{player.currentRoom}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="col-span-9">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="timeline" data-testid="tab-timeline"><Clock className="w-4 h-4 mr-2" />Timeline</TabsTrigger>
                  <TabsTrigger value="chat" data-testid="tab-chat"><Users className="w-4 h-4 mr-2" />Communications</TabsTrigger>
                  <TabsTrigger value="overview" data-testid="tab-overview"><Activity className="w-4 h-4 mr-2" />Team Overview</TabsTrigger>
                </TabsList>

                <TabsContent value="timeline" className="h-full">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="font-mono">INCIDENT_TIMELINE</CardTitle>
                    </CardHeader>
                    <CardContent className="h-full overflow-auto">
                      <div className="space-y-4">
                        {personaEvents.map((event: any) => {
                          const isLast = personaEvents[personaEvents.length - 1]?.id === event.id;
                          const showCountdown = isAdvancing && !waitingEventId && isLast;
                          return (
                            <TimelineEvent
                              key={event.id}
                              {...event}
                              targetPersonas={event.recipientRole ? (Array.isArray(event.recipientRole) ? event.recipientRole : [event.recipientRole]) : []}
                              isVisible={true}
                              onDecision={handleEventDecision}
                              resolution={resolvedEvents[event.id] || event.resolution}
                              allowDecision={
                                event.eventType === 'decision_point' && waitingEventId === event.id && currentPlayer && (
                                  !event.recipientRole || (Array.isArray(event.recipientRole)
                                    ? event.recipientRole.some((r: any) => normalizeRole(r) === normalizeRole(currentPlayer.persona))
                                    : normalizeRole(event.recipientRole) === normalizeRole(currentPlayer.persona))
                                )
                              }
                              nextInSeconds={ showCountdown ? nextDelayRemaining : undefined }
                              nextDelayTotal={ADVANCE_DELAY_SECONDS }
                              onAcknowledge={ showCountdown ? acknowledgeDelay : undefined }
                            />
                          );
                        })}
                        {personaEvents.length === 0 && (
                          <div className="text-center p-8 text-muted-foreground"><p className="font-mono">No specific events for {currentPlayer.persona.replace('_', ' ')} role yet.</p><p className="text-sm mt-2">Events will appear as the simulation progresses...</p></div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="chat" className="h-full">
                  <Card className="h-full">
                    <ChatInterface currentRoom={currentRoom} currentPlayer={currentPlayer} onSendMessage={handleSendMessage} onRoomChange={handleRoomChange} />
                  </Card>
                </TabsContent>

                <TabsContent value="overview" className="h-full">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="font-mono">TEAM_STATUS</CardTitle>
                    </CardHeader>
                    <CardContent className="h-full overflow-auto">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {players.map((player) => (
                          <PersonaCard key={player.name} name={player.name} persona={player.persona} isOnline={player.isOnline} currentRoom={player.currentRoom} score={player.score} decisionsCount={player.decisionsCount} />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
