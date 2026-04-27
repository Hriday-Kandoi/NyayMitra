"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Calendar, Clock, CheckCircle } from "lucide-react";

interface TimeSlot {
  time: string;
  available: boolean;
}

interface AvailabilityDay {
  date: string;
  dayName: string;
  slots: TimeSlot[];
}

interface LawyerAvailabilityProps {
  lawyerId: string;
  availability?: AvailabilityDay[];
  onSelectSlot: (date: string, time: string) => void;
}

export function LawyerAvailability({
  lawyerId: _lawyerId,
  availability = [],
  onSelectSlot,
}: LawyerAvailabilityProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Generate mock availability if not provided
  const mockAvailability = availability.length === 0 
    ? generateMockAvailability()
    : availability;

  function generateMockAvailability(): AvailabilityDay[] {
    const days: AvailabilityDay[] = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      const dayName = date.toLocaleDateString("en-IN", { weekday: "short" });
      
      days.push({
        date: dateStr,
        dayName: `${dayName}, ${date.getDate()}`,
        slots: [
          { time: "09:00", available: i % 2 === 0 },
          { time: "10:00", available: true },
          { time: "11:00", available: true },
          { time: "14:00", available: i % 3 !== 0 },
          { time: "15:00", available: true },
          { time: "16:00", available: true },
        ],
      });
    }
    
    return days;
  }

  const currentDay =
    selectedDate ? mockAvailability.find((d) => d.date === selectedDate) : undefined;

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-[#1A2744] to-[#2a3f5f]">
        <div className="flex items-center gap-2">
          <Calendar size={20} className="text-white" />
          <h3 className="text-xl font-bold text-white">Available Time Slots</h3>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Calendar - Select Date */}
          <div>
            <h4 className="font-semibold text-[#1A2744] mb-3">
              Select a Date
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {mockAvailability.map((day) => (
                <button
                  key={day.date}
                  onClick={() => setSelectedDate(day.date)}
                  className={`p-3 rounded-lg transition-all duration-200 border-2 font-medium text-sm text-center ${
                    selectedDate === day.date
                      ? "border-[#E07B39] bg-[#E07B39] text-white"
                      : "border-[#D4D8E4] bg-white text-[#1A2744] hover:border-[#E07B39]"
                  }`}
                >
                  <div className="text-xs opacity-80">{day.dayName.split(",")[0]}</div>
                  <div>{day.date.split("-")[2]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Time Slots - Select Time */}
          {currentDay && (
            <div>
              <h4 className="font-semibold text-[#1A2744] mb-3">
                Select a Time
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {currentDay.slots.map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() =>
                      slot.available && setSelectedTime(slot.time)
                    }
                    disabled={!slot.available}
                    className={`p-3 rounded-lg transition-all duration-200 border-2 font-medium text-sm ${
                      !slot.available
                        ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed opacity-50"
                        : selectedTime === slot.time
                        ? "border-[#E07B39] bg-[#E07B39] text-white"
                        : "border-[#D4D8E4] bg-white text-[#1A2744] hover:border-[#E07B39]"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <Clock size={14} />
                      {slot.time}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Confirmation Button */}
          {selectedDate && selectedTime && (
            <div className="bg-[#EEF1F8] rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle size={18} />
                <span className="font-semibold">Slot Selected</span>
              </div>
              <p className="text-[#6B7A9A] text-sm">
                {currentDay?.dayName} at {selectedTime}
              </p>
              <Button
                className="w-full"
                onClick={() => onSelectSlot(selectedDate, selectedTime)}
              >
                Confirm & Proceed to Booking
              </Button>
            </div>
          )}

          {!selectedDate && (
            <div className="bg-[#F5F7FA] rounded-lg p-4 text-center text-[#6B7A9A] text-sm">
              Select a date to view available time slots
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
