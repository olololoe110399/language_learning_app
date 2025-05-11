from fastapi import APIRouter, HTTPException, Depends
import logging

from app.models.slang_hang import SlangHangRequest, SlangHangResponse
from app.services.slang_hang import slang_hang_service

# Configure logger
logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/conversation", response_model=SlangHangResponse)
async def create_slang_conversation(request: SlangHangRequest):
    """
    Generate a slang-based conversation in the target language
    """
    try:
        return await slang_hang_service.generate_slang_conversation(
            request.sourceLanguage,
            request.targetLanguage
        )
    except Exception as e:
        logger.error(f"Error processing slang conversation request: {str(e)}")
        raise HTTPException(
            status_code=500, detail="Failed to generate slang conversation")
