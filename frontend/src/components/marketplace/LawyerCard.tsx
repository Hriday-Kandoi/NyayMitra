"use client";

import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Star, MapPin, Briefcase, CheckCircle } from "lucide-react";

interface LawyerCardProps {
  lawyer: {
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
  };
  onBook: () => void;
}

export function LawyerCard({ lawyer, onBook }: LawyerCardProps) {
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={
              i < Math.floor(rating)
                ? "fill-[#E07B39] text-[#E07B39]"
                : "text-[#D4D8E4]"
            }
          />
        ))}
      </div>
    );
  };

  return (
    <Card hoverable>
      <CardContent className="pt-6 space-y-4">
        {/* Profile Header */}
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-[#E07B39] to-[#D4A574] rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
            {lawyer.profileImage ? (
              <img
                src={lawyer.profileImage}
                alt={lawyer.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              lawyer.name.charAt(0)
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-[#1A2744]">{lawyer.name}</h3>
              {lawyer.verified && (
                <CheckCircle size={18} className="text-[#E07B39]" />
              )}
            </div>
            <p className="text-sm text-[#6B7A9A]">{lawyer.specialization}</p>
            <div className="flex items-center gap-1 mt-2">
              {renderStars(lawyer.rating)}
              <span className="text-xs text-[#6B7A9A]">
                {lawyer.rating} ({lawyer.reviewCount} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Experience Badge */}
        <div className="bg-[#EEF1F8] rounded-lg px-3 py-2 flex items-center gap-2">
          <Briefcase size={16} className="text-[#E07B39]" />
          <span className="text-sm font-medium text-[#1A2744]">
            {lawyer.experience} years experience
          </span>
        </div>

        {/* Bio */}
        <p className="text-sm text-[#6B7A9A] leading-relaxed line-clamp-2">
          {lawyer.bio}
        </p>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-[#6B7A9A]">
          <MapPin size={16} />
          {lawyer.location}
        </div>

        {/* Availability */}
        <div className="bg-[#F0F7F0] border-l-4 border-green-500 rounded px-3 py-2">
          <p className="text-sm text-green-700">
            <span className="font-semibold">Available:</span> {lawyer.availability}
          </p>
        </div>

        {/* Rate */}
        <div className="flex items-center justify-between pt-2 border-t border-[#D4D8E4]">
          <div>
            <p className="text-2xl font-bold text-[#1A2744]">
              ₹{lawyer.hourlyRate}
              <span className="text-sm text-[#6B7A9A] font-normal">/hr</span>
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="gap-2">
        <Button variant="outline" fullWidth>
          View Profile
        </Button>
        <Button fullWidth onClick={onBook}>
          Book Consultation
        </Button>
      </CardFooter>
    </Card>
  );
}
