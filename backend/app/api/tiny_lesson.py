from fastapi import APIRouter, HTTPException, Depends
import logging

from app.models.tiny_lesson import TinyLessonRequest, TinyLessonResponse
from app.services.tiny_lesson import tiny_lesson_service

# Configure logger
logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/terms", response_model=TinyLessonResponse)
async def create_tiny_lesson(request: TinyLessonRequest):
    """
    Generate vocabulary and phrases for a specific language learning context
    """
    try:
        return await tiny_lesson_service.generate_tiny_lesson(
            request.sourceLanguage,
            request.targetLanguage,
            request.purpose
        )
    except Exception as e:
        logger.error(f"Error processing tiny lesson request: {str(e)}")
        raise HTTPException(
            status_code=500, detail="Failed to generate tiny lesson")
