import logging
from typing import Dict, Any, List
from google.genai import types
from app.services.gemini_service import gemini_service
from app.models.word_cam import ObjectDescriptorResponse, Descriptor, DetectObjectsResponse, DetectedObject

# Configure logger
logger = logging.getLogger(__name__)


class WordCamService:
    """Service for image-based vocabulary learning"""

    async def generate_object_descriptors(
        self,
        source_language: str,
        target_language: str,
        object_name: str,
        image_data: str,
        mime_type: str
    ) -> ObjectDescriptorResponse:
        """
        Generate descriptors for an object in an image

        Args:
            source_language: User's source language
            target_language: Target language to learn
            object_name: Name of the object to describe
            image_data: Base64-encoded image data
            mime_type: MIME type of the image

        Returns:
            ObjectDescriptorResponse with descriptors
        """
        try:
            # Define the function declaration for Gemini API
            function_declarations: List[types.FunctionDeclaration] = [
                types.FunctionDeclaration(
                    name="generate_object_descriptors",
                    description="Generate descriptive words or phrases for an object in an image",
                    parameters=types.Schema(
                        type=types.Type.OBJECT,
                        properties={
                            "descriptors": types.Schema(
                                type=types.Type.ARRAY,
                                description="List of descriptors for the object",
                                items=types.Schema(
                                    type=types.Type.OBJECT,
                                    properties={
                                        "descriptor": types.Schema(type="string", description="A descriptive word or phrase for the object"),
                                        "exampleSentence": types.Schema(type="string", description="Example sentence using the descriptor")
                                    },
                                    required=["descriptor", "exampleSentence"]
                                ))
                        },
                        required=["descriptors"]
                    )
                )
            ]

            # Create the prompt for Gemini API
            prompt = f"""
            You are a language learning assistant that helps users learn descriptive vocabulary.
            
            Look at the image and focus on the {object_name}. Generate 5-7 descriptive words or phrases in {target_language} 
            that would be helpful for a {source_language} speaker to describe this {object_name}.
            
            For each descriptor:
            1. Provide a descriptive word or phrase that is commonly used to describe this type of object
            2. Include an example sentence using the descriptor in a natural way
            
            The descriptors should be specific and varied, covering different aspects of the object 
            (appearance, function, quality, etc.).
            
            Respond with the function call to generate_object_descriptors.
            """

            # Call Gemini Vision API
            response = await gemini_service.call_gemini_vision_with_function(
                prompt, image_data, mime_type, function_declarations
            )

            if response and response.get("name") == "generate_object_descriptors":
                args = response.get("args", {})

                # Convert the response to our model
                descriptors = [
                    Descriptor(
                        descriptor=item.get("descriptor", ""),
                        exampleSentence=item.get("exampleSentence", "")
                    )
                    for item in args.get("descriptors", [])
                ]

                return ObjectDescriptorResponse(descriptors=descriptors)
            else:
                logger.error("Invalid response from Gemini API")
                raise ValueError("Invalid response from Gemini API")

        except Exception as e:
            logger.error(f"Error generating object descriptors: {str(e)}")
            raise

    async def detect_objects(
        self,
        source_language: str,
        target_language: str,
        image_data: str,
        mime_type: str,
        image_width: int,
        image_height: int
    ) -> DetectObjectsResponse:
        """
        Detect objects in an image and provide translations

        Args:
            source_language: User's source language
            target_language: Target language to learn
            image_data: Base64-encoded image data
            mime_type: MIME type of the image
            image_width: Width of the image in pixels
            image_height: Height of the image in pixels

        Returns:
            DetectObjectsResponse with detected objects
        """
        try:
            # Define the function declaration for Gemini API
            function_declarations: List[types.FunctionDeclaration] = [
                types.FunctionDeclaration(
                    name="detect_objects",
                    description="Detect objects in an image and provide translations",
                    parameters=types.Schema(
                         type=types.Type.OBJECT,
                        properties={
                            "objects": types.Schema(
                                type=types.Type.ARRAY,
                                description="List of detected objects",
                                items=types.Schema(
                                    type=types.Type.OBJECT,
                                    properties={
                                        "name": types.Schema(type="string", description="Name of the detected object"),
                                        "pronunciation": types.Schema(type="string", description="Pronunciation of the object name"),
                                        "translation": types.Schema(type="string", description="Translation of the object name"),
                                        "coordinates": types.Schema(
                                            type=types.Type.ARRAY,
                                            description="Bounding box coordinates [x1, y1, x2, y2]",
                                            items=types.Schema(
                                                type=types.Type.NUMBER),
                                            minItems=4,
                                            maxItems=4
                                        )
                                    },
                                    required=["name", "translation", "coordinates"]
                                )
                            )
                        },
                        required=["objects"]
                    )
                )
            ]

            # Create the prompt for Gemini API
            prompt = f"""
            You are a language learning assistant that helps users identify objects in images.
            
            Look at the image and identify the main objects present. For each object:
            1. Provide the name in {target_language}
            2. If {target_language} uses a non-Latin script, provide pronunciation guidance
            3. Provide a translation in {source_language}
            4. Determine the bounding box coordinates of the object in the image
               - Format as [x1, y1, x2, y2] where:
                 - (x1, y1) is the top-left corner
                 - (x2, y2) is the bottom-right corner
                 - Coordinates are pixel values (image width: {image_width}, height: {image_height})
            
            Identify 3-7 main objects in the image. Focus on distinct, clearly visible objects.
            
            Respond with the function call to detect_objects.
            """

            # Call Gemini Vision API
            response = await gemini_service.call_gemini_vision_with_function(
                prompt, image_data, mime_type, function_declarations
            )

            if response and response.get("name") == "detect_objects":
                args = response.get("args", {})

                # Convert the response to our model
                detected_objects = [
                    DetectedObject(
                        name=obj.get("name", ""),
                        pronunciation=obj.get("pronunciation", ""),
                        translation=obj.get("translation", ""),
                        coordinates=obj.get("coordinates", [0, 0, 0, 0])
                    )
                    for obj in args.get("objects", [])
                ]

                return DetectObjectsResponse(objects=detected_objects)
            else:
                logger.error("Invalid response from Gemini API")
                raise ValueError("Invalid response from Gemini API")

        except Exception as e:
            logger.error(f"Error detecting objects: {str(e)}")
            raise


word_cam_service = WordCamService()
