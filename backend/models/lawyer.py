from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class LawyerProfile(BaseModel):
    """
    Lawyer profile model for marketplace.
    Stored in Firestore at: lawyers/{lawyer_uid}
    """

    uid: str = Field(..., description="Firebase UID of lawyer")
    name: str = Field(..., description="Lawyer's full name")
    specialization: str = Field(..., description="Area of law specialization")
    experience: int = Field(..., description="Years of experience")
    rating: float = Field(default=0.0, description="Average rating (0-5)")
    review_count: int = Field(default=0, description="Number of reviews")
    location: str = Field(..., description="City/location where lawyer practices")
    hourly_rate: int = Field(..., description="Consultation rate in rupees per hour")
    bio: str = Field(..., description="Short bio about the lawyer")
    profile_image_url: Optional[str] = Field(None, description="Profile photo URL")
    verified: bool = Field(default=False, description="KYC verification status")
    available: bool = Field(default=True, description="Availability status")
    total_clients: int = Field(default=0, description="Number of clients served")
    total_consultations: int = Field(default=0, description="Total consultations done")
    languages: List[str] = Field(default=["English", "Hindi"], description="Languages spoken")
    certifications: List[str] = Field(default=[], description="Legal certifications")
    created_at: Optional[datetime] = Field(None, description="Profile creation date")
    updated_at: Optional[datetime] = Field(None, description="Last update date")

    class Config:
        json_schema_extra = {
            "example": {
                "uid": "lawyer123",
                "name": "Adv. Priya Sharma",
                "specialization": "Family Law",
                "experience": 10,
                "rating": 4.8,
                "review_count": 45,
                "location": "Mumbai, Maharashtra",
                "hourly_rate": 1500,
                "bio": "Expert in family law matters with 10 years experience",
                "profile_image_url": "https://...",
                "verified": True,
                "available": True,
                "total_clients": 150,
                "total_consultations": 500,
                "languages": ["English", "Hindi", "Marathi"],
                "certifications": ["BA Law", "LLB", "ADR Certified"],
                "created_at": "2024-01-15T10:30:00Z",
                "updated_at": "2024-04-19T14:30:00Z",
            }
        }


class Booking(BaseModel):
    """
    Booking model for lawyer consultations.
    Stored in Firestore at: bookings/{booking_id}
    """

    id: str = Field(..., description="Unique booking ID")
    client_uid: str = Field(..., description="Firebase UID of client")
    lawyer_uid: str = Field(..., description="Firebase UID of lawyer")
    date: str = Field(..., description="Consultation date (YYYY-MM-DD)")
    time: str = Field(..., description="Consultation time (HH:MM)")
    duration: int = Field(..., description="Duration in hours")
    reason: str = Field(..., description="Reason for consultation")
    total_amount: int = Field(..., description="Total amount in rupees")
    status: str = Field(
        default="pending",
        description="Booking status: pending, confirmed, completed, cancelled",
    )
    payment_status: str = Field(
        default="pending",
        description="Payment status: pending, completed, refunded",
    )
    meeting_link: Optional[str] = Field(None, description="Video call meeting link")
    notes: Optional[str] = Field(None, description="Additional notes")
    created_at: Optional[datetime] = Field(None, description="Booking creation date")
    updated_at: Optional[datetime] = Field(None, description="Last update date")

    class Config:
        json_schema_extra = {
            "example": {
                "id": "booking123",
                "client_uid": "client456",
                "lawyer_uid": "lawyer789",
                "date": "2024-05-15",
                "time": "14:30",
                "duration": 1,
                "reason": "Need legal advice on property dispute",
                "total_amount": 1500,
                "status": "confirmed",
                "payment_status": "completed",
                "meeting_link": "https://meet.google.com/...",
                "notes": "Bring property documents",
                "created_at": "2024-04-19T10:30:00Z",
                "updated_at": "2024-04-19T10:35:00Z",
            }
        }


class BookingRequest(BaseModel):
    """Request model for creating a booking"""

    lawyer_id: str = Field(..., description="Lawyer's Firebase UID")
    date: str = Field(..., description="Consultation date (YYYY-MM-DD)")
    time: str = Field(..., description="Consultation time (HH:MM)")
    duration: int = Field(..., ge=1, le=8, description="Duration in hours (1-8)")
    reason: str = Field(..., min_length=10, description="Reason for consultation")
    total_amount: int = Field(..., description="Total amount in rupees")


class BookingResponse(BaseModel):
    """Response model for booking operations"""

    success: bool
    data: Optional[dict] = None
    error: Optional[str] = None


class Review(BaseModel):
    """
    Review/rating model for lawyer services.
    Stored in Firestore at: lawyers/{lawyer_uid}/reviews/{review_id}
    """

    id: str = Field(..., description="Unique review ID")
    client_uid: str = Field(..., description="Firebase UID of reviewer")
    rating: int = Field(..., ge=1, le=5, description="Rating out of 5")
    comment: str = Field(..., description="Review comment")
    created_at: Optional[datetime] = Field(None, description="Review creation date")

    class Config:
        json_schema_extra = {
            "example": {
                "id": "review123",
                "client_uid": "client456",
                "rating": 5,
                "comment": "Excellent legal advice and very responsive",
                "created_at": "2024-04-19T10:30:00Z",
            }
        }
