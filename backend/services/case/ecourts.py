import httpx
from typing import Optional
from models.case import CaseResponse, HearingDate
from core.config import config

ECOURTS_BASE_URL = "https://services.ecourts.gov.in/ecourtindia_v6"

async def fetch_case_by_cnr(cnr_number: str) -> Optional[CaseResponse]:
    """
    Fetch case details from eCourts API using CNR number.
    CNR format: STATECOURTNO/YEAR e.g. DLHC010123452024
    """
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                f"{ECOURTS_BASE_URL}/case_status_cnr",
                data={
                    "cnr_number": cnr_number,
                    "token": config.ECOURTS_API_KEY
                },
                headers={
                    "Content-Type": "application/x-www-form-urlencoded",
                    "User-Agent": "NyayMitra/1.0"
                }
            )

            if response.status_code != 200:
                return None

            data = response.json()

            if not data or "case_details" not in data:
                return None

            details = data["case_details"]

            hearing_history = [
                HearingDate(
                    date=h.get("date", ""),
                    purpose=h.get("purpose", ""),
                    next_date=h.get("next_date")
                )
                for h in data.get("hearing_dates", [])
            ]

            return CaseResponse(
                cnr_number=cnr_number,
                case_type=details.get("case_type", ""),
                filing_number=details.get("filing_number", ""),
                filing_date=details.get("filing_date", ""),
                registration_number=details.get("registration_number"),
                registration_date=details.get("registration_date"),
                court_name=details.get("court_name", ""),
                court_number=details.get("court_number"),
                judge_name=details.get("judge_name"),
                petitioner=details.get("petitioner", ""),
                respondent=details.get("respondent", ""),
                status=details.get("case_status", "Unknown"),
                next_hearing_date=details.get("next_hearing_date"),
                hearing_history=hearing_history,
                last_order=details.get("last_order")
            )

    except httpx.TimeoutException:
        raise Exception("eCourts API timed out. Please try again.")
    except Exception as e:
        raise Exception(f"Error fetching case: {str(e)}")


def get_mock_case(cnr_number: str) -> CaseResponse:
    """
    Returns mock data for development and testing
    when eCourts API key is not available.
    """
    return CaseResponse(
        cnr_number=cnr_number,
        case_type="Criminal Revision",
        filing_number="CRL/1847/2023",
        filing_date="04-06-2023",
        registration_number="CRL/1847/2023",
        registration_date="05-06-2023",
        court_name="Orissa High Court",
        court_number="Court No. 3",
        judge_name="Hon. Justice D.K. Patra",
        petitioner="Ramesh Kumar Sharma",
        respondent="State of Odisha",
        status="Active",
        next_hearing_date="28-03-2026",
        hearing_history=[
            HearingDate(
                date="12-02-2026",
                purpose="Bail Application",
                next_date="28-03-2026"
            ),
            HearingDate(
                date="10-01-2026",
                purpose="First Hearing",
                next_date="12-02-2026"
            )
        ],
        last_order="Bail application adjourned. Petitioner counsel to file additional affidavit."
    )