"""DashScope / Alibaba Cloud Model Studio integration."""

import base64
import json
import logging

import httpx

from app.config import get_settings

logger = logging.getLogger(__name__)

DASHSCOPE_BASE_URL = "https://dashscope-intl.aliyuncs.com/compatible-mode/v1"
MODEL_QWEN3_VL_PLUS = "qwen-vl-plus"
MODEL_QWEN3_ASR_FLASH = "qwen3-asr-flash"

_TIMEOUT = httpx.Timeout(90.0, connect=15.0)


async def _call_model(messages: list[dict]) -> dict:
    """Send a chat completion request to DashScope and return the parsed JSON content."""
    settings = get_settings()

    if not settings.dashscope_api_key or settings.dashscope_api_key == "placeholder":
        raise ValueError(
            "DASHSCOPE_API_KEY is not configured. "
            "Set it in backend/.env to enable AI analysis."
        )

    headers = {
        "Authorization": f"Bearer {settings.dashscope_api_key}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": MODEL_QWEN3_VL_PLUS,
        "messages": messages,
        "response_format": {"type": "json_object"},
        "temperature": 0.3,
        "max_tokens": 3000,
    }

    async with httpx.AsyncClient(timeout=_TIMEOUT) as client:
        response = await client.post(
            f"{DASHSCOPE_BASE_URL}/chat/completions",
            headers=headers,
            json=payload,
        )

        if response.status_code != 200:
            logger.error("DashScope API error %s: %s", response.status_code, response.text)
            raise ValueError(
                f"AI service returned error {response.status_code}. "
                "Please try again later."
            )

        data = response.json()

    try:
        content = data["choices"][0]["message"]["content"]
    except (KeyError, IndexError):
        raise ValueError("AI service returned an unexpected response format.")

    try:
        return json.loads(content)
    except json.JSONDecodeError as e:
        # Log the raw content for debugging (truncated to avoid log spam)
        logger.warning(
            "Failed to parse AI response as JSON. Error: %s. Content preview: %s",
            str(e),
            content[:200] if content else "(empty)"
        )
        raise ValueError("AI service returned invalid JSON.")


# ─── Message analysis ────────────────────────────────────────────────────────

_MESSAGE_SYSTEM_PROMPT = """\
You are SafePay AI, a fraud-detection specialist for digital payments in Pakistan.
You analyze SMS, WhatsApp, and other text messages for fraud and scam indicators.

## STRICT RULES
1. Only flag indicators you can clearly identify in the text. Never fabricate or assume details.
2. Do NOT claim certainty unless the evidence strongly supports it.
3. Use hedging language: "appears to", "suggests", "may indicate", "shows signs of".
4. If the message appears legitimate, score it Low and state that no fraud indicators were found.
5. This is an awareness tool — you are NOT an official bank or wallet verification system.
6. Consider the Pakistani context: JazzCash, Easypaisa, EasyPaisa, HBL, UBL, Meezan, MCB, Allied Bank, Raast, IBFT.

## INDICATORS TO CHECK
- Impersonation of a bank, government body, or well-known company
- Urgency or time pressure ("act now", "blocked today", "expires soon")
- Threats of account closure, blocking, or legal action
- Fake customer support numbers or contact details
- Requests for OTP, PIN, password, CNIC, or account number
- Suspicious shortened or masked URLs
- Payment or money-transfer requests from unknown parties
- Fake prizes, lottery wins, or reward claims
- Account verification or "KYC update" scams
- Social engineering and emotional manipulation
- Suspicious financial instructions
- Grammar, spelling, or formatting inconsistencies typical of mass-scam templates

## OUTPUT FORMAT
Return ONLY a valid JSON object with exactly these fields (no markdown, no extra text).
ALL fields listed below are REQUIRED. Do NOT omit any field. Every Urdu field MUST contain a meaningful Urdu translation — never leave them empty or null.
{
  "risk_level": "Low | Medium | High | Critical",
  "risk_score": <integer 0-100>,
  "threat_category": "<short category name in English>",
  "threat_category_urdu": "<same category translated into simple Urdu>",
  "detected_indicators": ["<indicator 1 in English>", "<indicator 2 in English>"],
  "detected_indicators_urdu": ["<indicator 1 translated into simple Urdu>", "<indicator 2 translated into simple Urdu>"],
  "explanation": "<clear explanation in simple English, 2-4 sentences>",
  "explanation_urdu": "<same explanation translated into simple Urdu>",
  "recommended_action": "<specific safe action in English>",
  "recommended_action_urdu": "<same action translated into simple Urdu>",
  "language": "<detected language of the input message>"
}

Scoring guide:
  0-25   Low      — no clear fraud indicators
  26-50  Medium   — some suspicious elements, exercise caution
  51-75  High     — multiple fraud indicators, very likely a scam
  76-100 Critical — textbook scam, immediate danger\
"""


async def analyze_message_text(message: str) -> dict:
    """Analyze a pasted text message for scam indicators via Qwen3-VL-Plus."""
    messages = [
        {"role": "system", "content": _MESSAGE_SYSTEM_PROMPT},
        {
            "role": "user",
            "content": (
                "Analyze this message for fraud and scam indicators.\n\n"
                f"--- MESSAGE START ---\n{message}\n--- MESSAGE END ---"
            ),
        },
    ]

    result = await _call_model(messages)

    # ── Validate and fill defaults ──
    required_defaults = {
        "risk_level": "Medium",
        "risk_score": 50,
        "threat_category": "Unclassified",
        "threat_category_urdu": "غیر واضح",
        "detected_indicators": [],
        "detected_indicators_urdu": [],
        "explanation": "Analysis could not be completed.",
        "explanation_urdu": "تجزیہ مکمل نہیں ہو سکا۔",
        "recommended_action": "Exercise caution and verify independently.",
        "recommended_action_urdu": "احتیاط برتیں اور آزادانہ تصدیق کریں۔",
        "language": "Unknown",
    }

    for key, default in required_defaults.items():
        if key not in result or result[key] is None:
            result[key] = default

    # Fallback for empty-string Urdu fields (AI may return empty strings instead of null)
    for ur_key, en_key in [
        ("explanation_urdu", "explanation"),
        ("recommended_action_urdu", "recommended_action"),
        ("threat_category_urdu", "threat_category"),
    ]:
        if isinstance(result.get(ur_key), str) and not result[ur_key].strip():
            result[ur_key] = result.get(en_key, required_defaults[ur_key])

    # Clamp score
    result["risk_score"] = max(0, min(100, int(result["risk_score"])))

    # Normalise risk_level
    valid_levels = {"Low", "Medium", "High", "Critical"}
    if result["risk_level"] not in valid_levels:
        score = result["risk_score"]
        if score <= 25:
            result["risk_level"] = "Low"
        elif score <= 50:
            result["risk_level"] = "Medium"
        elif score <= 75:
            result["risk_level"] = "High"
        else:
            result["risk_level"] = "Critical"

    # Ensure detected_indicators is a list
    if not isinstance(result["detected_indicators"], list):
        result["detected_indicators"] = []
    if not isinstance(result.get("detected_indicators_urdu"), list):
        result["detected_indicators_urdu"] = result["detected_indicators"]

    return result


# ─── Vision / image model helper ─────────────────────────────────────────────

async def _call_vision_model(messages: list[dict]) -> dict:
    """Send a multimodal (image + text) request to DashScope and return parsed JSON."""
    settings = get_settings()

    if not settings.dashscope_api_key or settings.dashscope_api_key == "placeholder":
        raise ValueError(
            "DASHSCOPE_API_KEY is not configured. "
            "Set it in backend/.env to enable AI analysis."
        )

    headers = {
        "Authorization": f"Bearer {settings.dashscope_api_key}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": MODEL_QWEN3_VL_PLUS,
        "messages": messages,
        "response_format": {"type": "json_object"},
        "temperature": 0.2,
        "max_tokens": 3000,
    }

    async with httpx.AsyncClient(timeout=_TIMEOUT) as client:
        response = await client.post(
            f"{DASHSCOPE_BASE_URL}/chat/completions",
            headers=headers,
            json=payload,
        )

        if response.status_code != 200:
            logger.error("DashScope vision API error %s: %s", response.status_code, response.text)
            raise ValueError(
                f"AI vision service returned error {response.status_code}. "
                "Please try again later."
            )

        data = response.json()

    try:
        content = data["choices"][0]["message"]["content"]
    except (KeyError, IndexError):
        raise ValueError("AI vision service returned an unexpected response format.")

    try:
        return json.loads(content)
    except json.JSONDecodeError as e:
        # Log the raw content for debugging (truncated to avoid log spam)
        logger.warning(
            "Failed to parse vision AI response as JSON. Error: %s. Content preview: %s",
            str(e),
            content[:200] if content else "(empty)"
        )
        raise ValueError("AI vision service returned invalid JSON.")


# ─── Receipt analysis ─────────────────────────────────────────────────────────

_RECEIPT_SYSTEM_PROMPT = """\
You are SafePay AI, a receipt verification specialist for digital payments in Pakistan.
You visually inspect screenshots and photos of payment receipts for anomalies and signs of tampering.

## CRITICAL DISCLAIMER
You are NOT an official payment verification service.
You must NEVER claim that a receipt is definitely fake or definitely genuine.
You only identify potential indicators and anomalies visible in the image.
Always recommend verifying the transaction through the official bank or wallet application.

## STRICT RULES
1. Only describe what you can actually see in the image. Never hallucinate or infer details that are not visible.
2. Use hedging language: "appears to", "may indicate", "is inconsistent with", "shows signs of".
3. If the image quality is poor, blurry, or too dark to read reliably — say so explicitly and recommend verifying through the official payment app.
4. Do not make absolute claims like "this receipt is fake" or "this transaction never happened".
5. Consider the Pakistani context: JazzCash, Easypaisa / EasyPaisa, HBL, UBL, Meezan, MCB, Allied Bank, Raast, IBFT, SadaPay, NayaPay.

## INDICATORS TO CHECK
- Unusual or inconsistent formatting compared to standard payment app receipts
- Inconsistent text alignment, font size, or colour within the receipt
- Suspicious payment status wording (e.g. non-standard success/failure messages)
- Missing or strange transaction reference / tracking ID
- Inconsistent or unusual amount / currency display
- Suspicious or impossible timestamps (future dates, nonsensical times)
- Suspicious sender / receiver information (blank, placeholder text, unusual names)
- Visible signs of digital editing or manipulation when visually apparent (mismatched backgrounds, pasted text blocks)
- Fake-looking confirmation language or branding that does not match known templates
- Other visible anomalies (watermarks from editing apps, cut-off text, overlapping elements)

## OUTPUT FORMAT
Return ONLY a valid JSON object with exactly these fields (no markdown, no extra text).
ALL fields listed below are REQUIRED. Do NOT omit any field. Every Urdu field MUST contain a meaningful Urdu translation — never leave them empty or null.
{
  "risk_level": "Low | Medium | High | Critical",
  "risk_score": <integer 0-100>,
  "threat_category": "<short category name in English>",
  "threat_category_urdu": "<same category translated into simple Urdu>",
  "detected_indicators": ["<indicator 1 in English>", "<indicator 2 in English>"],
  "detected_indicators_urdu": ["<indicator 1 translated into simple Urdu>", "<indicator 2 translated into simple Urdu>"],
  "visible_receipt_information": {
    "sender": "<sender name/number or empty string>",
    "recipient": "<recipient name/number or empty string>",
    "amount": "<visible amount or empty string>",
    "currency": "<visible currency or empty string>",
    "date_time": "<visible date/time or empty string>",
    "status": "<visible payment status or empty string>",
    "transaction_id": "<visible transaction/ref ID or empty string>",
    "payment_platform": "<visible platform name or empty string>"
  },
  "explanation": "<clear explanation in simple English, 2-4 sentences>",
  "explanation_urdu": "<same explanation translated into simple Urdu>",
  "recommended_action": "<specific safe action in English — always include verifying via official app>",
  "recommended_action_urdu": "<same action translated into simple Urdu>",
  "language": "English"
}

Scoring guide:
  0-25   Low      — receipt appears standard; no visible anomalies detected
  26-50  Medium   — minor inconsistencies found; verify via official app
  51-75  High     — multiple visible anomalies; likely manipulated
  76-100 Critical — strong visual signs of tampering or fabrication\
"""


async def analyze_receipt_image(image_bytes: bytes, content_type: str) -> dict:
    """Analyze a receipt screenshot via Qwen3-VL-Plus vision."""
    image_b64 = base64.b64encode(image_bytes).decode("utf-8")

    messages = [
        {"role": "system", "content": _RECEIPT_SYSTEM_PROMPT},
        {
            "role": "user",
            "content": [
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:{content_type};base64,{image_b64}",
                    },
                },
                {
                    "type": "text",
                    "text": (
                        "Inspect this payment receipt screenshot. "
                        "Identify all visible information and flag any anomalies or signs of tampering."
                    ),
                },
            ],
        },
    ]

    result = await _call_vision_model(messages)

    # ── Validate and fill defaults ──
    required_defaults = {
        "risk_level": "Medium",
        "risk_score": 50,
        "threat_category": "Unclassified Receipt Anomaly",
        "threat_category_urdu": "غیر واضح رسید کی خرابی",
        "detected_indicators": [],
        "detected_indicators_urdu": [],
        "visible_receipt_information": {},
        "explanation": "Receipt analysis could not be completed. Please verify the transaction through your official payment app.",
        "explanation_urdu": "رسید کا تجزیہ مکمل نہیں ہو سکا۔ براہ کرم اپنی آفیشل پیمنٹ ایپ کے ذریعے ٹرانزیکشن کی تصدیق کریں۔",
        "recommended_action": "Verify the transaction directly in your bank or wallet application.",
        "recommended_action_urdu": "اپنے بینک یا والیٹ ایپلیکیشن میں براہ راست ٹرانزیکشن کی تصدیق کریں۔",
        "language": "English",
    }

    for key, default in required_defaults.items():
        if key not in result or result[key] is None:
            result[key] = default

    # Fallback for empty-string Urdu fields (AI may return empty strings instead of null)
    for ur_key, en_key in [
        ("explanation_urdu", "explanation"),
        ("recommended_action_urdu", "recommended_action"),
        ("threat_category_urdu", "threat_category"),
    ]:
        if isinstance(result.get(ur_key), str) and not result[ur_key].strip():
            result[ur_key] = result.get(en_key, required_defaults[ur_key])

    # Clamp score
    result["risk_score"] = max(0, min(100, int(result["risk_score"])))

    # Normalise risk_level
    valid_levels = {"Low", "Medium", "High", "Critical"}
    if result["risk_level"] not in valid_levels:
        score = result["risk_score"]
        if score <= 25:
            result["risk_level"] = "Low"
        elif score <= 50:
            result["risk_level"] = "Medium"
        elif score <= 75:
            result["risk_level"] = "High"
        else:
            result["risk_level"] = "Critical"

    # Ensure detected_indicators is a list
    if not isinstance(result["detected_indicators"], list):
        result["detected_indicators"] = []
    if not isinstance(result.get("detected_indicators_urdu"), list):
        result["detected_indicators_urdu"] = result["detected_indicators"]

    # Ensure visible_receipt_information is a dict
    if not isinstance(result.get("visible_receipt_information"), dict):
        result["visible_receipt_information"] = {}

    return result


# ─── ASR transcription ────────────────────────────────────────────────────────

async def _transcribe_audio(audio_bytes: bytes, content_type: str) -> str:
    """Transcribe audio using Qwen3-ASR-Flash via the OpenAI-compatible endpoint."""
    settings = get_settings()

    if not settings.dashscope_api_key or settings.dashscope_api_key == "placeholder":
        raise ValueError(
            "DASHSCOPE_API_KEY is not configured. "
            "Set it in backend/.env to enable AI analysis."
        )

    # Normalise MIME type for the data URI
    mime = content_type if content_type.startswith("audio/") else "audio/mpeg"
    audio_b64 = base64.b64encode(audio_bytes).decode("utf-8")
    data_uri = f"data:{mime};base64,{audio_b64}"

    headers = {
        "Authorization": f"Bearer {settings.dashscope_api_key}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": MODEL_QWEN3_ASR_FLASH,
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_audio",
                        "input_audio": {"data": data_uri},
                    }
                ],
            }
        ],
        "stream": False,
    }

    async with httpx.AsyncClient(timeout=_TIMEOUT) as client:
        logger.info("Sending %d bytes to qwen3-asr-flash (mime=%s)", len(audio_bytes), mime)
        response = await client.post(
            f"{DASHSCOPE_BASE_URL}/chat/completions",
            headers=headers,
            json=payload,
        )

        if response.status_code != 200:
            logger.error("DashScope ASR error %s: %s", response.status_code, response.text)
            raise ValueError(
                f"Speech recognition service returned error {response.status_code}. "
                "Please try again or use a different audio format."
            )

        data = response.json()

    try:
        transcript = data["choices"][0]["message"]["content"]
    except (KeyError, IndexError):
        raise ValueError("Speech recognition service returned an unexpected response format.")

    logger.info("ASR returned transcript (length=%d)", len(transcript) if transcript else 0)

    # Clean and validate transcript
    cleaned = transcript.strip() if transcript else ""
    # Remove common ASR artifacts for non-speech audio:
    # - ASCII dots, ellipses, hyphens
    # - Chinese/Japanese punctuation (。、，)
    # - Common filler characters ASR generates for non-speech audio
    cleaned_content = cleaned
    for char in ["." , "…", "-", "。", "、", "，", "~"]:
        cleaned_content = cleaned_content.replace(char, "")
    cleaned_content = cleaned_content.strip()

    # Reject if too short to be meaningful speech (need at least 2 real characters)
    if not cleaned or len(cleaned_content) < 2:
        raise ValueError(
            "No clear speech could be detected in the recording. "
            "Please upload a short recording with clear speech."
        )

    return cleaned


# ─── Voice transcript analysis ────────────────────────────────────────────────

_VOICE_SYSTEM_PROMPT = """\
You are SafePay AI, a fraud-detection specialist for voice-based financial scams in Pakistan.
You analyze transcriptions of voice recordings for scam and social-engineering indicators.

## STRICT RULES
1. Only flag indicators you can clearly identify in the transcript. Never fabricate or assume statements that were not made.
2. Do NOT claim certainty unless the evidence strongly supports it.
3. Use hedging language: "the speaker appears to", "suggests", "may indicate", "shows signs of".
4. If the transcript appears to be a legitimate conversation, score it Low and state that no scam indicators were found.
5. This is an awareness tool — you are NOT an official bank or law-enforcement verification system.
6. Consider the Pakistani context: JazzCash, Easypaisa / EasyPaisa, HBL, UBL, Meezan, MCB, Allied Bank, Raast, IBFT, SadaPay, NayaPay, State Bank of Pakistan (SBP).
7. Never request, repeat, or store passwords, OTPs, PINs, or other credentials mentioned in the recording.

## INDICATORS TO CHECK
- Impersonation of a bank employee, government official, or well-known company representative
- Fake bank or wallet customer-support claims without proper employee identification
- Urgency or time pressure ("act now", "your account will be blocked", "expires today")
- Threats of account closure, blocking, arrest, or legal action
- Requests for OTP, PIN, password, CNIC, or full account number
- Account verification or "KYC update" requests over the phone
- Payment manipulation — instructing the listener to send money or approve a transaction
- Social engineering and emotional manipulation (fear, greed, sympathy)
- Fake prizes, lottery wins, reward claims, or "you have been selected" language
- Suspicious instructions to download an app, click a link, or visit a website
- Requests to transfer money to an unknown or "safe" account
- Inconsistencies in the speaker's story or claimed identity
- Background cues suggesting a call-center or scripted operation

## OUTPUT FORMAT
Return ONLY a valid JSON object with exactly these fields (no markdown, no extra text).
ALL fields listed below are REQUIRED. Do NOT omit any field. Every Urdu field MUST contain a meaningful Urdu translation — never leave them empty or null.
{
  "risk_level": "Low | Medium | High | Critical",
  "risk_score": <integer 0-100>,
  "threat_category": "<short category name in English>",
  "threat_category_urdu": "<same category translated into simple Urdu>",
  "detected_indicators": ["<indicator 1 in English>", "<indicator 2 in English>"],
  "detected_indicators_urdu": ["<indicator 1 translated into simple Urdu>", "<indicator 2 translated into simple Urdu>"],
  "explanation": "<clear explanation in simple English, 2-4 sentences>",
  "explanation_urdu": "<same explanation translated into simple Urdu>",
  "recommended_action": "<specific safe action in English>",
  "recommended_action_urdu": "<same action translated into simple Urdu>",
  "language": "<detected language of the spoken conversation>"
}

Scoring guide:
  0-25   Low      — no clear scam indicators; conversation appears legitimate
  26-50  Medium   — some suspicious elements; exercise caution and verify
  51-75  High     — multiple scam indicators; very likely a fraudulent call
  76-100 Critical — textbook scam call; immediate danger\
"""


async def _analyze_voice_transcript(transcript: str) -> dict:
    """Analyze a voice-call transcript for scam indicators via Qwen3-VL-Plus."""
    messages = [
        {"role": "system", "content": _VOICE_SYSTEM_PROMPT},
        {
            "role": "user",
            "content": (
                "Analyze this voice recording transcript for scam and fraud indicators.\n\n"
                f"--- TRANSCRIPT START ---\n{transcript}\n--- TRANSCRIPT END ---"
            ),
        },
    ]

    result = await _call_model(messages)

    # ── Validate and fill defaults ──
    required_defaults = {
        "risk_level": "Medium",
        "risk_score": 50,
        "threat_category": "Unclassified Voice Scam",
        "threat_category_urdu": "غیر واضح آواز اسکیم",
        "detected_indicators": [],
        "detected_indicators_urdu": [],
        "explanation": "Voice analysis could not be completed.",
        "explanation_urdu": "آواز کا تجزیہ مکمل نہیں ہو سکا۔",
        "recommended_action": "Exercise caution and verify independently through official channels.",
        "recommended_action_urdu": "احتیاط برتیں اور آفیشل ذرائع سے آزادانہ تصدیق کریں۔",
        "language": "Unknown",
    }

    for key, default in required_defaults.items():
        if key not in result or result[key] is None:
            result[key] = default

    # Fallback for empty-string Urdu fields (AI may return empty strings instead of null)
    for ur_key, en_key in [
        ("explanation_urdu", "explanation"),
        ("recommended_action_urdu", "recommended_action"),
        ("threat_category_urdu", "threat_category"),
    ]:
        if isinstance(result.get(ur_key), str) and not result[ur_key].strip():
            result[ur_key] = result.get(en_key, required_defaults[ur_key])

    # Clamp score
    result["risk_score"] = max(0, min(100, int(result["risk_score"])))

    # Normalise risk_level
    valid_levels = {"Low", "Medium", "High", "Critical"}
    if result["risk_level"] not in valid_levels:
        score = result["risk_score"]
        if score <= 25:
            result["risk_level"] = "Low"
        elif score <= 50:
            result["risk_level"] = "Medium"
        elif score <= 75:
            result["risk_level"] = "High"
        else:
            result["risk_level"] = "Critical"

    # Ensure detected_indicators is a list
    if not isinstance(result["detected_indicators"], list):
        result["detected_indicators"] = []
    if not isinstance(result.get("detected_indicators_urdu"), list):
        result["detected_indicators_urdu"] = result["detected_indicators"]

    return result


# ─── Voice orchestrator ───────────────────────────────────────────────────────

async def analyze_voice_recording(audio_bytes: bytes, content_type: str) -> dict:
    """
    Two-step voice analysis pipeline:
      1. Transcribe audio with Qwen3-ASR-Flash
      2. Analyze transcript for scam indicators with Qwen3-VL-Plus
    """
    # Step 1: Transcription
    transcript = await _transcribe_audio(audio_bytes, content_type)

    # Step 2: Fraud analysis
    result = await _analyze_voice_transcript(transcript)

    # Attach the transcript to the result
    result["transcript"] = transcript

    return result
