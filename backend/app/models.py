from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class RecordingCreate(BaseModel):
    audio_data: str  # Base64 encoded audio data
    timestamp: Optional[datetime] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    city: Optional[str] = None

class RecordingResponse(BaseModel):
    id: str
    text: str
    timestamp: datetime
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    city: Optional[str] = None
    created_at: datetime

class MemorySearchQuery(BaseModel):
    query: str
    limit: Optional[int] = 10

class MemorySearchResult(BaseModel):
    id: str
    text: str
    timestamp: datetime
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    city: Optional[str] = None
    similarity: float
