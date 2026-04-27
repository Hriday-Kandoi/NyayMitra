import { MOCK_LAWYERS } from "@/lib/data/mockLawyers";

interface LawyerListResponse {
  success: boolean;
  data: Lawyer[];
}

interface BookingRequest {
  lawyer_id: string;
  date: string;
  time: string;
  duration: number;
  reason: string;
  total_amount: number;
}

interface BookingResponse {
  success: boolean;
  data?: {
    id: string;
    booking_id: string;
    date: string;
    time: string;
    status: string;
  };
  error?: string;
}

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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/**
 * Fetch all lawyers or filtered list
 */
export async function fetchLawyers(
  specialization?: string,
  minRating?: number
): Promise<Lawyer[]> {
  try {
    const params = new URLSearchParams();
    if (specialization) params.append("specialization", specialization);
    if (minRating) params.append("min_rating", minRating.toString());

    const response = await fetch(
      `${API_BASE_URL}/marketplace/lawyers?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch lawyers");
    }

    const data: LawyerListResponse = await response.json();
    return data.data || [];
  } catch (error) {
    // Fallback to mock data in development
    console.log("Using mock lawyers data...");
    let filtered = [...MOCK_LAWYERS];
    
    if (specialization) {
      filtered = filtered.filter(
        (l) => l.specialization.toLowerCase() === specialization.toLowerCase()
      );
    }
    
    if (minRating) {
      filtered = filtered.filter((l) => l.rating >= minRating);
    }
    
    return filtered;
  }
}

/**
 * Get single lawyer details
 */
export async function fetchLawyerById(lawyerId: string): Promise<Lawyer> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/marketplace/lawyers/${lawyerId}`
    );

    if (!response.ok) {
      throw new Error("Lawyer not found");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching lawyer:", error);
    throw error;
  }
}

/**
 * Book a consultation with a lawyer
 */
export async function bookConsultation(
  booking: BookingRequest,
  idToken: string
): Promise<BookingResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/marketplace/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify(booking),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to book consultation");
    }

    return await response.json();
  } catch (error) {
    console.error("Error booking consultation:", error);
    throw error;
  }
}

/**
 * Get user's bookings
 */
export async function fetchUserBookings(idToken: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/marketplace/bookings`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch bookings");
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
}

/**
 * Cancel a booking
 */
export async function cancelBooking(
  bookingId: string,
  idToken: string
): Promise<{ success: boolean }> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/marketplace/bookings/${bookingId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to cancel booking");
    }

    return await response.json();
  } catch (error) {
    console.error("Error canceling booking:", error);
    throw error;
  }
}

/**
 * Get lawyer's available time slots
 */
export async function fetchAvailableSlots(
  lawyerId: string,
  date: string
): Promise<string[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/marketplace/lawyers/${lawyerId}/slots?date=${date}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch available slots");
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching available slots:", error);
    throw error;
  }
}

/**
 * Leave a review for a lawyer
 */
export async function submitReview(
  lawyerId: string,
  rating: number,
  comment: string,
  idToken: string
) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/marketplace/lawyers/${lawyerId}/reviews`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          rating,
          comment,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to submit review");
    }

    return await response.json();
  } catch (error) {
    console.error("Error submitting review:", error);
    throw error;
  }
}
