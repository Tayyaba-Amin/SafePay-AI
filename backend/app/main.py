from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers import receipt, message, voice

settings = get_settings()

app = FastAPI(
    title="SafePay AI – Fraud Shield API",
    description="AI-powered fraud detection for digital payments in Pakistan",
    version="0.1.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(receipt.router)
app.include_router(message.router)
app.include_router(voice.router)


@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "SafePay AI – Fraud Shield API",
        "version": "0.1.0",
    }
