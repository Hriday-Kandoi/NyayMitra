"use client";

import React from "react";
import Link from "next/link";
import { Case } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface CaseCardProps {
  case: Case;
}

export function CaseCard({ case: caseData }: CaseCardProps) {
  const getStatusColor = (status: Case["status"]) => {
    const statusColors: Record<Case["status"], string> = {
      active: "text-green-700 bg-green-100",
      closed: "text-gray-700 bg-gray-100",
      pending: "text-yellow-700 bg-yellow-100",
      appeal: "text-blue-700 bg-blue-100",
    };
    return statusColors[status];
  };

  return (
    <Card hoverable className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-[#1A2744] to-[#2a3f5f]">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">{caseData.title}</h3>
            <p className="text-sm text-gray-300">{caseData.caseNumber}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${getStatusColor(
              caseData.status
            )}`}
          >
            {caseData.status}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600 font-medium">Court</p>
            <p className="text-gray-900">{caseData.courtName}</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Case Type</p>
            <p className="text-gray-900">{caseData.caseType || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Filed Date</p>
            <p className="text-gray-900">
              {new Date(caseData.filedDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Next Hearing</p>
            <p className="text-gray-900">
              {caseData.nextHearing
                ? new Date(caseData.nextHearing).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>

        {caseData.description && (
          <div>
            <p className="text-gray-600 font-medium text-sm mb-1">Description</p>
            <p className="text-gray-700 text-sm line-clamp-2">
              {caseData.description}
            </p>
          </div>
        )}

        {caseData.lawyers && caseData.lawyers.length > 0 && (
          <div>
            <p className="text-gray-600 font-medium text-sm mb-1">Assigned Lawyers</p>
            <div className="flex gap-2 flex-wrap">
              {caseData.lawyers.map((lawyer, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                >
                  {lawyer}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <div className="px-6 py-4 border-t border-gray-200 flex gap-2">
        <Link href={`/case/${caseData.id}`} className="flex-1">
          <Button variant="primary" size="sm" className="w-full">
            View Details
          </Button>
        </Link>
        <Link href={`/chat?caseId=${caseData.id}`} className="flex-1">
          <Button variant="secondary" size="sm" className="w-full">
            Ask AI
          </Button>
        </Link>
      </div>
    </Card>
  );
}
