from fastapi import APIRouter, HTTPException
from models.case import CaseSearchRequest, CaseSearchResponse
from services.case.ecourts import fetch_case_by_cnr, get_mock_case
from core.config import config

router = APIRouter(prefix="/case", tags=["Case"])

@router.get("/{cnr_number}")
async def get_case(cnr_number: str):
    """
    Fetch case details by CNR number.
    Uses mock data in development if no eCourts API key is set.
    """
    try:
        # Use mock data if no API key
        if not config.ECOURTS_API_KEY or config.is_development:
            case = get_mock_case(cnr_number)
            return CaseSearchResponse(
                success=True,
                data=case,
                cached=False
            )

        case = await fetch_case_by_cnr(cnr_number)

        if not case:
            raise HTTPException(
                status_code=404,
                detail=f"Case {cnr_number} not found"
            )

        return CaseSearchResponse(success=True, data=case)

    except HTTPException:
        raise
    except Exception as e:
        return CaseSearchResponse(
            success=False,
            error=str(e)
        )

@router.post("/search")
async def search_case(request: CaseSearchRequest):
    """
    Search case by CNR number or party name.
    """
    if not request.cnr_number and not request.party_name:
        raise HTTPException(
            status_code=400,
            detail="Provide either cnr_number or party_name"
        )

    if request.cnr_number:
        return await get_case(request.cnr_number)

    raise HTTPException(
        status_code=501,
        detail="Party name search coming soon"
    )