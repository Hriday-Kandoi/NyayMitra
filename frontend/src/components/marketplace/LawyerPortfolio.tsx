"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import {
  Award,
  TrendingUp,
  FileText,
  CheckCircle,
  Shield,
} from "lucide-react";

interface CaseDetails {
  title: string;
  year: number;
  outcome: "won" | "settled" | "ongoing";
  type: string;
}

interface Certification {
  name: string;
  issuer: string;
  year: number;
}

interface LawyerPortfolioProps {
  lawyer: {
    id: string;
    name: string;
    specialization: string;
    experience: number;
    successRate: number;
    totalCases: number;
    wonCases: number;
    settledCases: number;
  };
  pastCases?: CaseDetails[];
  certifications?: Certification[];
}

export function LawyerPortfolio({
  lawyer,
  pastCases = [],
  certifications = [],
}: LawyerPortfolioProps) {
  const outcomeColors = {
    won: "bg-green-100 text-green-700 border-green-200",
    settled: "bg-blue-100 text-blue-700 border-blue-200",
    ongoing: "bg-yellow-100 text-yellow-700 border-yellow-200",
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Success Rate */}
        <Card hoverable>
          <CardContent className="pt-6 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#6B7A9A] text-sm font-medium">Success Rate</p>
                <p className="text-3xl font-bold text-[#E07B39] mt-1">
                  {lawyer.successRate}%
                </p>
              </div>
              <div className="bg-[#EEF1F8] p-3 rounded-lg">
                <TrendingUp size={24} className="text-[#E07B39]" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Cases */}
        <Card hoverable>
          <CardContent className="pt-6 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#6B7A9A] text-sm font-medium">Total Cases</p>
                <p className="text-3xl font-bold text-[#1A2744] mt-1">
                  {lawyer.totalCases}
                </p>
              </div>
              <div className="bg-[#EEF1F8] p-3 rounded-lg">
                <FileText size={24} className="text-[#1A2744]" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Won Cases */}
        <Card hoverable>
          <CardContent className="pt-6 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#6B7A9A] text-sm font-medium">Cases Won</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {lawyer.wonCases}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle size={24} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Past Cases Section */}
      {pastCases.length > 0 && (
        <Card>
          <CardHeader className="bg-gradient-to-r from-[#1A2744] to-[#2a3f5f]">
            <div className="flex items-center gap-2">
              <Shield size={20} className="text-white" />
              <h3 className="text-xl font-bold text-white">Notable Cases</h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {pastCases.map((caseItem, idx) => (
              <div
                key={idx}
                className="border-l-4 border-[#E07B39] pl-4 py-3 hover:bg-[#EEF1F8]/50 transition-colors rounded"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-[#1A2744]">
                      {caseItem.title}
                    </h4>
                    <p className="text-sm text-[#6B7A9A]">
                      {caseItem.type} • {caseItem.year}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      outcomeColors[caseItem.outcome]
                    }`}
                  >
                    {caseItem.outcome.charAt(0).toUpperCase() +
                      caseItem.outcome.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Certifications Section */}
      {certifications.length > 0 && (
        <Card>
          <CardHeader className="bg-gradient-to-r from-[#E07B39] to-[#d46b2a]">
            <div className="flex items-center gap-2">
              <Award size={20} className="text-white" />
              <h3 className="text-xl font-bold text-white">
                Certifications & Qualifications
              </h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-6">
            {certifications.map((cert, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 pb-3 border-b border-[#D4D8E4] last:border-0"
              >
                <div className="bg-[#EEF1F8] p-2 rounded-lg flex-shrink-0">
                  <Award size={18} className="text-[#E07B39]" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[#1A2744]">{cert.name}</p>
                  <p className="text-sm text-[#6B7A9A]">
                    {cert.issuer} • {cert.year}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
