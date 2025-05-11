from fastapi import APIRouter, HTTPException, Depends
import logging

from app.models.grammar import GrammarRequest, GrammarResponse
from app.services.grammar import grammar_service

# Configure logger
logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/grammar", response_model=GrammarResponse)
async def create_grammar_lesson(request: GrammarRequest):
    """
    Generate grammar lessons for a specific language learning context
    """
    try:
        return await grammar_service.generate_grammar_lesson(
            request.sourceLanguage,
            request.targetLanguage,
            request.purpose
        )
    except Exception as e:
        logger.error(f"Error processing grammar lesson request: {str(e)}")
        raise HTTPException(
            status_code=500, detail="Failed to generate grammar lesson")
