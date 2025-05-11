import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings"""
    # API Configuration
    APP_NAME: str = "Little Language Lessons"
    API_V1_STR: str = "/api/v1"

    # Google Gemini API
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = "gemini-1.5-pro"  # Model to use for text requests
    # Model to use for image/vision requests
    GEMINI_VISION_MODEL: str = "gemini-1.5-flash"

    # Performance Settings
    MAX_ATTEMPTS: int = 3  # Maximum retries for API calls
    TIMEOUT_SECONDS: int = 30  # Timeout for API calls

    # Image Processing Settings
    MAX_IMAGE_SIZE_MB: int = 5  # Maximum image size in MB
    SUPPORTED_IMAGE_TYPES: list = ["image/jpeg", "image/png", "image/webp"]

    # API Rate Limits
    RATE_LIMIT_PER_MINUTE: int = 60  # Requests per minute

    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = ENVIRONMENT == "development"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
