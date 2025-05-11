from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
import logging
from typing import Optional

from app.models.word_cam import (
    ObjectDescriptorRequest,
    ObjectDescriptorResponse,
    DetectObjectsRequest,
    DetectObjectsResponse
)
from app.services.word_cam import word_cam_service
from app.utils.image_utils import validate_image

# Configure logger
logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/object-descriptors", response_model=ObjectDescriptorResponse)
async def create_object_descriptors(request: ObjectDescriptorRequest):
    """
    Generate descriptors for an object in an image
    """
    try:
        # Validate the image
        image_data = request.image.inlineData.data
        mime_type = request.image.inlineData.mimeType
        validate_image(image_data, mime_type)

        return await word_cam_service.generate_object_descriptors(
            request.sourceLanguage,
            request.targetLanguage,
            request.object,
            image_data,
            mime_type
        )
    except Exception as e:
        logger.error(f"Error processing object descriptors request: {str(e)}")
        raise HTTPException(
            status_code=500, detail="Failed to generate object descriptors")


@router.post("/detect-objects", response_model=DetectObjectsResponse)
async def detect_objects(request: DetectObjectsRequest):
    """
    Detect objects in an image and provide translations
    """
    try:
        # Validate the image
        image_data = request.image.inlineData.data
        mime_type = request.image.inlineData.mimeType
        validate_image(image_data, mime_type)

        return await word_cam_service.detect_objects(
            request.sourceLanguage,
            request.targetLanguage,
            image_data,
            mime_type,
            request.imageDimensions.width,
            request.imageDimensions.height
        )
    except Exception as e:
        logger.error(f"Error processing detect objects request: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to detect objects")
