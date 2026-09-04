from pydantic import BaseModel, Field


class AnalysisResult(BaseModel):
    """Standard response for all analyzer endpoints."""

    risk_level: str  # "Low", "Medium", "High", "Critical"
    risk_score: int = Field(ge=0, le=100)  # 0 – 100
    threat_category: str
    threat_category_urdu: str | None = None
    detected_indicators: list[str]
    detected_indicators_urdu: list[str] | None = None
    explanation: str
    explanation_urdu: str
    recommended_action: str
    recommended_action_urdu: str
    language: str = "Unknown"
    # Only populated by the Receipt Analyzer
    visible_receipt_information: dict[str, str] | None = None
    # Only populated by the Voice Analyzer
    transcript: str | None = None


class MessageTextRequest(BaseModel):
    """Request body for text-based message analysis."""

    message: str = Field(
        ...,
        min_length=10,
        max_length=5000,
        description="The SMS / WhatsApp message text to analyse.",
    )


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str


class ErrorResponse(BaseModel):
    detail: str
