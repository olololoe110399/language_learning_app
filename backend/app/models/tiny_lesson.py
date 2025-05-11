from pydantic import BaseModel, Field
from typing import List, Optional


class LanguageRequest(BaseModel):
    """Base request model for language learning endpoints"""
    sourceLanguage: str = Field(...,
                                description="The source language of the user")
    targetLanguage: str = Field(...,
                                description="The target language the user wants to learn")


class TinyLessonRequest(LanguageRequest):
    """Request model for Tiny Lesson endpoint"""
    purpose: str = Field(...,
                         description="The context or purpose for learning the vocabulary")


class VocabularyTerm(BaseModel):
    """Model for vocabulary term"""
    term: str = Field(...,
                      description="The vocabulary term in the target language")
    transliteration: Optional[str] = Field(
        "", description="Transliteration of the term (for non-Latin scripts)")
    translation: str = Field(...,
                             description="Translation or explanation of the term")


class Phrase(BaseModel):
    """Model for a useful phrase"""
    phrase: str = Field(..., description="The phrase in the target language")
    transliteration: Optional[str] = Field(
        "", description="Transliteration of the phrase (for non-Latin scripts)")
    translation: str = Field(...,
                             description="Translation or explanation of the phrase")


class TinyLessonResponse(BaseModel):
    """Response model for Tiny Lesson endpoint"""
    vocabulary: List[VocabularyTerm] = Field(
        ..., description="List of relevant vocabulary terms")
    phrases: List[Phrase] = Field(...,
                                  description="List of useful phrases for the given context")
