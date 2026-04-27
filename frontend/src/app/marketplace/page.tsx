"use client";

import React, { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { LawyerCard } from "@/components/marketplace/LawyerCard";
import { LawyerPortfolio } from "@/components/marketplace/LawyerPortfolio";
import { LawyerAvailability } from "@/components/marketplace/LawyerAvailability";
import { Button } from "@/components/ui/Button";
import { fetchLawyers } from "@/lib/api/marketplace";
import { MOCK_LAWYERS } from "@/lib/data/mockLawyers";
import {
  Search,
  Loader,
  AlertCircle,
} from "lucide-react";

interface Lawyer {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  reviewCount: number;
  location: string;
  hourlyRate: number;
  availability: string;
  bio: string;
  profileImage?: string;
  verified: boolean;
  successRate?: number;
  totalCases?: number;
  wonCases?: number;
  settledCases?: number;
  pastCases?: any[];
  certifications?: any[];
}

function MarketplaceContent() {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "detail">("list");
  const [specialization, setSpecialization] = useState("");
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    loadLawyers();
  }, []);

  const loadLawyers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchLawyers();
      const lawyersWithDetails = data.map((lawyer: any) => {
        const mockData = MOCK_LAWYERS.find((m) => m.id === lawyer.id);
        return mockData ? { ...lawyer, ...mockData } : lawyer;
      });
      setLawyers(lawyersWithDetails.length > 0 ? lawyersWithDetails : MOCK_LAWYERS);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load lawyers";
      setError(message);
      setLawyers(MOCK_LAWYERS);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLawyers = lawyers.filter((lawyer) => {
    const matchesSearch =
      lawyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lawyer.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lawyer.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpecialization =
      !specialization || lawyer.specialization === specialization;
    const matchesRating = lawyer.rating >= minRating;

    return matchesSearch && matchesSpecialization && matchesRating;
  });

  const handleSelectLawyer = (lawyer: Lawyer) => {
    setSelectedLawyer(lawyer);
    setViewMode("detail");
  };

  const specializations = Array.from(
    new Set(lawyers.map((l) => l.specialization))
  );

  if (viewMode === "list") {
    return (
      <div className="min-h-screen bg-[#EEF1F8] pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#1A2744] mb-3">
              Find Your Lawyer
            </h1>
            <p className="text-lg text-[#6B7A9A]">
              Connect with verified legal professionals for your case
            </p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7A9A]"
              />
              <input
                type="text"
                placeholder="Search by name, specialization, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-[#D4D8E4] rounded-xl text-[#1A2744] placeholder-[#6B7A9A] focus:outline-none focus:border-[#E07B39]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1A2744] mb-2">
                  Specialization
                </label>
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-[#D4D8E4] rounded-xl text-[#1A2744] focus:outline-none focus:border-[#E07B39]"
                >
                  <option value="">All Specializations</option>
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1A2744] mb-2">
                  Minimum Rating
                </label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border-2 border-[#D4D8E4] rounded-xl text-[#1A2744] focus:outline-none focus:border-[#E07B39]"
                >
                  <option value="0">All Ratings</option>
                  <option value="4">4+ Stars</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.7">4.7+ Stars</option>
                </select>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4 flex gap-3">
              <AlertCircle size={20} className="text-yellow-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-yellow-800">
                  Using sample lawyers data
                </p>
                <p className="text-sm text-yellow-700">{error}</p>
              </div>
            </div>
          )}

          {!isLoading && !error && filteredLawyers.length > 0 && (
            <>
              <p className="text-sm text-[#6B7A9A]">
                Found {filteredLawyers.length} lawyer(s)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLawyers.map((lawyer) => (
                  <div key={lawyer.id} onClick={() => handleSelectLawyer(lawyer)}>
                    <LawyerCard
                      lawyer={lawyer}
                      onBook={() => handleSelectLawyer(lawyer)}
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 text-[#E07B39] animate-spin" />
            </div>
          )}
        </div>
      </div>
    );
  }

  if (viewMode === "detail" && selectedLawyer) {
    return (
      <div className="min-h-screen bg-[#EEF1F8] pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode("list")}
            className="mb-4"
          >
            ← Back to Lawyers
          </Button>

          <LawyerPortfolio 
            lawyer={{
              id: selectedLawyer.id,
              name: selectedLawyer.name,
              specialization: selectedLawyer.specialization,
              experience: selectedLawyer.experience,
              successRate: selectedLawyer.successRate ?? 0,
              totalCases: selectedLawyer.totalCases ?? 0,
              wonCases: selectedLawyer.wonCases ?? 0,
              settledCases: selectedLawyer.settledCases ?? 0,
            }} 
          />
          <LawyerAvailability
            lawyerId={selectedLawyer.id}
            onSelectSlot={(date, time) => console.log("Slot selected:", date, time)}
          />
        </div>
      </div>
    );
  }

  return null;
}

export default function MarketplacePage() {
  return (
    <ProtectedRoute requiredRole="CLIENT">
      <MarketplaceContent />
    </ProtectedRoute>
  );
}
