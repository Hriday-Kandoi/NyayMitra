"use client";

import React, { useState } from "react";
import Link from "next/link";
import { fetchCase } from "@/lib/api/case";
import { CaseResponse } from "@/lib/types";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ArrowRight, AlertCircle, Calendar, Users, FileText } from "lucide-react";

export default function CaseSearchPage() {
  const [cnrNumber, setCnrNumber] = useState<string>("");
  const [caseData, setCaseData] = useState<CaseResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cnrNumber.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const data: CaseResponse = await fetchCase(cnrNumber);
      setCaseData(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to fetch case";
      setError(message);
      setCaseData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string): string => {
    const lower = status.toLowerCase();
    if (lower.includes("active") || lower.includes("pending")) return "#E07B39";
    if (lower.includes("closed") || lower.includes("dismiss")) return "#6B7A9A";
    return "#1A2744";
  };

  return (
    <div className="min-h-screen bg-[#EEF1F8] pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1A2744] mb-3">
            Track Your Case
          </h1>
          <p className="text-lg text-[#6B7A9A]">
            Search by CNR number to find your case details from Indian courts
          </p>
        </div>

        {/* Search Card */}
        <Card hoverable>
          <CardHeader className="bg-[#1A2744]">
            <h2 className="text-2xl font-bold text-white">Search by CNR Number</h2>
            <p className="text-[#6B7A9A] mt-2">Enter your case registration number to view details</p>
          </CardHeader>
          <CardContent className="pt-8">
            <form onSubmit={handleFetchCase} className="space-y-6">
              <Input
                label="CNR Number"
                type="text"
                placeholder="e.g., AP27K123456789012345"
                value={cnrNumber}
                onChange={(e) => setCnrNumber(e.target.value)}
                disabled={isLoading}
                error={error ? "Could not fetch case" : undefined}
                helperText="Format: State (2) + Year (2) + Court (1) + Case number (12)"
              />
              <Button
                type="submit"
                size="lg"
                fullWidth
                isLoading={isLoading}
                disabled={!cnrNumber.trim()}
              >
                {isLoading ? "Searching..." : "Search Case"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 flex gap-3">
            <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Case Not Found</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Case Details */}
        {caseData && (
          <div className="space-y-6">
            {/* Case Header Card */}
            <Card hoverable>
              <CardHeader className="bg-[#1A2744]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-bold text-white">{caseData.case_type}</h2>
                    <p className="text-[#6B7A9A] mt-2">CNR: {caseData.cnr_number}</p>
                  </div>
                  <div
                    className="px-4 py-2 rounded-lg text-white font-semibold text-sm capitalize"
                    style={{ backgroundColor: getStatusColor(caseData.status) }}
                  >
                    {caseData.status}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-8 space-y-8">
                {/* Case Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-[#6B7A9A] uppercase tracking-wider">
                      <FileText size={14} className="inline mr-2" />
                      Filing Number
                    </h3>
                    <p className="text-lg font-semibold text-[#1A2744]">
                      {caseData.filing_number}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-[#6B7A9A] uppercase tracking-wider">
                      <Calendar size={14} className="inline mr-2" />
                      Filing Date
                    </h3>
                    <p className="text-lg font-semibold text-[#1A2744]">
                      {new Date(caseData.filing_date).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-[#6B7A9A] uppercase tracking-wider">
                      Court
                    </h3>
                    <p className="text-lg font-semibold text-[#1A2744]">
                      {caseData.court_name}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-[#6B7A9A] uppercase tracking-wider">
                      <Calendar size={14} className="inline mr-2" />
                      Next Hearing
                    </h3>
                    <p className="text-lg font-semibold text-[#E07B39]">
                      {caseData.next_hearing_date
                        ? new Date(caseData.next_hearing_date).toLocaleDateString("en-IN")
                        : "Not scheduled"}
                    </p>
                  </div>
                </div>

                {/* Parties Section */}
                <div className="border-t border-[#D4D8E4] pt-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold text-[#6B7A9A] uppercase tracking-wider">
                        <Users size={14} className="inline mr-2" />
                        Petitioner
                      </h3>
                      <p className="text-lg font-semibold text-[#1A2744]">
                        {caseData.petitioner}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold text-[#6B7A9A] uppercase tracking-wider">
                        <Users size={14} className="inline mr-2" />
                        Respondent
                      </h3>
                      <p className="text-lg font-semibold text-[#1A2744]">
                        {caseData.respondent}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hearing History */}
                {caseData.hearing_history && caseData.hearing_history.length > 0 && (
                  <div className="border-t border-[#D4D8E4] pt-8">
                    <h3 className="text-xl font-bold text-[#1A2744] mb-6">Hearing History</h3>
                    <div className="space-y-4">
                      {caseData.hearing_history.map((hearing, idx) => (
                        <div
                          key={idx}
                          className="bg-[#EEF1F8] border-l-4 border-[#E07B39] rounded p-4 space-y-2"
                        >
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-[#E07B39]" />
                            <p className="font-semibold text-[#1A2744]">
                              {new Date(hearing.date).toLocaleDateString("en-IN")}
                            </p>
                          </div>
                          <p className="text-[#6B7A9A]">{hearing.purpose}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Last Order */}
                {caseData.last_order && (
                  <div className="border-t border-[#D4D8E4] pt-8">
                    <h3 className="text-sm font-bold text-[#6B7A9A] uppercase tracking-wider mb-3">
                      Last Order
                    </h3>
                    <p className="text-[#1A2744] leading-relaxed">{caseData.last_order}</p>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex gap-3">
                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  onClick={() => {
                    setCaseData(null);
                    setCnrNumber("");
                  }}
                >
                  Search Another
                </Button>
                <Link href={`/chat?cnr=${caseData.cnr_number}`} className="flex-1">
                  <Button size="lg" fullWidth>
                    Get AI Insights <ArrowRight size={18} />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
