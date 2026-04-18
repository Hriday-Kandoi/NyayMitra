import { Case, CaseResponse, CaseListResponse, CaseDetailResponse } from "@/lib/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Fetch case by CNR number from eCourts
 */
export async function fetchCase(cnrNumber: string): Promise<CaseResponse> {
  const response = await fetch(`${API_BASE}/case/${encodeURIComponent(cnrNumber)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch case: ${response.statusText}`);
  }

  const data: CaseDetailResponse = await response.json();
  if (!data.data) {
    throw new Error("No case data returned");
  }

  return data.data as CaseResponse;
}

/**
 * Fetch all cases
 */
export async function getCases(): Promise<Case[]> {
  const response = await fetch(`${API_BASE}/api/cases`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch cases: ${response.statusText}`);
  }

  const data: CaseListResponse = await response.json();
  return data.data || [];
}

/**
 * Fetch a single case by ID
 */
export async function getCaseById(caseId: string): Promise<Case> {
  const response = await fetch(`${API_BASE}/api/cases/${caseId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch case: ${response.statusText}`);
  }

  const data: CaseDetailResponse = await response.json();
  if (!data.data) {
    throw new Error("No case data returned");
  }

  return data.data as Case;
}

/**
 * Create a new case
 */
export async function createCase(caseData: Omit<Case, "id" | "lastUpdated">): Promise<Case> {
  const response = await fetch(`${API_BASE}/api/cases`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(caseData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create case: ${response.statusText}`);
  }

  const data: CaseDetailResponse = await response.json();
  if (!data.data) {
    throw new Error("No case data returned");
  }

  return data.data as Case;
}

/**
 * Update a case
 */
export async function updateCase(caseId: string, updates: Partial<Case>): Promise<Case> {
  const response = await fetch(`${API_BASE}/api/cases/${caseId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error(`Failed to update case: ${response.statusText}`);
  }

  const data: CaseDetailResponse = await response.json();
  if (!data.data) {
    throw new Error("No case data returned");
  }

  return data.data as Case;
}

/**
 * Delete a case
 */
export async function deleteCase(caseId: string): Promise<boolean> {
  const response = await fetch(`${API_BASE}/api/cases/${caseId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.ok;
}
