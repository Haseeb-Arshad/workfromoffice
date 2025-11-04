
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Minimize2, MessageCircle, AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import { aiApi } from "@/infrastructure/lib/api";

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
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Generate session ID on component mount
  useEffect(() => {
    const newSessionId = `workbase-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || !sessionId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const messageContent = input;
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      // Call backend API
      const response = await aiApi.chat(messageContent, sessionId);
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.data.message,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to get AI response');
      
      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: "I'm sorry, I'm having trouble connecting to my AI service right now. Please make sure the backend server is running and try again.",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = async () => {
    if (!sessionId) return;
    
    try {
      await aiApi.clearConversation(sessionId);
      setMessages([
        {
          id: "welcome-new",
          role: "assistant",
          content: "Hello! I'm your AI Assistant. How can I help you today?",
          timestamp: new Date(),
        },
      ]);
      setError(null);
    } catch (error) {
      console.error('Clear conversation error:', error);
      setError('Failed to clear conversation');
    }
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
        <Button
          onClick={onToggleMinimize}
          size="icon"
          className="w-14 h-14 rounded-full bg-gradient-to-br from-secondary to-accent text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
        >
          <Bot className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background/50 backdrop-blur-sm">
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-md border-b border-primary/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-secondary/90 to-accent/90 flex items-center justify-center shadow-sm">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-primary">AI Assistant</h1>
              <p className="text-xs text-primary/50">Always here to help</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            <Button
              onClick={clearConversation}
              variant="ghost"
              size="icon"
              className="p-2 rounded-lg hover:bg-white/70 transition-colors"
              title="Clear conversation"
            >
              <RotateCcw className="w-4 h-4 text-primary/60" />
            </Button>
            {onToggleMinimize && (
              <Button
                onClick={onToggleMinimize}
                variant="ghost"
                size="icon"
                className="p-2 rounded-lg hover:bg-white/70 transition-colors"
              >
                <Minimize2 className="w-4 h-4 text-primary/60" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mx-4 mt-3 p-2.5 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <p className="text-red-700 text-xs flex-1">{error}</p>
          <Button
            onClick={() => setError(null)}
            variant="ghost"
            size="icon"
            className="text-red-600 hover:text-red-800 text-lg leading-none"
          >
            ×
          </Button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2.5 ${message.role === "user" ? "justify-end" : ""}`}
          >
            {message.role === "assistant" && (
              <div className="flex-shrink-0">
                <div className="w-7 h-7 rounded-lg bg-white/70 backdrop-blur-sm flex items-center justify-center border border-primary/10">
                  <Bot className="w-4 h-4 text-secondary" />
                </div>
              </div>
            )}
            
            <div
              className={`max-w-[75%] px-3 py-2.5 rounded-xl text-sm ${
                message.role === "user"
                  ? "bg-gradient-to-br from-secondary to-accent text-white shadow-sm"
                  : "bg-white/70 backdrop-blur-sm border border-primary/10 text-primary"
              }`}
            >
              <p className="leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
              <div className={`text-[10px] mt-1.5 ${
                message.role === "user" ? "text-white/60" : "text-primary/40"
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            {message.role === "user" && (
              <div className="flex-shrink-0">
                <div className="w-7 h-7 rounded-lg bg-white/70 backdrop-blur-sm flex items-center justify-center border border-primary/10">
                  <User className="w-4 h-4 text-secondary" />
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2.5">
            <div className="flex-shrink-0">
              <div className="w-7 h-7 rounded-lg bg-white/70 backdrop-blur-sm flex items-center justify-center border border-primary/10">
                <Bot className="w-4 h-4 text-secondary" />
              </div>
            </div>
            <div className="px-3 py-2.5 rounded-xl bg-white/70 backdrop-blur-sm border border-primary/10">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary/70 animate-bounce"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-secondary/70 animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-1.5 h-1.5 rounded-full bg-secondary/70 animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white/60 backdrop-blur-md border-t border-primary/10">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2.5 rounded-lg bg-white/80 backdrop-blur-sm border border-primary/10 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary/30 resize-none transition-all text-sm text-primary placeholder:text-primary/40"
            rows={1}
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading || !sessionId}
            className="px-4 py-2.5 rounded-lg bg-secondary hover:bg-accent text-white font-medium transition-all duration-200 hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;