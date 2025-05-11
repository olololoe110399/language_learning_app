import logging
from typing import Dict, Any, List
from google.genai import types
from app.services.gemini_service import gemini_service
from app.models.tiny_lesson import TinyLessonResponse, VocabularyTerm, Phrase

# Configure logger
logger = logging.getLogger(__name__)


class TinyLessonService:
    """Service for generating tiny language lessons"""

    async def generate_tiny_lesson(self, source_language: str, target_language: str, purpose: str) -> TinyLessonResponse:
        """
        Generate a tiny language lesson based on the provided context

        Args:
            source_language: User's source language
            target_language: Target language to learn
            purpose: Context or purpose for learning

        Returns:
            TinyLessonResponse with vocabulary and phrases
        """
        try:
            # Define the function declaration for Gemini API
            function_declarations: List[types.FunctionDeclaration] = [
                types.FunctionDeclaration(
                    name="generate_tiny_lesson",
                    description="Generate vocabulary and phrases for a specific language learning context",
                    parameters=types.Schema(
                        type=types.Type.OBJECT,
                        properties={
                            "vocabulary": types.Schema(
                                type=types.Type.ARRAY,
                                description="List of vocabulary terms relevant to the purpose",
                                items=types.Schema(
                                    type=types.Type.OBJECT,
                                    properties={
                                        "term": types.Schema(type="string", description="The vocabulary term in the target language"),
                                        "transliteration": types.Schema(type="string", description="Transliteration of the term (for non-Latin scripts)"),
                                        "translation":  types.Schema(type="string", description="Translation or explanation of the term")
                                    },
                                    required=["term", "translation"]
                                )
                            ),
                            "phrases": types.Schema(
                                type=types.Type.ARRAY,
                                description="List of useful phrases for the given context",
                                items=types.Schema(
                                    type=types.Type.OBJECT,
                                    properties={
                                        "phrase": types.Schema(type="string", description="The phrase in the target language"),
                                        "transliteration": types.Schema(type="string", description="Transliteration of the phrase (for non-Latin scripts)"),
                                        "translation": types.Schema(type="string", description="Translation or explanation of the phrase")
                                    },
                                    required=["phrase", "translation"]
                                )
                            )
                        },
                        required=["vocabulary", "phrases"]
                    )
                )
            ]

            # Create the prompt for Gemini API
            prompt = f"""
            You are a language learning assistant that helps users learn practical vocabulary and phrases.
            
            Create a list of vocabulary terms and useful phrases in {target_language} that would be helpful for a {source_language} speaker in the following context: {purpose}.
            
            The vocabulary should be specific to the context, not general language learning terms.
            Each phrase should be immediately useful and practical for the given context.
            If the target language uses a non-Latin script, provide transliteration.
            
            Respond with the function call to generate_tiny_lesson.
            """

            # Call Gemini API
            response = await gemini_service.call_gemini_with_function(prompt, function_declarations)

            if response and response.get("name") == "generate_tiny_lesson":
                args = response.get("args", {})

                # Convert the response to our model
                vocabulary_terms = [
                    VocabularyTerm(
                        term=item.get("term", ""),
                        transliteration=item.get("transliteration", ""),
                        translation=item.get("translation", "")
                    )
                    for item in args.get("vocabulary", [])
                ]

                phrases = [
                    Phrase(
                        phrase=item.get("phrase", ""),
                        transliteration=item.get("transliteration", ""),
                        translation=item.get("translation", "")
                    )
                    for item in args.get("phrases", [])
                ]

                return TinyLessonResponse(vocabulary=vocabulary_terms, phrases=phrases)
            else:
                logger.error("Invalid response from Gemini API")
                raise ValueError("Invalid response from Gemini API")

        except Exception as e:
            logger.error(f"Error generating tiny lesson: {str(e)}")
            raise


tiny_lesson_service = TinyLessonService()
