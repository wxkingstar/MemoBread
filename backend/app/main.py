from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psycopg
from .routes.recording import router as recording_router

app = FastAPI(
    title="MemoBread API",
    description="API for MemoBread voice recording and memory retrieval application",
    version="0.1.0"
)

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(recording_router)

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}
