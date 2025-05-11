import logging
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from pydantic import ValidationError

# Configure logger
logger = logging.getLogger(__name__)


async def validation_exception_handler(request: Request, exc: ValidationError):
    """
    Handle Pydantic validation errors
    """
    logger.warning(f"Validation error: {exc}")
    return JSONResponse(
        status_code=422,
        content={
            "detail": "Validation Error",
            "errors": exc.errors()
        }
    )


async def http_exception_handler(request: Request, exc: HTTPException):
    """
    Handle HTTP exceptions
    """
    logger.warning(f"HTTP exception: {exc.status_code} - {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail}
    )


async def generic_exception_handler(request: Request, exc: Exception):
    """
    Handle all other exceptions
    """
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"error": "An error occurred while processing the request."}
    )
