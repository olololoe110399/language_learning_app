from pydantic import BaseModel, Field
from typing import List
from app.models.tiny_lesson import LanguageRequest


class GrammarRequest(LanguageRequest):
    """Request model for Grammar endpoint"""
    purpose: str = Field(...,
                         description="The context or purpose for learning the grammar")


class GrammarExample(BaseModel):
    """Model for grammar example"""
    sentence: str = Field(...,
                          description="An example sentence demonstrating the grammar rule")
    explanation: str = Field(
        ..., description="Explanation of how the grammar rule is applied in the sentence")


class GrammarTopic(BaseModel):
    """Model for a grammar topic"""
    topic: str = Field(...,
                       description="The grammar topic relevant to the context")
    description: str = Field(...,
                             description="Description of the grammar rule")
    examples: List[GrammarExample] = Field(
        ..., description="Examples of the grammar rule in use")


class GrammarResponse(BaseModel):
    """Response model for Grammar endpoint"""
    relevantGrammar: List[GrammarTopic] = Field(
        ..., description="List of relevant grammar topics")
