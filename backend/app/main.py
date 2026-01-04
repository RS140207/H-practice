import os
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from .transcriber import extract_video_id, get_transcript_text
from .summarizer import summarize_transcript

app = FastAPI(title="YouTube Transcribe + Gemini Summary")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL")
GEMINI_MAX_CHARS = int(os.getenv("GEMINI_MAX_CHARS") or 6000)


class URLRequest(BaseModel):
    youtube_url: str


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
    api_key = GEMINI_API_KEY
    model = GEMINI_MODEL
    if not api_key:
        raise HTTPException(status_code=400, detail="Gemini API key not set. Set GEMINI_API_KEY in your environment.")
    if not model:
        raise HTTPException(status_code=400, detail="Gemini model not set. Set GEMINI_MODEL in your environment.")

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
