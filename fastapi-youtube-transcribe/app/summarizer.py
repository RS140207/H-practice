import os
from typing import List
import httpx


async def call_gemini(api_key: str, model: str, prompt: str, max_output_tokens: int = 800) -> str:
    """Calls the Google Generative Language REST endpoint (adjustable) and returns text.

    NOTE: The request shape may vary by provider/model. If your account exposes a different
    REST contract for Gemini, update this function accordingly.
    """
    base = os.getenv("GEMINI_ENDPOINT") or "https://generativelanguage.googleapis.com/v1beta2"
    url = f"{base}/{model}:generate?key={api_key}"

    # Use the common "prompt" shape used by Generative Language API (text prompt)
    payload = {
        "prompt": {"text": prompt},
        "temperature": 0.2,
        "maxOutputTokens": max_output_tokens,
    }

    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.post(url, json=payload)
        r.raise_for_status()
        data = r.json()

    # Try a few common places the response text might appear
    # generativelanguage typically has: data['candidates'][0]['content']
    if isinstance(data, dict):
        cands = data.get("candidates") or data.get("outputs")
        if cands and len(cands) > 0:
            first = cands[0]
            return first.get("content") or first.get("text") or first.get("output") or ""

    return str(data)


def chunk_text(text: str, max_chars: int = 6000) -> List[str]:
    """Simple character-based chunking that tries to split on sentence boundaries."""
    text = text.strip()
    if len(text) <= max_chars:
        return [text]

    chunks = []
    start = 0
    while start < len(text):
        end = min(len(text), start + max_chars)
        # try to move end back to last period for cleaner sentence boundary
        if end < len(text):
            last_period = text.rfind(".", start, end)
            if last_period > start:
                end = last_period + 1
        chunks.append(text[start:end].strip())
        start = end
    return chunks


async def summarize_transcript(transcript: str, api_key: str, model: str, max_chars: int = 6000) -> str:
    # chunk transcript if long
    chunks = chunk_text(transcript, max_chars)

    chunk_summaries = []
    for i, c in enumerate(chunks):
        prompt = (
            f"Summarize the following transcript in concise bullet points (5-10) and a short 2-sentence summary.\n\nChunk {i+1}:\n" + c
        )
        s = await call_gemini(api_key, model, prompt)
        chunk_summaries.append(s)

    # combine chunk summaries for a final concise summary
    combined = "\n\n".join(chunk_summaries)
    final_prompt = (
        "You are a concise summarizer. Combine the following chunk summaries into: 1) 6 bullet points capturing the key ideas, and 2) a single 2-sentence overall summary.\n\n"
        + combined
    )
    final = await call_gemini(api_key, model, final_prompt, max_output_tokens=600)
    return final
