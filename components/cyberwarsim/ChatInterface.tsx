"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { Send, Users, MessageSquare, Hash } from "lucide-react";

interface ChatMessage {
  id: string;
  sender: string;
  persona: string;
  message: string;
  timestamp: Date;
  messageType: "chat" | "system" | "alert";
}

interface ChatInterfaceProps {
  currentRoom: string;
  currentPlayer: { name: string; persona: string };
  onSendMessage?: (message: string) => void;
  onRoomChange?: (room: string) => void;
}

export default function ChatInterface({
  currentRoom,
  currentPlayer,
  onSendMessage,
  onRoomChange
}: ChatInterfaceProps) {
  const [message, setMessage] = useState("");

  const getPersonaMessages = (room: string) => {
    const roomMessages: Record<string, ChatMessage[]> = {
      "main": [
        {
          id: "main_1",
          sender: "System",
          persona: "SYSTEM",
          message: "AI Security Incident - Code Red: Multiple anomalies detected across AI infrastructure",
          timestamp: new Date(Date.now() - 300000),
          messageType: "alert"
        }
      ],
      "soc": [],
      "it": [],
      "executive": [],
      "public": [],
      "legal": []
    };
    return roomMessages[room] || [];
  };

  const [messages, setMessages] = useState<ChatMessage[]>(getPersonaMessages(currentRoom));
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(getPersonaMessages(currentRoom));
  }, [currentRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const availableRooms = [
    { id: "main", name: "Main Command", icon: Users, description: "Central coordination room" },
    { id: "soc", name: "SOC Team", icon: MessageSquare, description: "Security operations center" },
    { id: "it", name: "IT Response", icon: Hash, description: "Infrastructure team" },
    { id: "executive", name: "Executive", icon: Users, description: "Leadership decisions" },
    { id: "public", name: "Public Relations", icon: MessageSquare, description: "Communication strategy" },
    { id: "legal", name: "Legal & Compliance", icon: Hash, description: "Regulatory response" }
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: currentPlayer.name,
        persona: currentPlayer.persona,
        message: message.trim(),
        timestamp: new Date(),
        messageType: "chat"
      };
      setMessages([...messages, newMessage]);
      setMessage("");
      onSendMessage?.(message.trim());
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-full">
      <div className="w-64 border-r bg-muted/20">
        <div className="p-4 border-b">
          <h3 className="font-mono font-semibold text-sm">COMM_CHANNELS</h3>
        </div>
        <div className="p-2 space-y-1">
          {availableRooms.map((room) => {
            const IconComponent = room.icon as any;
            return (
              <button
                key={room.id}
                onClick={() => onRoomChange?.(room.id)}
                className={`w-full p-3 text-left rounded-md hover-elevate transition-all ${
                  currentRoom === room.id 
                    ? 'bg-primary/20 border border-primary/40 text-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <IconComponent className="w-4 h-4" />
                  <span className="font-mono text-sm font-medium">{room.name}</span>
                </div>
                <p className="text-xs text-muted-foreground">{room.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b bg-card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-mono font-semibold">#{availableRooms.find(r => r.id === currentRoom)?.name || currentRoom}</h2>
              <p className="text-sm text-muted-foreground">{availableRooms.find(r => r.id === currentRoom)?.description}</p>
            </div>
            <span className="px-2 py-1 border rounded text-xs">{currentPlayer.persona.replace('_', ' ')}</span>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-auto">
          <div className="space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`p-3 rounded-md ${msg.messageType === 'alert' ? 'border-l-4 border-l-destructive bg-destructive/5' : 'border-l-4 border-l-primary/20 bg-card'}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-semibold">{msg.sender}</span>
                    <span className="text-xs px-2 py-1 border rounded">{msg.persona.replace('_', ' ')}</span>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">{formatTime(msg.timestamp)}</span>
                </div>
                <p className="text-sm">{msg.message}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="p-4 border-t bg-card">
          <div className="flex gap-2">
            <input
              value={message}
              onChange={(e) => setMessage((e.target as HTMLInputElement).value)}
              placeholder={`Message #${availableRooms.find(r => r.id === currentRoom)?.name || currentRoom}...`}
              className="flex-1 font-mono px-3 py-2 border rounded"
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
            />
            <Button onClick={handleSendMessage} size="icon">Send</Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 font-mono">Press Enter to send • Shift+Enter for new line</p>
        </div>
      </div>
    </div>
  );
}
