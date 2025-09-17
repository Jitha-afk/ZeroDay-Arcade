"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { PERSONAS } from "./personas";
import ChatInterface from "./ChatInterface";
import TimelineEvent from "./TimelineEvent";
import PersonaCard from "./PersonaCard";
import GameTimer from "./GameTimer";
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
  const [scenarioData, setScenarioData] = React.useState<any | null>(null); // full scenario for dynamic path loading
  const [chosenPaths, setChosenPaths] = React.useState<Set<string>>(new Set());
  const [lockedDecisionGroups, setLockedDecisionGroups] = React.useState<Set<string>>(new Set()); // ensures only one branch per decision group
  const [resolvedEvents, setResolvedEvents] = React.useState<Record<string, {decision: string; reasoning: string}>>({});
  // load persisted resolved events from sessionStorage
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('cyberwarsim_resolved');
      if (raw) {
        const parsed = JSON.parse(raw);
        // Remove any legacy placeholder resolutions that block real decision input
        const cleaned: Record<string, {decision: string; reasoning: string}> = {};
        Object.entries(parsed).forEach(([k,v]: any) => {
          if (!v || typeof v !== 'object') return;
            if ((v.reasoning || '').toLowerCase().includes('user reasoning placeholder')) {
              // skip, forcing re-decision opportunity
              return;
            }
            cleaned[k] = v;
        });
        if (Object.keys(cleaned).length !== Object.keys(parsed).length) {
          try { sessionStorage.setItem('cyberwarsim_resolved', JSON.stringify(cleaned)); } catch {}
        }
        setResolvedEvents(cleaned);
      }
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
              setScenarioData(parsed.scenario);

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
              setScenarioData(parsed.scenario);

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

  // Auto-resolve decision points that are not relevant to current player's role
  useEffect(() => {
    if (!currentPlayer || scenarioEvents.length === 0) return;
    const unresolved = scenarioEvents.filter(ev => ev.eventType === 'decision_point' && !resolvedEvents[ev.id]);
    unresolved.forEach(ev => {
      const recipient = ev.recipientRole;
      const isRelevant = !recipient || (Array.isArray(recipient) ? recipient.includes(currentPlayer.persona) : recipient === currentPlayer.persona);
      if (!isRelevant && ev.options && ev.options.length > 0) {
        // pick randomly, and now also branch if the option has a path
        const choice = ev.options[Math.floor(Math.random() * ev.options.length)];
        handleEventDecision(ev.id, choice.id, 'Auto-resolved by system (not your role)', choice.path);
      }
    });
  }, [scenarioEvents, currentPlayer, resolvedEvents]);

  // Initial load reset (avoid resetting when we append new events due to path decisions)
  const [initialScenarioLoaded, setInitialScenarioLoaded] = useState(false);
  useEffect(() => {
    if (!scenarioEvents || scenarioEvents.length === 0) return;
    if (!initialScenarioLoaded) {
      setDisplayedEvents([]);
      setProcessingIndex(0);
      setWaitingEventId(null);
      setInitialScenarioLoaded(true);
    }
  }, [scenarioEvents, initialScenarioLoaded]);

  // Sequentially process scenario events immediately (no real time). Pause when a decision requires current player's action.
  useEffect(() => {
    if (!scenarioEvents || scenarioEvents.length === 0) return;
    if (waitingEventId) return; // waiting for player decision

    let idx = processingIndex;
    const processSequential = () => {
      while (idx < scenarioEvents.length) {
        const ev = scenarioEvents[idx];
        // append event to displayed events
        setDisplayedEvents(prev => {
          // avoid duplicate append if already present
          if (prev.find(p => p.id === ev.id)) return prev;
          return [...prev, { ...ev, triggered: true }];
        });

        if (ev.eventType !== 'decision_point') {
          idx += 1;
          setProcessingIndex(idx);
          continue;
        }

        // decision point: determine if current player is the intended recipient
        const recipient = ev.recipientRole;
        const isRelevant = currentPlayer && (!recipient || (Array.isArray(recipient) ? recipient.includes(currentPlayer.persona) : recipient === currentPlayer.persona));

        if (isRelevant) {
          // pause processing and wait for this player's action
          setWaitingEventId(ev.id);
          setProcessingIndex(idx); // keep index where we paused
          return;
        } else {
          // auto-resolve for non-relevant roles
          if (ev.options && ev.options.length > 0) {
            const choice = ev.options[Math.floor(Math.random() * ev.options.length)];
            // delegate to shared handler so branching also occurs
            handleEventDecision(ev.id, choice.id, 'Auto-resolved by system (not the intended role)', choice.path);
          }
          idx += 1;
          setProcessingIndex(idx);
          continue;
        }
      }
      // finished processing
      setProcessingIndex(idx);
    };

    // kick off processing
    processSequential();
  }, [scenarioEvents, processingIndex, waitingEventId, currentPlayer]);

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

  // Auto-scroll: keep a ref to timeline list container
  const timelineRef = React.useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return;
    // Always scroll to bottom on new events (could enhance later with user proximity detection)
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [personaEvents.length]);

  const buildEventsFromPath = (pathKey: string): any[] => {
    if (!scenarioData || !scenarioData.decision_paths) return [];
    const pathDef = scenarioData.decision_paths[pathKey];
    if (!pathDef) return [];
    const events: any[] = [];
    // helper reuse (duplicate of earlier parse but safe)
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

    // Alerts
    (pathDef.alerts || []).forEach((alert: any, idx: number) => {
      events.push({
        id: `${pathKey}_alert_${idx}_${Date.now()}`,
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
    // Sub-decisions (convert into decision_point events)
    if (pathDef.sub_decisions) {
      Object.values(pathDef.sub_decisions).forEach((sub: any) => {
        events.push({
          id: `${pathKey}_sub_${sub.decision_id || sub.title}_${Date.now()}`,
            title: sub.title || sub.decision_id || 'Decision',
            description: sub.description || 'Follow-up decision required.',
            eventType: 'decision_point',
            severity: sub.severity || 'high',
            scheduledTime: parseTimeStringToSeconds(sub.time) || 0,
            isTriggered: true,
            options: (sub.options || []).map((o: any) => ({ id: o.id, label: o.label, description: o.description, path: o.path })),
            recipientRole: sub.recipient_role || null,
            decisionRequired: true
        });
      });
    }
    // Ending treated as an alert (non decision)
    if (pathDef.ending) {
      const end = pathDef.ending;
      events.push({
        id: `${pathKey}_ending_${Date.now()}`,
        title: end.title || 'Scenario Ending',
        description: end.description || '',
        eventType: 'ending',
        endingType: end.type || 'unknown',
        severity: end.type === 'good_ending' ? 'medium' : end.type === 'bad_ending' ? 'critical' : 'high',
        scheduledTime: parseTimeStringToSeconds(end.time) || 0,
        isTriggered: true,
        options: [],
        recipientRole: null,
        decisionRequired: false
      });
    }
    return events;
  };

  const handleEventDecision = (eventId: string, decision: string, reasoning: string, path?: string) => {
    console.log("Event decision:", { eventId, decision, reasoning });
    const resolution = { decision, reasoning };
    setResolvedEvents(prev => {
      if (prev[eventId]) return prev; // already resolved
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
    }
    // Mutually-exclusive branching:
    // Derive a decision grouping token from the original event ID (strip dynamic suffix patterns)
    // Example ids: scenario_alert_2, monitor_path_sub_MON_CONTAINMENT_DECISION_<ts>
    const baseGroup = eventId
      .replace(/_alert_.*/, '_alert')
      .replace(/_sub_.*/, '_sub')
      .replace(/_ending_.*/, '_ending');
    if (!lockedDecisionGroups.has(baseGroup) && path) {
      // lock this group so parallel auto-resolve or race conditions can't spawn additional branches
      setLockedDecisionGroups(prev => new Set([...Array.from(prev), baseGroup]));
      if (!chosenPaths.has(path)) {
        const newPathEvents = buildEventsFromPath(path);
        if (newPathEvents.length > 0) {
          setScenarioEvents(prev => {
            const merged = [...prev, ...newPathEvents];
            merged.sort((a, b) => (a.scheduledTime || 0) - (b.scheduledTime || 0));
            return merged;
          });
          setChosenPaths(prev => new Set([...Array.from(prev), path]));
          setProcessingIndex(displayedEvents.length + 1);
        }
      }
    }
  };

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
              <GameTimer duration={2700} phase={"simulation"} onPhaseComplete={() => {}} />

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
                    <CardContent className="h-full overflow-auto" ref={timelineRef}>
                      <div className="space-y-4 pb-24">
                        {personaEvents.map((event: any) => (
                          <TimelineEvent
                            key={event.id}
                            {...event}
                            targetPersonas={event.recipientRole ? (Array.isArray(event.recipientRole) ? event.recipientRole : [event.recipientRole]) : []}
                            isVisible={true}
                            onDecision={handleEventDecision}
                            resolution={resolvedEvents[event.id] || event.resolution}
                            allowDecision={
                              // allow decision only when waiting on this event and the current player is intended recipient
                              event.eventType === 'decision_point' && waitingEventId === event.id && currentPlayer && ( !event.recipientRole || (Array.isArray(event.recipientRole) ? event.recipientRole.includes(currentPlayer.persona) : event.recipientRole === currentPlayer.persona) )
                            }
                          />
                        ))}
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
