from google import genai
from google.genai import types
import base64
import json
import logging
from typing import Dict, Any, List, Optional, Union
import asyncio
from tenacity import retry, stop_after_attempt, wait_exponential

from app.config import settings

# Configure logger
logger = logging.getLogger(__name__)


class GeminiService:
    """Service for interacting with Google Gemini API"""

    def __init__(self):
        # Initialize Gemini API
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.model = settings.GEMINI_MODEL
        self.vision_model = settings.GEMINI_VISION_MODEL
        self.max_attempts = settings.MAX_ATTEMPTS
        self.timeout = settings.TIMEOUT_SECONDS

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=1, max=10))
    async def call_gemini_with_function(self, prompt: str, function_declarations: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Call Gemini API with function calling capabilities

        Args:
            prompt: The text prompt to send to Gemini
            function_declarations: List of function declarations

        Returns:
            Response from Gemini API
        """
        try:
            tools = types.Tool(function_declarations=function_declarations)
            config = types.GenerateContentConfig(
                temperature=0.2,
                top_p=0.95,
                top_k=64,
                tools=[tools]
            )
            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt,
                config=config,
            )
            # Extract function call information
            function_calls = []
            for candidate in response.candidates:
                for part in candidate.content.parts:
                    if hasattr(part, 'function_call'):
                        function_calls.append({
                            "name": part.function_call.name,
                            "args": part.function_call.args,
                        })

            if function_calls:
                return function_calls[0]
            else:
                logger.warning("No function call found in the response")
                raise ValueError("No function call found in the response")

        except Exception as e:
            logger.error(f"Error calling Gemini API: {str(e)}")
            raise

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=1, max=10))
    async def call_gemini_vision_with_function(
        self,
        prompt: str,
        image_data: str,
        mime_type: str,
        function_declarations: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Call Gemini API with vision capabilities and function calling

        Args:
            prompt: The text prompt to send to Gemini
            image_data: Base64-encoded image data
            mime_type: MIME type of the image
            function_declarations: List of function declarations

        Returns:
            Response from Gemini API
        """
        try:
            tools = types.Tool(function_declarations=function_declarations)
            config = types.GenerateContentConfig(
                temperature=0.2,
                top_p=0.95,
                top_k=64,
                tools=[tools]
            )
            # Prepare image data
            if "base64," in image_data:
                # Remove the data URL prefix if present
                image_data = image_data.split("base64,")[1]

            image_bytes = base64.b64decode(image_data)
            contents = [
                types.Part.from_text(text=prompt),
                types.Part.from_bytes(
                    mime_type=mime_type,
                    data=image_bytes,
                )
            ]
            response = self.client.models.generate_content(
                model=self.vision_model,
                contents=contents,
                config=config,
            )

            # Extract function call information
            function_calls = []
            for candidate in response.candidates:
                for part in candidate.content.parts:
                    if hasattr(part, 'function_call'):
                        function_calls.append({
                            "name": part.function_call.name,
                            "args": part.function_call.args,
                        })

            if function_calls:
                return function_calls[0]
            else:
                logger.warning("No function call found in the response")
                raise ValueError("No function call found in the response")

        except Exception as e:
            logger.error(f"Error calling Gemini Vision API: {str(e)}")
            raise


gemini_service = GeminiService()
