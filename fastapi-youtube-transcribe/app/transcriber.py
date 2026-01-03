from typing import List
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound


def extract_video_id(url: str) -> str:
    """Extracts the YouTube video id from common URL formats."""
    # naive but practical extractor
    url = url.strip()
    if "v=" in url:
        parts = url.split("v=")
        vid = parts[1].split("&")[0]
        return vid
    if "youtu.be/" in url:
        parts = url.split("youtu.be/")
        vid = parts[1].split("?")[0]
        return vid
    return url  # assume the caller provided just the id


def get_transcript_text(video_id: str, languages: List[str] = ["en"]) -> str:
    """Fetches and concatenates transcript segments into a single string."""
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=languages)
    except TranscriptsDisabled:
        raise RuntimeError("Transcripts are disabled for this video")
    except NoTranscriptFound:
        raise RuntimeError("No transcript found for this video")

    segments = [seg.get("text", "") for seg in transcript]
    # join intelligently to preserve spacing
    text = " ".join(s.strip().replace("\n", " ") for s in segments if s.strip())
    return text
