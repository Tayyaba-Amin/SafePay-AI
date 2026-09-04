import logging

from fastapi import APIRouter, UploadFile, File, HTTPException

from app.config import get_settings
from app.models.schemas import (
    AnalysisResult,
    ErrorResponse,
    MessageTextRequest,
)
from app.services.dashscope import analyze_message_text

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/message", tags=["Message Analyzer"])

settings = get_settings()

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}


# ─── Text-based analysis (primary) ──────────────────────────────────────────


@router.post(
    "/analyze-text",
    response_model=AnalysisResult,
    responses={
        400: {"model": ErrorResponse},
        422: {"model": ErrorResponse},
        500: {"model": ErrorResponse},
        502: {"model": ErrorResponse},
    },
)
async def analyze_message_text_endpoint(body: MessageTextRequest):
    """Analyze a pasted SMS / WhatsApp message for scam indicators."""
    try:
        result = await analyze_message_text(body.message)
        return AnalysisResult(**result)
    except ValueError as exc:
        # DashScope / AI errors → 502
        logger.warning("Message analysis failed (DashScope): %s", exc)
        raise HTTPException(status_code=502, detail=str(exc))
    except Exception:
        logger.exception("Unexpected error during message analysis")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred during analysis.",
        )


# ─── Screenshot-based analysis (future) ─────────────────────────────────────


@router.post(
    "/analyze",
    response_model=AnalysisResult,
    responses={400: {"model": ErrorResponse}, 500: {"model": ErrorResponse}},
)
async def analyze_message_screenshot(file: UploadFile = File(...)):
    """Analyze a suspicious SMS/WhatsApp message screenshot for scam indicators."""
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '{file.content_type}'. Allowed: JPEG, PNG, WebP.",
        )

    contents = await file.read()
    if len(contents) > settings.max_upload_size:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size is {settings.max_upload_size // (1024 * 1024)} MB.",
        )

    # TODO: Implement image-based analysis with Qwen3-VL-Plus
    raise HTTPException(
        status_code=501,
        detail="Screenshot analysis not yet implemented. Use /analyze-text instead.",
    )
