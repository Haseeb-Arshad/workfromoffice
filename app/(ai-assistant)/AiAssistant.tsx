"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Minimize2, MessageCircle } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AiAssistantProps {
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

const AiAssistant: React.FC<AiAssistantProps> = ({ isMinimized = false, onToggleMinimize }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your AI Assistant, here to help you with tasks, answer questions, and boost your productivity in WorkBase. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateAiResponse = (userMessage: string): string => {
    const responses = [
      "That's an excellent question! Let me help you with that. Based on what you're asking, I'd recommend focusing on breaking down the task into smaller, manageable steps.",
      "I understand what you're looking for. Here's my suggestion: try approaching this systematically, and don't hesitate to ask if you need more specific guidance.",
      "Great point! This is definitely something I can help you with. Consider this approach, and let me know if you'd like me to elaborate on any part.",
      "I see what you're getting at. This is a common challenge, and there are several effective strategies we could explore together.",
      "That's a thoughtful question. Let me provide you with a comprehensive answer that should address your concerns and help you move forward.",
      "Excellent! I'm happy to help you with this. Based on your question, I think the best approach would be to start with the fundamentals and build from there.",
    ];
    
    // Simple keyword-based responses
    if (userMessage.toLowerCase().includes("help") || userMessage.toLowerCase().includes("assist")) {
      return "I'm here to help you with a wide range of tasks! I can assist with productivity tips, answer questions, help brainstorm ideas, provide explanations on various topics, or just have a conversation. What specific area would you like help with?";
    }
    
    if (userMessage.toLowerCase().includes("task") || userMessage.toLowerCase().includes("work") || userMessage.toLowerCase().includes("project")) {
      return "Great! I'd love to help you with your work or project. To provide the most useful assistance, could you tell me more details about what you're working on? I can help with planning, organization, problem-solving, or breaking down complex tasks into manageable steps.";
    }
    
    if (userMessage.toLowerCase().includes("productivity") || userMessage.toLowerCase().includes("focus")) {
      return "Productivity is all about finding the right balance and systems that work for you! Some effective strategies include: time-blocking your calendar, using the Pomodoro technique, minimizing distractions, and taking regular breaks. What specific productivity challenges are you facing?";
    }

    if (userMessage.toLowerCase().includes("idea") || userMessage.toLowerCase().includes("creative") || userMessage.toLowerCase().includes("brainstorm")) {
      return "I love helping with creative thinking and brainstorming! The best ideas often come from combining different perspectives and approaches. What kind of project or challenge are you looking to generate ideas for? I can help you explore different angles and possibilities.";
    }
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: simulateAiResponse(input),
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={onToggleMinimize}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-accent text-white shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          <MessageCircle className="w-8 h-8" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-orange-50 via-amber-50/30 to-yellow-50/20 relative overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-white/80 to-gray-50/40 backdrop-blur-sm border-b border-gray-200/50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="p-3 rounded-xl bg-gradient-to-br from-white/60 to-gray-50/60 shadow-sm">
                <Bot className="w-8 h-8 text-primary" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary tracking-tight">
                AI Assistant
              </h1>
              <p className="text-primary/60 text-sm">Your intelligent workspace companion</p>
            </div>
          </div>
          {onToggleMinimize && (
            <div className="flex gap-2">
              <button
                onClick={onToggleMinimize}
                className="p-2 rounded-xl bg-white/50 hover:bg-white/70 transition-colors"
              >
                <Minimize2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-200/50 scrollbar-track-transparent">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-4 ${message.role === "user" ? "justify-end" : ""}`}
          >
            {message.role === "assistant" && (
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary/20 to-accent/30 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
              </div>
            )}
            
            <div
              className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                message.role === "user"
                  ? "bg-gradient-to-br from-secondary to-accent text-white"
                  : "bg-gradient-to-br from-white/80 to-gray-50/40 backdrop-blur-sm border border-gray-200/50"
              }`}
            >
              <p className={`text-sm leading-relaxed ${
                message.role === "user" ? "text-white" : "text-primary"
              }`}>
                {message.content}
              </p>
              <div className={`text-xs mt-2 ${
                message.role === "user" ? "text-white/70" : "text-primary/60"
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            {message.role === "user" && (
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary/20 to-accent/30 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary/20 to-accent/30 flex items-center justify-center">
                <Bot className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="max-w-[80%] p-4 rounded-2xl bg-gradient-to-br from-white/80 to-gray-50/40 backdrop-blur-sm border border-gray-200/50">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-sm text-primary/70">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 bg-gradient-to-r from-white/80 to-gray-50/40 backdrop-blur-sm border-t border-gray-200/50">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask me anything or describe what you need help with..."
              className="w-full p-4 pr-12 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 resize-none transition-all duration-200 text-primary placeholder:text-primary/50"
              rows={2}
            />
            <div className="absolute bottom-3 right-3 text-primary/40">
              <MessageCircle className="w-5 h-5" />
            </div>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="px-6 py-4 rounded-xl bg-gradient-to-r from-secondary to-accent hover:from-accent hover:to-secondary text-white font-semibold transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;