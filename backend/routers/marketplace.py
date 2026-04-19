from fastapi import APIRouter, HTTPException, Header, Query
from typing import Optional, List
from datetime import datetime
from backend.models.lawyer import LawyerProfile, Booking, BookingRequest, Review
import firebase_admin
from firebase_admin import auth, firestore

# Initialize Firebase Admin SDK if not already done
if not firebase_admin._apps:
    try:
        from firebase_admin import credentials
        from backend.core.config import config

        cred = credentials.Certificate(config.FIREBASE_SERVICE_ACCOUNT_KEY_PATH)
        firebase_admin.initialize_app(cred)
    except Exception as e:
        print(f"Warning: Could not initialize Firebase Admin SDK: {e}")

router = APIRouter(prefix="/marketplace", tags=["Marketplace"])
db = firestore.client()


@router.get("/lawyers", response_model=dict)
async def get_lawyers(
    specialization: Optional[str] = Query(None),
    min_rating: Optional[float] = Query(None),
    available_only: bool = Query(True),
):
    """
    Get list of lawyers with optional filtering.
    """
    try:
        query = db.collection("lawyers")

        # Apply filters
        if available_only:
            query = query.where("available", "==", True)

        if specialization:
            query = query.where("specialization", "==", specialization)

        docs = query.stream()

        lawyers = []
        for doc in docs:
            lawyer_data = doc.to_dict()
            lawyer_data["id"] = doc.id

            # Filter by rating if specified
            if min_rating and lawyer_data.get("rating", 0) < min_rating:
                continue

            lawyers.append(lawyer_data)

        # Sort by rating (highest first)
        lawyers.sort(key=lambda x: x.get("rating", 0), reverse=True)

        return {
            "success": True,
            "data": lawyers,
            "count": len(lawyers),
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/lawyers/{lawyer_id}")
async def get_lawyer(lawyer_id: str):
    """
    Get single lawyer's full profile.
    """
    try:
        doc = db.collection("lawyers").document(lawyer_id).get()

        if not doc.exists:
            raise HTTPException(status_code=404, detail="Lawyer not found")

        lawyer_data = doc.to_dict()
        lawyer_data["id"] = doc.id

        return {"success": True, "data": lawyer_data}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/lawyers/{lawyer_id}/slots")
async def get_available_slots(lawyer_id: str, date: str):
    """
    Get available time slots for a lawyer on a given date.
    """
    try:
        # Mock implementation - in real scenario, fetch from calendar/booking system
        available_slots = [
            "09:00",
            "10:00",
            "11:00",
            "14:00",
            "15:00",
            "16:00",
            "17:00",
        ]

        # Filter out booked slots (check if there are existing bookings)
        bookings = (
            db.collection("bookings")
            .where("lawyer_uid", "==", lawyer_id)
            .where("date", "==", date)
            .where("status", "!=", "cancelled")
            .stream()
        )

        booked_times = set()
        for booking in bookings:
            booking_data = booking.to_dict()
            booked_times.add(booking_data.get("time"))

        available_slots = [slot for slot in available_slots if slot not in booked_times]

        return {"success": True, "data": available_slots}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/bookings")
async def create_booking(
    booking: BookingRequest, id_token: str = Header(None)
):
    """
    Create a new booking for lawyer consultation.
    """
    if not id_token:
        raise HTTPException(status_code=401, detail="Authorization required")

    try:
        # Verify the token
        decoded_token = auth.verify_id_token(id_token)
        client_uid = decoded_token.get("uid")

        if not client_uid:
            raise HTTPException(status_code=401, detail="Invalid token")

        # Check if lawyer exists
        lawyer_doc = db.collection("lawyers").document(booking.lawyer_id).get()
        if not lawyer_doc.exists:
            raise HTTPException(status_code=404, detail="Lawyer not found")

        # Check for conflicts
        existing_bookings = (
            db.collection("bookings")
            .where("lawyer_uid", "==", booking.lawyer_id)
            .where("date", "==", booking.date)
            .where("time", "==", booking.time)
            .where("status", "!=", "cancelled")
            .stream()
        )

        if list(existing_bookings):
            raise HTTPException(
                status_code=400,
                detail="Time slot already booked. Please select another time.",
            )

        # Create booking document
        booking_ref = db.collection("bookings").document()
        booking_data = {
            "client_uid": client_uid,
            "lawyer_uid": booking.lawyer_id,
            "date": booking.date,
            "time": booking.time,
            "duration": booking.duration,
            "reason": booking.reason,
            "total_amount": booking.total_amount,
            "status": "pending",
            "payment_status": "pending",
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat(),
        }

        booking_ref.set(booking_data)

        return {
            "success": True,
            "data": {
                "booking_id": booking_ref.id,
                "date": booking.date,
                "time": booking.time,
                "status": "pending",
            },
        }

    except auth.InvalidIdTokenError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/bookings")
async def get_user_bookings(id_token: str = Header(None)):
    """
    Get all bookings for authenticated user.
    """
    if not id_token:
        raise HTTPException(status_code=401, detail="Authorization required")

    try:
        decoded_token = auth.verify_id_token(id_token)
        client_uid = decoded_token.get("uid")

        if not client_uid:
            raise HTTPException(status_code=401, detail="Invalid token")

        docs = (
            db.collection("bookings")
            .where("client_uid", "==", client_uid)
            .order_by("date", direction=firestore.Query.DESCENDING)
            .stream()
        )

        bookings = []
        for doc in docs:
            booking_data = doc.to_dict()
            booking_data["id"] = doc.id
            bookings.append(booking_data)

        return {"success": True, "data": bookings}

    except auth.InvalidIdTokenError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/bookings/{booking_id}")
async def cancel_booking(booking_id: str, id_token: str = Header(None)):
    """
    Cancel a booking.
    """
    if not id_token:
        raise HTTPException(status_code=401, detail="Authorization required")

    try:
        decoded_token = auth.verify_id_token(id_token)
        user_uid = decoded_token.get("uid")

        if not user_uid:
            raise HTTPException(status_code=401, detail="Invalid token")

        # Get booking
        booking_doc = db.collection("bookings").document(booking_id).get()

        if not booking_doc.exists:
            raise HTTPException(status_code=404, detail="Booking not found")

        booking_data = booking_doc.to_dict()

        # Verify ownership
        if booking_data.get("client_uid") != user_uid:
            raise HTTPException(
                status_code=403, detail="Not authorized to cancel this booking"
            )

        # Update status
        db.collection("bookings").document(booking_id).update(
            {
                "status": "cancelled",
                "updated_at": datetime.now().isoformat(),
            }
        )

        return {"success": True, "message": "Booking cancelled successfully"}

    except auth.InvalidIdTokenError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/lawyers/{lawyer_id}/reviews")
async def submit_review(
    lawyer_id: str,
    rating: int,
    comment: str,
    id_token: str = Header(None),
):
    """
    Submit a review for a lawyer.
    """
    if not id_token:
        raise HTTPException(status_code=401, detail="Authorization required")

    try:
        if rating < 1 or rating > 5:
            raise HTTPException(status_code=400, detail="Rating must be between 1-5")

        decoded_token = auth.verify_id_token(id_token)
        client_uid = decoded_token.get("uid")

        if not client_uid:
            raise HTTPException(status_code=401, detail="Invalid token")

        # Check if lawyer exists
        lawyer_doc = db.collection("lawyers").document(lawyer_id).get()
        if not lawyer_doc.exists:
            raise HTTPException(status_code=404, detail="Lawyer not found")

        # Create review
        review_ref = (
            db.collection("lawyers")
            .document(lawyer_id)
            .collection("reviews")
            .document()
        )

        review_ref.set(
            {
                "client_uid": client_uid,
                "rating": rating,
                "comment": comment,
                "created_at": datetime.now().isoformat(),
            }
        )

        # Update lawyer's average rating
        all_reviews = (
            db.collection("lawyers")
            .document(lawyer_id)
            .collection("reviews")
            .stream()
        )

        reviews_list = [doc.to_dict() for doc in all_reviews]
        avg_rating = sum(r.get("rating", 0) for r in reviews_list) / len(reviews_list)

        db.collection("lawyers").document(lawyer_id).update(
            {
                "rating": round(avg_rating, 1),
                "review_count": len(reviews_list),
            }
        )

        return {
            "success": True,
            "message": "Review submitted successfully",
            "review_id": review_ref.id,
        }

    except auth.InvalidIdTokenError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
