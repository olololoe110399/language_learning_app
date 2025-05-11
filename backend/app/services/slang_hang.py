import logging
from typing import Dict, Any, List
from google.genai import types
from app.services.gemini_service import gemini_service
from app.models.slang_hang import SlangHangResponse, DialogueLine

# Configure logger
logger = logging.getLogger(__name__)


class SlangHangService:
    """Service for generating slang-based dialogues"""

    async def generate_slang_conversation(self, source_language: str, target_language: str) -> SlangHangResponse:
        """
        Generate a slang-based conversation in the target language

        Args:
            source_language: User's source language
            target_language: Target language to learn

        Returns:
            SlangHangResponse with conversation context and dialogue
        """
        try:
            # Define the function declaration for Gemini API
            function_declarations: List[types.FunctionDeclaration] = [
                types.FunctionDeclaration(
                    name="generate_slang_conversation",
                    description="Generate a conversation that includes slang and idiomatic expressions",
                    parameters=types.Schema(
                        type=types.Type.OBJECT,
                        properties={
                                "context": types.Schema(type="string", description="The conversational context or setting"),
                                "dialogue": types.Schema(
                                    type=types.Type.ARRAY,
                                    description="The dialogue between speakers with slang expressions",
                                    items=types.Schema(
                                        type=types.Type.OBJECT,
                                        properties={
                                                "speaker": types.Schema(type="string", description="The name of the speaker"),
                                                "message": types.Schema(type="string", description="The spoken message containing slang or idiomatic expressions"),
                                                "notes": types.Schema(type="string", description="Notes explaining the slang or idioms used"),
                                        },
                                        required=["speaker",
                                                  "message", "notes"]
                                    )
                                )
                        },
                        required=["context", "dialogue"]

                    )
                )
            ]

            # Create the prompt for Gemini API
            prompt = f"""
            You are a language learning assistant that helps users learn slang and idiomatic expressions.
            
            Create a natural conversation in {target_language} that includes common slang and idiomatic expressions.
            The conversation should be accessible to a {source_language} speaker who wants to learn how 
            to speak more naturally like a native {target_language} speaker.
            
            The dialogue should:
            1. Take place in a realistic everyday scenario
            2. Include 5-7 conversational exchanges
            3. Use slang and idiomatic expressions that are commonly used by native speakers
            4. Include explanatory notes for each expression to help the learner understand the meaning
            
            Make sure the slang and expressions are modern, commonly used, and appropriate for casual conversations.
            
            Respond with the function call to generate_slang_conversation.
            """

            # Call Gemini API
            response = await gemini_service.call_gemini_with_function(prompt, function_declarations)

            if response and response.get("name") == "generate_slang_conversation":
                args = response.get("args", {})

                # Convert the response to our model
                dialogue_lines = [
                    DialogueLine(
                        speaker=line.get("speaker", ""),
                        message=line.get("message", ""),
                        notes=line.get("notes", "")
                    )
                    for line in args.get("dialogue", [])
                ]

                return SlangHangResponse(
                    context=args.get("context", ""),
                    dialogue=dialogue_lines
                )
            else:
                logger.error("Invalid response from Gemini API")
                raise ValueError("Invalid response from Gemini API")

        except Exception as e:
            logger.error(f"Error generating slang conversation: {str(e)}")
            raise


slang_hang_service = SlangHangService()
