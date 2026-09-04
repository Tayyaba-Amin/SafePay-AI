import logging

from fastapi import APIRouter, UploadFile, File, HTTPException

from app.config import get_settings
from app.models.schemas import AnalysisResult, ErrorResponse
from app.services.dashscope import analyze_voice_recording

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/voice", tags=["Voice Analyzer"])

settings = get_settings()

ALLOWED_AUDIO_TYPES = {
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/wave",
    "audio/x-wav",
    "audio/ogg",
    "audio/webm",
    "audio/mp4",
    "audio/m4a",
    "audio/x-m4a",
}


@router.post(
    "/analyze",
    response_model=AnalysisResult,
    responses={400: {"model": ErrorResponse}, 500: {"model": ErrorResponse}},
)
async def analyze_voice(file: UploadFile = File(...)):
    """Analyze a voice recording for scam indicators.

    Pipeline: audio → Qwen3-ASR-Flash (transcription) → Qwen3-VL-Plus (fraud analysis)
    """
    # ── Validate content type (lenient — browsers send varied MIME types) ──
    if file.content_type and not file.content_type.startswith("audio/"):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '{file.content_type}'. Expected an audio file.",
        )

    # ── Read file and validate size ──
    contents = await file.read()

    # Diagnostic logging (safe — no sensitive data)
    logger.info(
        "Voice upload received: filename=%s, size=%d bytes, mime=%s",
        file.filename or "(unnamed)",
        len(contents),
        file.content_type or "(unknown)",
    )

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

    # ── Run two-step pipeline: ASR → fraud analysis ──
    try:
        logger.info("Starting ASR transcription for %s (%d bytes)", file.filename, len(contents))
        result = await analyze_voice_recording(contents, file.content_type or "audio/mpeg")
        logger.info(
            "Voice analysis complete: risk=%s, score=%d, transcript_len=%d",
            result.get("risk_level", "?"),
            result.get("risk_score", 0),
            len(result.get("transcript", "")),
        )
        return AnalysisResult(**result)
    except ValueError as exc:
        logger.warning("Voice analysis failed: %s", exc)
        raise HTTPException(status_code=502, detail=str(exc))
    except Exception:
        logger.exception("Unexpected error during voice analysis")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred while analyzing the voice recording.",
        )
