from pathlib import Path
import sys
import json
import os
from dotenv import load_dotenv
from google import genai
from google.genai import types

def ask_gemini(prompt):
    """Helper function to query Gemini and return plain text."""
    load_dotenv(Path(__file__).parent / ".env")
    
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return "No API key"
    
    client = genai.Client(api_key=api_key)
    model = "gemini-2.5-flash-lite"
    
    response_text = ""
    for chunk in client.models.generate_content_stream(
        model=model,
        contents=[types.Content(role="user", parts=[types.Part.from_text(text=prompt)])],
    ):
        if chunk.text:
            response_text += chunk.text.strip()
    
    return response_text.strip()

def generate_songs(bpm, genre):
    """Get song recommendation one field at a time for stability."""
    
    title = ask_gemini(f"Give me ONLY the title of a popular {genre} song with BPM around {bpm}. No extra words.")
    artist = ask_gemini(f"Give me ONLY the artist of the song '{title}'. No extra words.")
    album = ask_gemini(f"Give me ONLY the album name of the song '{title}' by '{artist}'. No extra words.")
    
    return json.dumps({
        "title": title,
        "artist": artist,
        "album": album,
        "bpm": bpm,
        "genre": genre
    })
