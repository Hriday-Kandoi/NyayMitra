"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCases } from "@/lib/api/case";
import { Case } from "@/lib/types";
import { CaseCard } from "@/components/case/CaseCard";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function DashboardPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAllCases = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const allCases = await getCases();
        setCases(allCases);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch cases";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllCases();
  }, []);

  const handleSelectCase = (caseId: string) => {
    router.push(`/chat?caseId=${caseId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-[#1A2744]">NyayMitra Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Manage and analyze your legal cases with AI assistance
            </p>
          </div>
          <Link href="/case/new">
            <Button variant="secondary">New Case</Button>
          </Link>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-6 py-4 mb-6 text-red-700">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <CasesLoadingSkeleton />
        ) : cases.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <p className="text-gray-600 mb-6 text-lg">No cases found</p>
            <p className="text-gray-500 mb-8">
              Start by searching for a case or create a new one
            </p>
            <div className="space-y-3">
              <Link href="/case">
                <Button variant="primary" className="w-full max-w-xs">
                  Search Cases
                </Button>
              </Link>
              <Link href="/case/new">
                <Button variant="secondary" className="w-full max-w-xs">
                  Create New Case
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* Cases Grid */
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cases.map((caseItem) => (
              <div key={caseItem.id} onClick={() => handleSelectCase(caseItem.id)} className="cursor-pointer">
                <CaseCard case={caseItem} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CasesLoadingSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden animate-pulse"
        >
          <div className="h-24 bg-gradient-to-r from-gray-200 to-gray-300" />
          <div className="px-6 py-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
            <div className="h-3 bg-gray-100 rounded w-2/3" />
          </div>
          <div className="px-6 py-4 flex gap-2 border-t border-gray-200">
            <div className="h-9 bg-gray-200 rounded flex-1" />
            <div className="h-9 bg-gray-200 rounded flex-1" />
          </div>
        </div>
      ))}
    </div>
  );
}
