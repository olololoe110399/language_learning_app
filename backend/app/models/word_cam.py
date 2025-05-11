from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from app.models.tiny_lesson import LanguageRequest


class InlineData(BaseModel):
    """Model for inline image data"""
    data: str = Field(..., description="Base64 encoded image data")
    mimeType: str = Field(..., description="MIME type of the image")


class Image(BaseModel):
    """Model for image data"""
    inlineData: InlineData = Field(..., description="Inline image data")


class ImageDimensions(BaseModel):
    """Model for image dimensions"""
    width: int = Field(..., description="Image width in pixels")
    height: int = Field(..., description="Image height in pixels")


class ObjectDescriptorRequest(LanguageRequest):
    """Request model for Object Descriptor endpoint"""
    object: str = Field(..., description="The object to describe")
    image: Image = Field(..., description="Image containing the object")


class Descriptor(BaseModel):
    """Model for an object descriptor"""
    descriptor: str = Field(...,
                            description="A descriptive word or phrase for the object")
    exampleSentence: str = Field(...,
                                 description="Example sentence using the descriptor")


class ObjectDescriptorResponse(BaseModel):
    """Response model for Object Descriptor endpoint"""
    descriptors: List[Descriptor] = Field(...,
                                          description="List of descriptors for the object")


class DetectObjectsRequest(LanguageRequest):
    """Request model for Detect Objects endpoint"""
    image: Image = Field(..., description="Image to detect objects in")
    imageDimensions: ImageDimensions = Field(...,
                                             description="Dimensions of the image")


class DetectedObject(BaseModel):
    """Model for a detected object"""
    name: str = Field(..., description="Name of the detected object")
    pronunciation: Optional[str] = Field(
        "", description="Pronunciation of the object name")
    translation: str = Field(..., description="Translation of the object name")
    coordinates: List[float] = Field(...,
                                     description="Bounding box coordinates [x1, y1, x2, y2]")


class DetectObjectsResponse(BaseModel):
    """Response model for Detect Objects endpoint"""
    objects: List[DetectedObject] = Field(...,
                                          description="List of detected objects")
