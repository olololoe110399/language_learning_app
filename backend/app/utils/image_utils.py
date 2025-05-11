import base64
import logging
from fastapi import HTTPException

from app.config import settings

# Configure logger
logger = logging.getLogger(__name__)


def validate_image(image_data: str, mime_type: str) -> None:
    """
    Validate an image for processing
    
    Args:
        image_data: Base64-encoded image data
        mime_type: MIME type of the image
        
    Raises:
        HTTPException: If the image is invalid
    """
    try:
        # Check mime type
        if mime_type not in settings.SUPPORTED_IMAGE_TYPES:
            logger.warning(f"Unsupported image type: {mime_type}")
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported image type. Supported types: {', '.join(settings.SUPPORTED_IMAGE_TYPES)}"
            )

        # Decode image to check if it's valid
        if "base64," in image_data:
            # Remove the data URL prefix if present
            image_data = image_data.split("base64,")[1]

        try:
            decoded_data = base64.b64decode(image_data)
        except Exception as e:
            logger.warning(f"Invalid base64 image data: {str(e)}")
            raise HTTPException(status_code=400, detail="Invalid image data")

        # Check image size
        image_size_mb = len(decoded_data) / (1024 * 1024)
        if image_size_mb > settings.MAX_IMAGE_SIZE_MB:
            logger.warning(f"Image too large: {image_size_mb:.2f} MB")
            raise HTTPException(
                status_code=400,
                detail=f"Image too large. Maximum size: {settings.MAX_IMAGE_SIZE_MB} MB"
            )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error validating image: {str(e)}")
        raise HTTPException(status_code=400, detail="Invalid image")
