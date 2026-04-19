"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { AlertCircle, X, Calendar, Clock } from "lucide-react";

interface BookingModalProps {
  lawyer: {
    id: string;
    name: string;
    hourlyRate: number;
  };
  onClose: () => void;
  onSuccess: () => void;
}

export function BookingModal({ lawyer, onClose, onSuccess }: BookingModalProps) {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    duration: "1", // in hours
    reason: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateTotal = (): number => {
    return lawyer.hourlyRate * parseInt(formData.duration || "1");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.date || !formData.time || !formData.reason.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/marketplace/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lawyer_id: lawyer.id,
          date: formData.date,
          time: formData.time,
          duration: parseInt(formData.duration),
          reason: formData.reason,
          total_amount: calculateTotal(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to book consultation");
      }

      onSuccess();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to book consultation";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="bg-[#1A2744] px-6 py-4 rounded-t-2xl flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Book Consultation</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-[#2A3A54] rounded-lg p-1 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Lawyer Info */}
          <div className="bg-[#EEF1F8] rounded-lg p-4">
            <p className="text-sm text-[#6B7A9A] mb-1">Booking with</p>
            <p className="text-lg font-bold text-[#1A2744]">{lawyer.name}</p>
            <p className="text-sm text-[#E07B39] font-semibold">
              ₹{lawyer.hourlyRate}/hour
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-3 flex gap-2">
              <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Date Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#1A2744]">
              <Calendar size={16} className="inline mr-2" />
              Select Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              disabled={isLoading}
              className="w-full px-4 py-2 border-2 border-[#D4D8E4] rounded-xl focus:outline-none focus:border-[#E07B39] transition-colors disabled:bg-gray-100"
            />
          </div>

          {/* Time Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#1A2744]">
              <Clock size={16} className="inline mr-2" />
              Select Time
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              disabled={isLoading}
              className="w-full px-4 py-2 border-2 border-[#D4D8E4] rounded-xl focus:outline-none focus:border-[#E07B39] transition-colors disabled:bg-gray-100"
            />
          </div>

          {/* Duration Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#1A2744]">
              Duration (hours)
            </label>
            <select
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              disabled={isLoading}
              className="w-full px-4 py-2 border-2 border-[#D4D8E4] rounded-xl focus:outline-none focus:border-[#E07B39] transition-colors disabled:bg-gray-100"
            >
              <option value="1">1 hour</option>
              <option value="2">2 hours</option>
              <option value="3">3 hours</option>
              <option value="4">4 hours</option>
            </select>
          </div>

          {/* Reason Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#1A2744]">
              Reason for Consultation
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              disabled={isLoading}
              placeholder="Briefly describe what you need help with..."
              rows={3}
              className="w-full px-4 py-2 border-2 border-[#D4D8E4] rounded-xl focus:outline-none focus:border-[#E07B39] transition-colors disabled:bg-gray-100 resize-none"
            />
          </div>

          {/* Price Summary */}
          <div className="bg-[#EEF1F8] rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[#6B7A9A]">Hourly Rate</span>
              <span className="text-[#1A2744] font-semibold">
                ₹{lawyer.hourlyRate}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#6B7A9A]">Duration</span>
              <span className="text-[#1A2744] font-semibold">
                {formData.duration} hour{formData.duration !== "1" ? "s" : ""}
              </span>
            </div>
            <div className="border-t border-[#D4D8E4] pt-2 flex items-center justify-between">
              <span className="font-bold text-[#1A2744]">Total Amount</span>
              <span className="text-2xl font-bold text-[#E07B39]">
                ₹{calculateTotal()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              disabled={isLoading || !formData.date || !formData.time}
            >
              {isLoading ? "Booking..." : "Confirm Booking"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
