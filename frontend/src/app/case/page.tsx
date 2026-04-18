"use client";

import React, { useState } from "react";
import { fetchCase } from "@/lib/api/case";
import { CaseResponse } from "@/lib/types";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

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
      const data: any = await fetchCase(cnrNumber);
      setCaseData(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to fetch case";
      setError(message);
      setCaseData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Search Form */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-[#1A2744] to-[#2a3f5f]">
            <h1 className="text-3xl font-bold text-white">Find Your Case</h1>
            <p className="text-gray-300 mt-1">Search by CNR Number from eCourts</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFetchCase} className="space-y-4">
              <Input
                label="CNR Number"
                type="text"
                placeholder="Enter CNR Number (e.g., AP27K123456789012345)"
                value={cnrNumber}
                onChange={(e) => setCnrNumber(e.target.value)}
                disabled={isLoading}
                error={error ? "Failed to fetch case" : undefined}
                helperText="Format: State+Year+Court+Case number"
              />
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                isLoading={isLoading}
              >
                Search Case
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-6 py-4 text-red-700">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Case Details */}
        {caseData && (
          <Card>
            <CardHeader className="bg-gradient-to-r from-[#1A2744] to-[#2a3f5f]">
              <h2 className="text-2xl font-bold text-white">{caseData.case_type}</h2>
              <p className="text-gray-300 mt-1">CNR: {caseData.cnr_number}</p>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">
                    Filing Date
                  </h3>
                  <p className="text-lg text-gray-900">{caseData.filing_date}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">
                    Status
                  </h3>
                  <p className="text-lg text-gray-900 capitalize">{caseData.status}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">
                    Court Name
                  </h3>
                  <p className="text-lg text-gray-900">{caseData.court_name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">
                    Judge
                  </h3>
                  <p className="text-lg text-gray-900">{caseData.judge_name || "Not assigned"}</p>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">
                      Petitioner
                    </h3>
                    <p className="text-gray-900">{caseData.petitioner}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">
                      Respondent
                    </h3>
                    <p className="text-gray-900">{caseData.respondent}</p>
                  </div>
                </div>
              </div>

              {caseData.hearing_history && caseData.hearing_history.length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="text-sm font-semibold text-gray-600 uppercase mb-4">
                    Hearing History
                  </h3>
                  <div className="space-y-3">
                    {caseData.hearing_history.map((hearing, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 border border-gray-200 rounded p-4"
                      >
                        <p className="font-medium text-gray-900">{hearing.purpose}</p>
                        <p className="text-sm text-gray-600">Date: {hearing.date}</p>
                        {hearing.next_date && (
                          <p className="text-sm text-[#E07B39] font-medium">
                            Next: {hearing.next_date}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter>
              <Link href={`/chat?cnr=${caseData.cnr_number}`} className="flex-1">
                <Button variant="secondary" className="w-full">
                  Ask AI About This Case
                </Button>
              </Link>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
                  <p className="text-lg text-gray-900">{caseData.court_name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">
                    Next Hearing
                  </h3>
                  <p className="text-lg text-gray-900">
                    {caseData.next_hearing_date || "N/A"}
                  </p>
                </div>
              </div>

              {/* Petitioner & Respondent */}
              <div className="border-t pt-6 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">
                    Petitioner
                  </h3>
                  <p className="text-gray-900">{caseData.petitioner}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">
                    Respondent
                  </h3>
                  <p className="text-gray-900">{caseData.respondent}</p>
                </div>
              </div>

              {/* Hearing History */}
              {caseData.hearing_history && caseData.hearing_history.length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Hearing History
                  </h3>
                  <div className="space-y-3">
                    {caseData.hearing_history.map((hearing, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 p-4 rounded-md border border-gray-200"
                      >
                        <p className="font-medium text-gray-900">{hearing.date}</p>
                        <p className="text-sm text-gray-600 mt-1">{hearing.purpose}</p>
                        <p className="text-xs text-gray-500 mt-1">{hearing.court}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter>
              <Button
                variant="secondary"
                onClick={() => {
                  setCaseData(null);
                  setCnrNumber("");
                }}
              >
                Search Again
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
