from fastapi import Depends, HTTPException, status
import logging
import time
from typing import Dict, Optional

from app.config import settings

# Configure logger
logger = logging.getLogger(__name__)

# Rate limiting


class RateLimiter:
    """
    Simple in-memory rate limiter to protect API endpoints
    """

    def __init__(self):
        self.requests = {}
        self.window_size = 60  # Window size in seconds
        self.limit = settings.RATE_LIMIT_PER_MINUTE

    def _cleanup_old_requests(self, client_id: str):
        """Remove requests older than the window size"""
        current_time = time.time()
        self.requests[client_id] = [
            timestamp for timestamp in self.requests.get(client_id, [])
            if current_time - timestamp < self.window_size
        ]

    def check_rate_limit(self, client_id: str) -> bool:
        """Check if the client has exceeded the rate limit"""
        if not client_id:
            return True

        self._cleanup_old_requests(client_id)

        # Check if the client has exceeded the rate limit
        if len(self.requests.get(client_id, [])) >= self.limit:
            return False

        # Add the current request
        current_time = time.time()
        if client_id not in self.requests:
            self.requests[client_id] = []
        self.requests[client_id].append(current_time)

        return True


# Create global rate limiter
rate_limiter = RateLimiter()


async def get_client_id(user_agent: Optional[str] = None) -> str:
    """
    Get a client ID from the request headers
    
    Note: In a production environment, you would use a more robust
    identification method, such as API keys or tokens.
    """
    # Simple hash of the user agent as client ID
    return str(hash(user_agent if user_agent else "unknown"))


async def check_rate_limit(client_id: str = Depends(get_client_id)):
    """
    Dependency to check rate limits
    
    Args:
        client_id: Client identifier
        
    Raises:
        HTTPException: If rate limit is exceeded
    """
    if not rate_limiter.check_rate_limit(client_id):
        logger.warning(f"Rate limit exceeded for client: {client_id}")
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded. Please try again later."
        )

    return True

# Additional dependencies can be added here as needed
