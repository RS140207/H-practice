from google import genai
from google.genai import types
from typing import List

async def call_gemini(api_key: str, model: str, prompt: str, max_output_tokens: int = 800) -> str:
    """Calls the Google GenAI SDK to generate content."""
    client = genai.Client(api_key=api_key)
    
    try:
        response = await client.aio.models.generate_content(
            model=model,
            contents=prompt,
            config=types.GenerateContentConfig(
                max_output_tokens=max_output_tokens,
                temperature=0.2
            )
        )
        return response.text if response.text else ""
    except Exception as e:
        return f"Error calling Gemini API: {e}"


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
