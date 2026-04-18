"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, ChatRequest } from "@/lib/types";
import { sendChatMessage } from "@/lib/api/chat";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface ChatWindowProps {
  caseId?: string;
  onMessageSent?: (message: ChatMessage) => void;
}

export function ChatWindow({ caseId, onMessageSent }: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim() || isLoading) return;

    const messageContent = inputValue;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: messageContent,
      timestamp: new Date().toISOString(),
      caseId,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setError(null);

    try {
      const request: ChatRequest = {
        message: messageContent,
        caseId,
        conversationHistory: messages,
      };

      const response = await sendChatMessage(request);
      const aiDisclaimer =
        "\n\n---\nThis is legal information, not legal advice. Please consult a licensed advocate for your specific situation.";
      const responseWithDisclaimer: ChatMessage = {
        ...response,
        content: response.content + aiDisclaimer,
      };
      setMessages((prev) => [...prev, responseWithDisclaimer]);
      onMessageSent?.(responseWithDisclaimer);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to send message";
      setError(errorMessage);
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-[#1A2744]">
          Legal AI Assistant
        </h2>
        <p className="text-sm text-gray-600">
          Ask questions about your case
        </p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 && !error && (
          <div className="flex items-center justify-center h-full text-gray-500 text-center">
            <div>
              <p className="font-medium">Start a conversation</p>
              <p className="text-sm">
                Ask me anything about your legal case
              </p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${
                message.role === "user"
                  ? "bg-[#1A2744] text-white rounded-br-none"
                  : "bg-gray-100 text-gray-900 rounded-bl-none"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p
                className={`text-xs mt-1 ${
                  message.role === "user"
                    ? "text-gray-300"
                    : "text-gray-600"
                }`}
              >
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="bg-gray-100 text-gray-900 rounded-lg rounded-bl-none px-4 py-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" />
                <div
                  className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                />
                <div
                  className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
        <form onSubmit={handleSendMessage} className="space-y-3">
          <Input
            type="text"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            className="bg-white"
          />
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isLoading}
            disabled={!inputValue.trim() || isLoading}
          >
            {isLoading ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </div>
    </div>
  );
}
