import { type GameSession, type InsertGameSession, type Player, type InsertPlayer, type TimelineEvent, type InsertTimelineEvent, type PlayerDecision, type InsertPlayerDecision, type ChatMessage, type InsertChatMessage } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // Game Session methods
  getGameSession(id: string): Promise<GameSession | undefined>;
  createGameSession(session: InsertGameSession): Promise<GameSession>;
  updateGameSession(id: string, updates: Partial<GameSession>): Promise<GameSession | undefined>;
  
  // Player methods
  getPlayer(id: string): Promise<Player | undefined>;
  getPlayersBySession(sessionId: string): Promise<Player[]>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  updatePlayer(id: string, updates: Partial<Player>): Promise<Player | undefined>;
  
  // Timeline Event methods
  getTimelineEventsBySession(sessionId: string): Promise<TimelineEvent[]>;
  createTimelineEvent(event: InsertTimelineEvent): Promise<TimelineEvent>;
  
  // Player Decision methods
  createPlayerDecision(decision: InsertPlayerDecision): Promise<PlayerDecision>;
  getPlayerDecisionsBySession(sessionId: string): Promise<PlayerDecision[]>;
  
  // Chat Message methods
  getChatMessagesByRoom(sessionId: string, room: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
}

export class MemStorage implements IStorage {
  private gameSessions: Map<string, GameSession>;
  private players: Map<string, Player>;
  private timelineEvents: Map<string, TimelineEvent>;
  private playerDecisions: Map<string, PlayerDecision>;
  private chatMessages: Map<string, ChatMessage>;

  constructor() {
    this.gameSessions = new Map();
    this.players = new Map();
    this.timelineEvents = new Map();
    this.playerDecisions = new Map();
    this.chatMessages = new Map();
  }

  // Game Session methods
  async getGameSession(id: string): Promise<GameSession | undefined> {
    return this.gameSessions.get(id);
  }

  async createGameSession(insertSession: InsertGameSession): Promise<GameSession> {
    const id = randomUUID();
    const session: GameSession = { ...insertSession, id, createdAt: new Date() };
    this.gameSessions.set(id, session);
    return session;
  }

  async updateGameSession(id: string, updates: Partial<GameSession>): Promise<GameSession | undefined> {
    const session = this.gameSessions.get(id);
    if (!session) return undefined;
    const updated = { ...session, ...updates };
    this.gameSessions.set(id, updated);
    return updated;
  }

  // Player methods
  async getPlayer(id: string): Promise<Player | undefined> {
    return this.players.get(id);
  }

  async getPlayersBySession(sessionId: string): Promise<Player[]> {
    return Array.from(this.players.values()).filter(player => player.sessionId === sessionId);
  }

  async createPlayer(insertPlayer: InsertPlayer): Promise<Player> {
    const id = randomUUID();
    const player: Player = { ...insertPlayer, id, joinedAt: new Date() };
    this.players.set(id, player);
    return player;
  }

  async updatePlayer(id: string, updates: Partial<Player>): Promise<Player | undefined> {
    const player = this.players.get(id);
    if (!player) return undefined;
    const updated = { ...player, ...updates };
    this.players.set(id, updated);
    return updated;
  }

  // Timeline Event methods
  async getTimelineEventsBySession(sessionId: string): Promise<TimelineEvent[]> {
    return Array.from(this.timelineEvents.values())
      .filter(event => event.sessionId === sessionId)
      .sort((a, b) => a.scheduledTime - b.scheduledTime);
  }

  async createTimelineEvent(insertEvent: InsertTimelineEvent): Promise<TimelineEvent> {
    const id = randomUUID();
    const event: TimelineEvent = { ...insertEvent, id, createdAt: new Date() };
    this.timelineEvents.set(id, event);
    return event;
  }

  // Player Decision methods
  async createPlayerDecision(insertDecision: InsertPlayerDecision): Promise<PlayerDecision> {
    const id = randomUUID();
    const decision: PlayerDecision = { ...insertDecision, id, decidedAt: new Date() };
    this.playerDecisions.set(id, decision);
    return decision;
  }

  async getPlayerDecisionsBySession(sessionId: string): Promise<PlayerDecision[]> {
    return Array.from(this.playerDecisions.values()).filter(decision => decision.sessionId === sessionId);
  }

  // Chat Message methods
  async getChatMessagesByRoom(sessionId: string, room: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(message => message.sessionId === sessionId && message.room === room)
      .sort((a, b) => a.sentAt!.getTime() - b.sentAt!.getTime());
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = { ...insertMessage, id, sentAt: new Date() };
    this.chatMessages.set(id, message);
    return message;
  }
}

export const storage = new MemStorage();