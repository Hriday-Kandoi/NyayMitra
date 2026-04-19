"use client";

import React, { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { LawyerCard } from "@/components/marketplace/LawyerCard";
import { BookingModal } from "@/components/marketplace/BookingModal";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Search,
  Filter,
  Briefcase,
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
}

function MarketplaceContent() {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [specialization, setSpecialization] = useState("");
  const [minRating, setMinRating] = useState(0);

  // Fetch lawyers on mount
  useEffect(() => {
    fetchLawyers();
  }, []);

  const fetchLawyers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/marketplace/lawyers");

      if (!response.ok) {
        throw new Error("Failed to fetch lawyers");
      }

      const data = await response.json();
      setLawyers(data.data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load lawyers";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter lawyers based on search and filters
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

  const handleBooking = (lawyer: Lawyer) => {
    setSelectedLawyer(lawyer);
    setShowBookingModal(true);
  };

  const handleBookingSuccess = () => {
    setShowBookingModal(false);
    setSelectedLawyer(null);
    // Show success message (optional toast)
  };

  return (
    <div className="min-h-screen bg-[#EEF1F8] pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1A2744] mb-3">
            Find Your Lawyer
          </h1>
          <p className="text-lg text-[#6B7A9A]">
            Browse verified lawyers and book consultations instantly
          </p>
        </div>

        {/* Search and Filters */}
        <Card hoverable>
          <CardContent className="pt-6 space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 text-[#6B7A9A]" size={20} />
              <input
                type="text"
                placeholder="Search by name, specialization, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-[#D4D8E4] rounded-xl focus:outline-none focus:border-[#E07B39] transition-colors"
              />
            </div>

            {/* Filters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#1A2744]">
                  Specialization
                </label>
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-[#D4D8E4] rounded-xl focus:outline-none focus:border-[#E07B39] transition-colors text-[#1A2744]"
                >
                  <option value="">All Specializations</option>
                  <option value="Criminal Law">Criminal Law</option>
                  <option value="Family Law">Family Law</option>
                  <option value="Corporate Law">Corporate Law</option>
                  <option value="Property Law">Property Law</option>
                  <option value="Labor Law">Labor Law</option>
                  <option value="Tax Law">Tax Law</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#1A2744]">
                  Minimum Rating
                </label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="w-full px-4 py-2 border-2 border-[#D4D8E4] rounded-xl focus:outline-none focus:border-[#E07B39] transition-colors text-[#1A2744]"
                >
                  <option value={0}>All Ratings</option>
                  <option value={3}>3+ Stars</option>
                  <option value={4}>4+ Stars</option>
                  <option value={4.5}>4.5+ Stars</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#1A2744]">
                  &nbsp;
                </label>
                <Button
                  onClick={fetchLawyers}
                  variant="outline"
                  fullWidth
                  className="gap-2"
                >
                  <Filter size={18} />
                  Reset Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 flex gap-3">
            <AlertCircle
              size={20}
              className="text-red-500 flex-shrink-0 mt-0.5"
            />
            <div>
              <h3 className="font-semibold text-red-900">Failed to Load Lawyers</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader className="w-8 h-8 text-[#E07B39] animate-spin mx-auto mb-4" />
              <p className="text-[#6B7A9A]">Loading lawyers...</p>
            </div>
          </div>
        )}

        {/* Lawyers Grid */}
        {!isLoading && !error && (
          <>
            {filteredLawyers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLawyers.map((lawyer) => (
                  <LawyerCard
                    key={lawyer.id}
                    lawyer={lawyer}
                    onBook={() => handleBooking(lawyer)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Briefcase
                  size={48}
                  className="text-[#D4D8E4] mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold text-[#1A2744] mb-2">
                  No lawyers found
                </h3>
                <p className="text-[#6B7A9A]">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedLawyer && (
        <BookingModal
          lawyer={selectedLawyer}
          onClose={() => setShowBookingModal(false)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <ProtectedRoute requiredRole="CLIENT">
      <MarketplaceContent />
    </ProtectedRoute>
  );
}
