import { ChatMessage, ChatRequest, ChatResponse, AIAnalysis, ApiResponse } from "@/lib/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Send a chat message and get AI response
 */
export async function sendChatMessage(request: ChatRequest): Promise<ChatMessage> {
  const response = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Failed to send message: ${response.statusText}`);
  }

  const data: ChatResponse = await response.json();
  if (!data.data) {
    throw new Error("No message data returned");
  }

  return data.data;
}

/**
 * Get chat history for a case
 */
export async function getChatHistory(caseId: string): Promise<ChatMessage[]> {
  const response = await fetch(`${API_BASE}/api/chat/history/${caseId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch chat history: ${response.statusText}`);
  }

  const data: ApiResponse<ChatMessage[]> = await response.json();
  return data.data || [];
}

/**
 * Get AI analysis for a case
 */
export async function getAIAnalysis(caseId: string): Promise<AIAnalysis> {
  const response = await fetch(`${API_BASE}/api/ai/analyze/${caseId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get analysis: ${response.statusText}`);
  }

  const data: ApiResponse<AIAnalysis> = await response.json();
  if (!data.data) {
    throw new Error("No analysis data returned");
  }

  return data.data;
}

/**
 * Stream chat messages (for real-time updates)
 */
export async function streamChatMessage(
  request: ChatRequest,
  onChunk: (chunk: string) => void
): Promise<void> {
  const response = await fetch(`${API_BASE}/api/chat/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Failed to stream message: ${response.statusText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("Response body not readable");
  }

  const decoder = new TextDecoder();
  let done = false;

  while (!done) {
    const { value, done: streamDone } = await reader.read();
    done = streamDone;

    if (value) {
      const chunk = decoder.decode(value);
      onChunk(chunk);
    }
  }
}
