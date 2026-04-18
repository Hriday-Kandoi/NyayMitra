// Types for NyayMitra - AI Legal Platform

/**
 * Backend Case Response (from eCourts API)
 */
export interface CaseResponse {
  cnr_number: string;
  case_type: string;
  filing_number: string;
  filing_date: string;
  registration_number?: string;
  registration_date?: string;
  court_name: string;
  court_number?: string;
  judge_name?: string;
  petitioner: string;
  respondent: string;
  status: string;
  next_hearing_date?: string;
  hearing_history?: HearingDate[];
  last_order?: string;
}

export interface HearingDate {
  date: string;
  purpose: string;
  next_date?: string;
}

/**
 * Case Information (Frontend)
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

export interface CaseDetailResponse extends ApiResponse<Case | CaseResponse> {}

export interface ChatResponse extends ApiResponse<ChatMessage> {}

/**
 * Chat Request
 */
export interface ChatRequest {
  message: string;
  caseId?: string;
  cnr_number?: string;
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
