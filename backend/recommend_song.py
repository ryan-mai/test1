import sys
import json
import os
from google import genai
from google.genai import types

def generate_song(bpm, genre):
    # Load .env if present
    try:
        from dotenv import load_dotenv
        load_dotenv('.env')
    except ImportError:
        pass
    
    api_key = "AIzaSyCQySRJoHbyT9oP02Xes1fFa-nIdr6rr3s"
    
    if not api_key:
        print(json.dumps({"error": "No Gemini API key provided"}))
        return
    
    client = genai.Client(api_key=api_key)
    
    model = "gemini-2.5-flash-lite"
    
    contents = [
        types.Content(
            role="user",
            parts=[ 
                types.Part.from_text(text=f"""
                Based on mainstream music trends, recommend ONE specific popular song 
                that matches:
                - BPM: {bpm}
                - Genre: {genre}

                Respond in this **exact JSON format** only:
                {{
                  "title": "[Song Title]",
                  "artist": "[Artist Name]",
                  "album": "[Album Name]",
                  "bpm": {bpm},
                  "genre": "{genre}"
                }}

                Do NOT include any explanations or extra text. Output only valid JSON.
                """),
            ],
        ),
    ]
    
    try:
        response_text = ""
        for chunk in client.models.generate_content_stream(
            model=model,
            contents=contents,
        ):
            if chunk.text:
                response_text += chunk.text.strip()
        
        # Return Gemini's JSON response directly
        return response_text
    
    except Exception as e:
        return json.dumps({"bpm": bpm, "error": str(e)})
