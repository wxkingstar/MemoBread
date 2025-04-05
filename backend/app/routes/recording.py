from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
import uuid
from datetime import datetime

from ..models import RecordingCreate, RecordingResponse
from ..services.speech_service import SpeechToTextService
from ..services.location_service import LocationService

router = APIRouter(prefix="/api/recordings", tags=["recordings"])

recordings_db = {}

speech_service = SpeechToTextService()
location_service = LocationService()

@router.post("/", response_model=RecordingResponse)
async def create_recording(recording: RecordingCreate):
    """
    Create a new voice recording entry.
    
    This endpoint:
    1. Receives audio data and metadata
    2. Converts speech to text
    3. Resolves location data if coordinates are provided
    4. Stores the recording
    """
    recording_id = str(uuid.uuid4())
    
    if not recording.timestamp:
        recording.timestamp = datetime.now()
    
    text = await speech_service.convert_speech_to_text(recording.audio_data)
    
    city = None
    if recording.latitude and recording.longitude:
        city = await location_service.get_city_from_coordinates(
            recording.latitude, recording.longitude
        )
    
    recording_obj = {
        "id": recording_id,
        "text": text,
        "timestamp": recording.timestamp,
        "latitude": recording.latitude,
        "longitude": recording.longitude,
        "city": city or recording.city,
        "created_at": datetime.now()
    }
    
    recordings_db[recording_id] = recording_obj
    
    return recording_obj

@router.get("/", response_model=List[RecordingResponse])
async def list_recordings():
    """Get all recordings."""
    return list(recordings_db.values())

@router.get("/{recording_id}", response_model=RecordingResponse)
async def get_recording(recording_id: str):
    """Get a specific recording by ID."""
    if recording_id not in recordings_db:
        raise HTTPException(status_code=404, detail="Recording not found")
    
    return recordings_db[recording_id]

@router.delete("/{recording_id}")
async def delete_recording(recording_id: str):
    """Delete a recording by ID."""
    if recording_id not in recordings_db:
        raise HTTPException(status_code=404, detail="Recording not found")
    
    del recordings_db[recording_id]
    return {"message": "Recording deleted successfully"}
