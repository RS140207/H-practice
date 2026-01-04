# Frontend — YouTube Transcribe + Gemini (Minimal React)

This is a minimal, clean React frontend (Vite) to interact with the FastAPI backend in `backend`.

Quick start

1. Install dependencies

```bash
cd Frontend
npm install
```

2. Run dev server

```bash
npm run dev
```

3. Open the URL shown by Vite (usually `http://localhost:5173`).

Notes

- The frontend calls the backend at `http://127.0.0.1:8000` by default. Ensure your FastAPI backend is running.
- If you get CORS errors, enable CORS in the FastAPI app. Add the following to `backend/app/main.py` before creating routes:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

- The frontend uses the `/transcribe` endpoint to POST a JSON body `{ "youtube_url": "..." }` and displays returned `video_id` and `transcript`.

Files added

- Frontend/package.json
- Frontend/index.html
- Frontend/src/main.jsx
- Frontend/src/App.jsx
- Frontend/src/styles.css
- Frontend/src/components/* (Header, Footer, ApiCard, TranscribeForm)

If you want Tailwind instead, or a proxy to avoid CORS changes, I can update the scaffold. Want me to enable CORS in `backend/app/main.py` for you? (I can patch it.)
