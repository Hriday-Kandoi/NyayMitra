"""
Marketplace service for lawyer-related business logic.
Handles lawyer profile management, rating calculations, and availability checks.
"""

from firebase_admin import firestore
from datetime import datetime
from typing import List, Optional, Dict

db = firestore.client()


class LawyerService:
    """Service for managing lawyer profiles and marketplace operations."""

    @staticmethod
    def create_lawyer_profile(
        uid: str,
        name: str,
        specialization: str,
        experience: int,
        location: str,
        hourly_rate: int,
        bio: str,
        languages: List[str] = None,
        certifications: List[str] = None,
    ) -> bool:
        """
        Create a new lawyer profile in Firestore.

        Args:
            uid: Firebase UID of lawyer
            name: Lawyer's full name
            specialization: Area of law specialization
            experience: Years of experience
            location: City/location where lawyer practices
            hourly_rate: Consultation rate in rupees per hour
            bio: Short bio about the lawyer
            languages: List of languages spoken
            certifications: List of legal certifications

        Returns:
            True if profile created successfully
        """
        try:
            lawyer_data = {
                "uid": uid,
                "name": name,
                "specialization": specialization,
                "experience": experience,
                "location": location,
                "hourly_rate": hourly_rate,
                "bio": bio,
                "rating": 0.0,
                "review_count": 0,
                "verified": False,
                "available": True,
                "total_clients": 0,
                "total_consultations": 0,
                "languages": languages or ["English", "Hindi"],
                "certifications": certifications or [],
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat(),
            }

            db.collection("lawyers").document(uid).set(lawyer_data)
            return True

        except Exception as e:
            print(f"Error creating lawyer profile: {e}")
            return False

    @staticmethod
    def update_lawyer_profile(
        uid: str, update_data: Dict
    ) -> bool:
        """
        Update lawyer profile information.

        Args:
            uid: Firebase UID of lawyer
            update_data: Dictionary of fields to update

        Returns:
            True if profile updated successfully
        """
        try:
            update_data["updated_at"] = datetime.now().isoformat()
            db.collection("lawyers").document(uid).update(update_data)
            return True

        except Exception as e:
            print(f"Error updating lawyer profile: {e}")
            return False

    @staticmethod
    def get_lawyer_stats(uid: str) -> Dict:
        """
        Get statistics for a lawyer's profile.

        Args:
            uid: Firebase UID of lawyer

        Returns:
            Dictionary with lawyer statistics
        """
        try:
            doc = db.collection("lawyers").document(uid).get()

            if not doc.exists:
                return None

            lawyer_data = doc.to_dict()

            # Count completed bookings
            completed_bookings = (
                db.collection("bookings")
                .where("lawyer_uid", "==", uid)
                .where("status", "==", "completed")
                .stream()
            )
            total_consultations = len(list(completed_bookings))

            # Count unique clients
            completed_docs = (
                db.collection("bookings")
                .where("lawyer_uid", "==", uid)
                .where("status", "==", "completed")
                .stream()
            )
            unique_clients = len(
                set(doc.to_dict().get("client_uid") for doc in completed_docs)
            )

            # Calculate average rating
            reviews = (
                db.collection("lawyers")
                .document(uid)
                .collection("reviews")
                .stream()
            )
            reviews_list = [doc.to_dict() for doc in reviews]
            avg_rating = (
                sum(r.get("rating", 0) for r in reviews_list) / len(reviews_list)
                if reviews_list
                else 0.0
            )

            return {
                "total_consultations": total_consultations,
                "unique_clients": unique_clients,
                "average_rating": round(avg_rating, 1),
                "review_count": len(reviews_list),
                "hourly_rate": lawyer_data.get("hourly_rate"),
                "experience": lawyer_data.get("experience"),
                "verified": lawyer_data.get("verified"),
            }

        except Exception as e:
            print(f"Error getting lawyer stats: {e}")
            return None

    @staticmethod
    def get_availability(uid: str, date: str) -> List[str]:
        """
        Get available time slots for a lawyer on a given date.

        Args:
            uid: Firebase UID of lawyer
            date: Date in YYYY-MM-DD format

        Returns:
            List of available time slots (HH:MM format)
        """
        try:
            # Default available slots
            all_slots = [
                "09:00",
                "10:00",
                "11:00",
                "12:00",
                "14:00",
                "15:00",
                "16:00",
                "17:00",
            ]

            # Get booked slots
            bookings = (
                db.collection("bookings")
                .where("lawyer_uid", "==", uid)
                .where("date", "==", date)
                .where("status", "!=", "cancelled")
                .stream()
            )

            booked_times = set()
            for booking in bookings:
                booking_data = booking.to_dict()
                booked_times.add(booking_data.get("time"))

            available_slots = [slot for slot in all_slots if slot not in booked_times]
            return available_slots

        except Exception as e:
            print(f"Error getting availability: {e}")
            return []

    @staticmethod
    def verify_lawyer(uid: str) -> bool:
        """
        Mark lawyer as KYC verified.

        Args:
            uid: Firebase UID of lawyer

        Returns:
            True if verification successful
        """
        try:
            db.collection("lawyers").document(uid).update(
                {
                    "verified": True,
                    "updated_at": datetime.now().isoformat(),
                }
            )
            return True

        except Exception as e:
            print(f"Error verifying lawyer: {e}")
            return False

    @staticmethod
    def get_lawyer_reviews(uid: str, limit: int = 10) -> List[Dict]:
        """
        Get reviews for a lawyer.

        Args:
            uid: Firebase UID of lawyer
            limit: Maximum number of reviews to fetch

        Returns:
            List of review dictionaries
        """
        try:
            reviews = (
                db.collection("lawyers")
                .document(uid)
                .collection("reviews")
                .order_by("created_at", direction=firestore.Query.DESCENDING)
                .limit(limit)
                .stream()
            )

            reviews_list = []
            for doc in reviews:
                review_data = doc.to_dict()
                review_data["id"] = doc.id
                reviews_list.append(review_data)

            return reviews_list

        except Exception as e:
            print(f"Error getting reviews: {e}")
            return []

    @staticmethod
    def search_lawyers(
        specialization: Optional[str] = None,
        min_rating: Optional[float] = None,
        location: Optional[str] = None,
        available_only: bool = True,
    ) -> List[Dict]:
        """
        Search for lawyers with filters.

        Args:
            specialization: Filter by specialization
            min_rating: Minimum rating filter
            location: Filter by location
            available_only: Only show available lawyers

        Returns:
            List of lawyer profiles matching criteria
        """
        try:
            query = db.collection("lawyers")

            if available_only:
                query = query.where("available", "==", True)

            if specialization:
                query = query.where("specialization", "==", specialization)

            docs = query.stream()

            lawyers = []
            for doc in docs:
                lawyer_data = doc.to_dict()
                lawyer_data["id"] = doc.id

                # Filter by rating
                if min_rating and lawyer_data.get("rating", 0) < min_rating:
                    continue

                # Filter by location
                if location and location.lower() not in lawyer_data.get(
                    "location", ""
                ).lower():
                    continue

                lawyers.append(lawyer_data)

            # Sort by rating
            lawyers.sort(key=lambda x: x.get("rating", 0), reverse=True)

            return lawyers

        except Exception as e:
            print(f"Error searching lawyers: {e}")
            return []

    @staticmethod
    def get_top_lawyers(limit: int = 10) -> List[Dict]:
        """
        Get top-rated lawyers.

        Args:
            limit: Maximum number of lawyers to return

        Returns:
            List of top-rated lawyer profiles
        """
        try:
            docs = (
                db.collection("lawyers")
                .where("verified", "==", True)
                .where("available", "==", True)
                .order_by("rating", direction=firestore.Query.DESCENDING)
                .limit(limit)
                .stream()
            )

            lawyers = []
            for doc in docs:
                lawyer_data = doc.to_dict()
                lawyer_data["id"] = doc.id
                lawyers.append(lawyer_data)

            return lawyers

        except Exception as e:
            print(f"Error getting top lawyers: {e}")
            return []
