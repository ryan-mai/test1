from pathlib import Path
import sys
import json
import os
from dotenv import load_dotenv
from google import genai
from google.genai import types

def generate_songs(bpm, genre, num_songs=8):
    load_dotenv(Path(__file__).parent / ".env")
    
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return json.dumps({"error": "No Gemini API key"})

    client = genai.Client(api_key=api_key)
    model = "gemini-2.5-flash-lite"

    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text=f"""
                Recommend {num_songs} popular songs matching:
                - BPM: {bpm}
                - Genre: {genre}

                Respond in **valid JSON** as:
                {{
                  "songs": [
                    {{"title": "...", "artist": "...", "album": "...", "bpm": {bpm}, "genre": "{genre}"}},
                    ...
                  ]
                }}
                """),
            ],
        ),
    ]

    try:
        response_text = ""
        for chunk in client.models.generate_content_stream(model=model, contents=contents):
            if chunk.text:
                response_text += chunk.text.strip()
        return response_text
    except Exception as e:
        return json.dumps({"error": str(e)})
