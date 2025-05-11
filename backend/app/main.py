from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time
import logging

from app.api import tiny_lesson, grammar, slang_hang, word_cam
from app.config import settings

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Little Language Lessons API",
    description="AI-powered language learning application using Google Gemini API",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add middleware for request timing


@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

# Global exception handler


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"error": "An error occurred while processing the request."}
    )

# Include routers
app.include_router(tiny_lesson.router, tags=["Tiny Lesson"])
app.include_router(grammar.router, tags=["Grammar"])
app.include_router(slang_hang.router, tags=["Slang Hang"])
app.include_router(word_cam.router, tags=["Word Cam"])


@app.get("/", tags=["Health Check"])
async def root():
    """Health check endpoint"""
    return {"status": "healthy", "message": "Little Language Lessons API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
