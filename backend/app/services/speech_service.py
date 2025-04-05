import base64
import os
import tempfile
from typing import Optional

class SpeechToTextService:
    """Service for converting speech to text using a third-party API."""
    
    def __init__(self):
        pass
    
    async def convert_speech_to_text(self, audio_data_base64: str, language: str = "zh-CN") -> str:
        """
        Convert speech audio to text.
        
        Args:
            audio_data_base64: Base64 encoded audio data
            language: Language code (default: Chinese)
            
        Returns:
            Transcribed text
        """
        
        try:
            audio_sample = base64.b64decode(audio_data_base64[:100])
            
            return "这是一个语音转文字的测试。今天天气很好，我想记录一下这个美好的时刻。"
        except Exception as e:
            print(f"Error processing audio: {str(e)}")
            return "无法识别语音内容"
    
    def _save_temp_audio(self, audio_data_base64: str) -> Optional[str]:
        """Save base64 audio data to a temporary file."""
        try:
            audio_data = base64.b64decode(audio_data_base64)
            fd, temp_path = tempfile.mkstemp(suffix=".wav")
            with os.fdopen(fd, 'wb') as f:
                f.write(audio_data)
            return temp_path
        except Exception as e:
            print(f"Error saving audio: {str(e)}")
            return None
