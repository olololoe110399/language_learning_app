from pydantic import BaseModel, Field
from typing import List
from app.models.tiny_lesson import LanguageRequest


class SlangHangRequest(LanguageRequest):
    """Request model for Slang Hang endpoint"""
    pass


class DialogueLine(BaseModel):
    """Model for a line of dialogue"""
    speaker: str = Field(..., description="The name of the speaker")
    message: str = Field(
        ..., description="The spoken message containing slang or idiomatic expressions")
    notes: str = Field(...,
                       description="Notes explaining the slang or idioms used")


class SlangHangResponse(BaseModel):
    """Response model for Slang Hang endpoint"""
    context: str = Field(...,
                         description="The conversational context or setting")
    dialogue: List[DialogueLine] = Field(...,
                                         description="The dialogue between speakers")
