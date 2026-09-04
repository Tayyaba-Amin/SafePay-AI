import logging

from fastapi import APIRouter, UploadFile, File, HTTPException

from app.config import get_settings
from app.models.schemas import AnalysisResult, ErrorResponse
from app.services.dashscope import analyze_receipt_image

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/receipt", tags=["Receipt Analyzer"])

settings = get_settings()

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}


@router.post(
    "/analyze",
    response_model=AnalysisResult,
    responses={400: {"model": ErrorResponse}, 500: {"model": ErrorResponse}},
)
async def analyze_receipt(file: UploadFile = File(...)):
    """Analyze a payment receipt screenshot for fraud indicators."""
    # ── Validate content type ──
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '{file.content_type}'. Allowed: JPEG, PNG, WebP.",
        )

    # ── Read file and validate size ──
    contents = await file.read()
    if len(contents) > settings.max_upload_size:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size is {settings.max_upload_size // (1024 * 1024)} MB.",
        )

    if len(contents) == 0:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty.",
        )

    # ── Run AI analysis ──
    try:
        result = await analyze_receipt_image(contents, file.content_type)
        return AnalysisResult(**result)
    except ValueError as exc:
        logger.warning("Receipt analysis failed (DashScope): %s", exc)
        raise HTTPException(status_code=502, detail=str(exc))
    except Exception as exc:
        logger.exception("Unexpected error during receipt analysis")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred while analyzing the receipt.",
        )
