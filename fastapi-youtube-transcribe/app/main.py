import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, HttpUrl

from .transcriber import extract_video_id, get_transcript_text
from .summarizer import summarize_transcript

app = FastAPI(title="YouTube Transcribe + Gemini Summary")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL") or "models/text-bison-001"
GEMINI_MAX_CHARS = int(os.getenv("GEMINI_MAX_CHARS") or 6000)


class URLRequest(BaseModel):
    youtube_url: str
    api_key: str | None = None
    model: str | None = None


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/transcribe")
async def transcribe(req: URLRequest):
    try:
        video_id = extract_video_id(req.youtube_url)
        text = get_transcript_text(video_id)
        return {"video_id": video_id, "transcript": text}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/summarize")
async def summarize(req: URLRequest):
    api_key = req.api_key or GEMINI_API_KEY
    model = req.model or GEMINI_MODEL
    if not api_key:
        raise HTTPException(status_code=400, detail="Gemini API key not set. Provide in request or set GEMINI_API_KEY env var.")

    try:
        video_id = extract_video_id(req.youtube_url)
        transcript = get_transcript_text(video_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Transcript error: {e}")

    try:
        summary = await summarize_transcript(transcript, api_key, model, max_chars=GEMINI_MAX_CHARS)
        return {"video_id": video_id, "summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Summarization error: {e}")
