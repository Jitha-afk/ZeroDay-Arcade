import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  // Generate persona-specific chat messages for AI breach scenario
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
        },
        {
          id: "main_2",
          sender: "SOC Lead",
          persona: "SOC_LEAD",
          message: "All teams report to stations. We have confirmed AI model compromise. Initiating incident response protocol.",
          timestamp: new Date(Date.now() - 240000),
          messageType: "chat"
        }
      ],
      "soc": [
        {
          id: "soc_1",
          sender: "SOC Analyst",
          persona: "SOC_ANALYST",
          message: "Detecting AI training data poisoning attempts. Malicious samples injected into ML pipeline.",
          timestamp: new Date(Date.now() - 360000),
          messageType: "chat"
        },
        {
          id: "soc_2",
          sender: "SOC Lead",
          persona: "SOC_LEAD",
          message: "Correlating multiple AI-related IoCs. Pattern suggests coordinated attack on our ML infrastructure.",
          timestamp: new Date(Date.now() - 300000),
          messageType: "chat"
        },
        {
          id: "soc_3",
          sender: "SOC Analyst",
          persona: "SOC_ANALYST",
          message: "AI model queries showing 400% spike. Potential data exfiltration through model inference API.",
          timestamp: new Date(Date.now() - 180000),
          messageType: "chat"
        }
      ],
      "it": [
        {
          id: "it_1",
          sender: "IT Head",
          persona: "IT_HEAD",
          message: "GPU clusters showing unauthorized process execution. AI workloads compromised.",
          timestamp: new Date(Date.now() - 420000),
          messageType: "chat"
        },
        {
          id: "it_2",
          sender: "System",
          persona: "SYSTEM",
          message: "Alert: 47 help desk tickets - Users reporting AI tools unresponsive",
          timestamp: new Date(Date.now() - 300000),
          messageType: "alert"
        },
        {
          id: "it_3",
          sender: "IT Head",
          persona: "IT_HEAD",
          message: "Considering emergency shutdown of AI infrastructure. Will impact 200+ users.",
          timestamp: new Date(Date.now() - 120000),
          messageType: "chat"
        }
      ],
      "executive": [
        {
          id: "exec_1",
          sender: "CISO",
          persona: "CISO",
          message: "Board notification required. AI breach may trigger regulatory reporting under GDPR.",
          timestamp: new Date(Date.now() - 480000),
          messageType: "chat"
        },
        {
          id: "exec_2",
          sender: "CEO",
          persona: "CEO",
          message: "What's the business impact? Our AI competitive advantage could be compromised.",
          timestamp: new Date(Date.now() - 300000),
          messageType: "chat"
        },
        {
          id: "exec_3",
          sender: "CISO",
          persona: "CISO",
          message: "Intellectual property theft suspected. Customer data potentially accessed through ML models.",
          timestamp: new Date(Date.now() - 180000),
          messageType: "chat"
        }
      ],
      "public": [
        {
          id: "pr_1",
          sender: "PR Head",
          persona: "PR_HEAD",
          message: "TechCrunch reporter asking about AI security incident. Need holding statement ASAP.",
          timestamp: new Date(Date.now() - 360000),
          messageType: "chat"
        },
        {
          id: "pr_2",
          sender: "PR Head",
          persona: "PR_HEAD",
          message: "Social media mentions increasing. #AIBreach trending. Customer confidence concerns.",
          timestamp: new Date(Date.now() - 240000),
          messageType: "chat"
        },
        {
          id: "pr_3",
          sender: "System",
          persona: "SYSTEM",
          message: "Media Alert: Tech blog published story on AI security incident",
          timestamp: new Date(Date.now() - 120000),
          messageType: "alert"
        }
      ],
      "legal": [
        {
          id: "legal_1",
          sender: "Legal Head",
          persona: "LEGAL_HEAD",
          message: "GDPR breach notification clock started. 72-hour window for regulatory reporting.",
          timestamp: new Date(Date.now() - 300000),
          messageType: "chat"
        },
        {
          id: "legal_2",
          sender: "Legal Head",
          persona: "LEGAL_HEAD",
          message: "Reviewing AI model contracts. Customer data processing agreements may be violated.",
          timestamp: new Date(Date.now() - 180000),
          messageType: "chat"
        },
        {
          id: "legal_3",
          sender: "Legal Head",
          persona: "LEGAL_HEAD",
          message: "FBI cyber division offering investigation assistance. Law enforcement decision needed.",
          timestamp: new Date(Date.now() - 60000),
          messageType: "chat"
        }
      ]
    };
    
    return roomMessages[room] || [];
  };
  
  const [messages, setMessages] = useState<ChatMessage[]>(getPersonaMessages(currentRoom));
  
  // Update messages when room changes
  useEffect(() => {
    setMessages(getPersonaMessages(currentRoom));
  }, [currentRoom]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const availableRooms = [
    { id: "main", name: "Main Command", icon: Users, description: "Central coordination room" },
    { id: "soc", name: "SOC Team", icon: MessageSquare, description: "Security operations center" },
    { id: "it", name: "IT Response", icon: Hash, description: "Infrastructure team" },
    { id: "executive", name: "Executive", icon: Users, description: "Leadership decisions" },
    { id: "public", name: "Public Relations", icon: MessageSquare, description: "Communication strategy" },
    { id: "legal", name: "Legal & Compliance", icon: Hash, description: "Regulatory response" }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      console.log("Message sent:", newMessage);
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getPersonaColor = (persona: string) => {
    const colors: Record<string, string> = {
      "CISO": "text-blue-400",
      "SOC_LEAD": "text-green-400",
      "SOC_ANALYST": "text-cyan-400",
      "IT_HEAD": "text-purple-400",
      "PR_HEAD": "text-yellow-400",
      "CEO": "text-red-400",
      "LEGAL_HEAD": "text-orange-400",
      "SYSTEM": "text-muted-foreground"
    };
    return colors[persona] || "text-foreground";
  };

  const getMessageStyle = (messageType: string) => {
    switch (messageType) {
      case "alert":
        return "border-l-4 border-l-destructive bg-destructive/5";
      case "system":
        return "border-l-4 border-l-yellow-500 bg-yellow-500/5";
      default:
        return "border-l-4 border-l-primary/20 bg-card";
    }
  };

  return (
    <div className="flex h-full">
      {/* Room Selection Sidebar */}
      <div className="w-64 border-r bg-muted/20">
        <div className="p-4 border-b">
          <h3 className="font-mono font-semibold text-sm">COMM_CHANNELS</h3>
        </div>
        <div className="p-2 space-y-1">
          {availableRooms.map((room) => {
            const IconComponent = room.icon;
            return (
              <button
                key={room.id}
                data-testid={`button-room-${room.id}`}
                onClick={() => {
                  onRoomChange?.(room.id);
                  console.log("Room changed to:", room.id);
                }}
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

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b bg-card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-mono font-semibold">
                #{availableRooms.find(r => r.id === currentRoom)?.name || currentRoom}
              </h2>
              <p className="text-sm text-muted-foreground">
                {availableRooms.find(r => r.id === currentRoom)?.description}
              </p>
            </div>
            <Badge variant="outline" className="font-mono">
              {currentPlayer.persona.replace('_', ' ')}
            </Badge>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                data-testid={`message-${msg.id}`}
                className={`p-3 rounded-md ${getMessageStyle(msg.messageType)}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-mono text-sm font-semibold ${getPersonaColor(msg.persona)}`}>
                      {msg.sender}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {msg.persona.replace('_', ' ')}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
                <p className="text-sm">{msg.message}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t bg-card">
          <div className="flex gap-2">
            <Input
              data-testid="input-chat-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Message #${availableRooms.find(r => r.id === currentRoom)?.name || currentRoom}...`}
              className="flex-1 font-mono"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button
              data-testid="button-send-message"
              onClick={handleSendMessage}
              disabled={!message.trim()}
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 font-mono">
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}