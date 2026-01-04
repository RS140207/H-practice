import os
from dotenv import load_dotenv

load_dotenv(".env.local")
load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .transcriber import extract_video_id, get_transcript_text
from .summarizer import summarize_transcript

app = FastAPI(title="YouTube Transcribe + Gemini Summary")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

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
    print(f"DEBUG: API Key present: {bool(api_key)}")
    print(f"DEBUG: Model: {model}")

    if not api_key:
        print("DEBUG: Missing API Key")
        raise HTTPException(status_code=400, detail="Gemini API key not set. Set GEMINI_API_KEY in your environment.")
    if not model:
        print("DEBUG: Missing Model")
        raise HTTPException(status_code=400, detail="Gemini model not set. Set GEMINI_MODEL in your environment.")

    try:
        video_id = extract_video_id(req.youtube_url)
        transcript = get_transcript_text(video_id)
    except Exception as e:
        print(f"DEBUG: Transcript error: {e}")
        raise HTTPException(status_code=400, detail=f"Transcript error: {e}")

    try:
        summary = await summarize_transcript(transcript, api_key, model, max_chars=GEMINI_MAX_CHARS)
        return {"video_id": video_id, "summary": summary}
    except Exception as e:
        print(f"DEBUG: Summary error: {e}")
        raise HTTPException(status_code=500, detail=f"Summarization error: {e}")
