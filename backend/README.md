# FastAPI YouTube Transcription & Summary (Gemini)

⚡ Quick backend that accepts a YouTube URL, transcribes it (using youtube-transcript-api), and summarizes it with Google Gemini (Generative Language API) via an API key.

## Features
- POST /transcribe — returns transcript text
- POST /summarize — returns a concise summary

## Setup
1. Copy `.env.example` to `.env` and set `GEMINI_API_KEY` and `GEMINI_MODEL` (default shown).
2. Install deps: `pip install -r requirements.txt`
3. Run: `uvicorn app.main:app --reload --port 8000`

## Example

Transcribe and summarize:

curl -X POST "http://localhost:8000/summarize" -H "Content-Type: application/json" -d \
'{"youtube_url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'

## Notes
- The Gemini integration uses the Google Generative Language REST endpoint by default. If your workspace uses a different endpoint or request shape, update `app/summarizer.py` accordingly.
- If a transcript cannot be found, the service returns an informative error.

---
🔧 Developed: FastAPI + youtube-transcript-api + HTTPX
