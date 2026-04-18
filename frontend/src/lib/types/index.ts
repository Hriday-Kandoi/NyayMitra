// Types for NyayMitra - AI Legal Platform

/**
 * Case Information
 */
export interface Case {
  id: string;
  title: string;
  caseNumber: string;
  courtName: string;
  status: CaseStatus;
  description: string;
  filedDate: string;
  lastUpdated: string;
  lawyers?: string[];
  parties?: string[];
  caseType?: string;
  nextHearing?: string;
}

export type CaseStatus = "active" | "closed" | "pending" | "appeal";

/**
 * Chat Message
 */
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  caseId?: string;
}

/**
 * API Responses
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CaseListResponse extends ApiResponse<Case[]> {}

export interface CaseDetailResponse extends ApiResponse<Case> {}

export interface ChatResponse extends ApiResponse<ChatMessage> {}

/**
 * Chat Request
 */
export interface ChatRequest {
  message: string;
  caseId?: string;
  conversationHistory?: ChatMessage[];
}

/**
 * AI Analysis Result
 */
export interface AIAnalysis {
  summary: string;
  keyPoints: string[];
  recommendations: string[];
  riskFactors?: string[];
}
