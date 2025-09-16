import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Game session table
export const gameSessions = pgTable("game_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  status: text("status").notNull().default("waiting"), // waiting, active, debrief, completed
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  currentPhase: text("current_phase").default("setup"), // setup, simulation, debrief
  phaseStartTime: timestamp("phase_start_time"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Player table
export const players = pgTable("players", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").references(() => gameSessions.id),
  name: text("name").notNull(),
  persona: text("persona").notNull(), // CISO, SOC_LEAD, SOC_ANALYST, IT_HEAD, PR_HEAD, CEO, LEGAL_HEAD
  currentRoom: text("current_room").default("lobby"),
  isOnline: boolean("is_online").default(false),
  joinedAt: timestamp("joined_at").defaultNow(),
});

// Timeline events table
export const timelineEvents = pgTable("timeline_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").references(() => gameSessions.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  eventType: text("event_type").notNull(), // alert, notification, decision_point, info
  severity: text("severity").default("medium"), // low, medium, high, critical
  targetPersonas: json("target_personas").$type<string[]>().default([]),
  scheduledTime: integer("scheduled_time").notNull(), // seconds from game start
  triggeredAt: timestamp("triggered_at"),
  data: json("data").$type<Record<string, any>>().default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

// Player decisions table
export const playerDecisions = pgTable("player_decisions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").references(() => gameSessions.id),
  playerId: varchar("player_id").references(() => players.id),
  eventId: varchar("event_id").references(() => timelineEvents.id),
  decision: text("decision").notNull(),
  reasoning: text("reasoning"),
  points: integer("points").default(0),
  decidedAt: timestamp("decided_at").defaultNow(),
});

// Chat messages table
export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").references(() => gameSessions.id),
  playerId: varchar("player_id").references(() => players.id),
  room: text("room").notNull(),
  message: text("message").notNull(),
  messageType: text("message_type").default("chat"), // chat, system, alert
  sentAt: timestamp("sent_at").defaultNow(),
});

// Insert schemas
export const insertGameSessionSchema = createInsertSchema(gameSessions).omit({
  id: true,
  createdAt: true,
});

export const insertPlayerSchema = createInsertSchema(players).omit({
  id: true,
  joinedAt: true,
});

export const insertTimelineEventSchema = createInsertSchema(timelineEvents).omit({
  id: true,
  createdAt: true,
});

export const insertPlayerDecisionSchema = createInsertSchema(playerDecisions).omit({
  id: true,
  decidedAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  sentAt: true,
});

// Types
export type GameSession = typeof gameSessions.$inferSelect;
export type InsertGameSession = z.infer<typeof insertGameSessionSchema>;

export type Player = typeof players.$inferSelect;
export type InsertPlayer = z.infer<typeof insertPlayerSchema>;

export type TimelineEvent = typeof timelineEvents.$inferSelect;
export type InsertTimelineEvent = z.infer<typeof insertTimelineEventSchema>;

export type PlayerDecision = typeof playerDecisions.$inferSelect;
export type InsertPlayerDecision = z.infer<typeof insertPlayerDecisionSchema>;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

// Enums for type safety
export const PERSONAS = {
  CISO: "CISO",
  SOC_LEAD: "SOC_LEAD", 
  SOC_ANALYST: "SOC_ANALYST",
  IT_HEAD: "IT_HEAD",
  PR_HEAD: "PR_HEAD",
  CEO: "CEO",
  LEGAL_HEAD: "LEGAL_HEAD",
} as const;

export const GAME_STATUS = {
  WAITING: "waiting",
  ACTIVE: "active", 
  DEBRIEF: "debrief",
  COMPLETED: "completed",
} as const;

export const EVENT_TYPES = {
  ALERT: "alert",
  NOTIFICATION: "notification",
  DECISION_POINT: "decision_point",
  INFO: "info",
} as const;

export const SEVERITY_LEVELS = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical",
} as const;
