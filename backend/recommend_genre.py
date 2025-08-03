import sys
import json
import os
from google import genai
from google.genai import types

def generate_genre(bpm, wave_data):
    # Load .env
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
                Based on mainstream music trends, suggest the single best-fitting genre for a song 
                with a BPM of {bpm} and the following brainwave metrics:
                
                Calmness score: {wave_data["calmness_score"]}

                Only respond with the genre name (e.g., "Lo-fi", "R&B", "EDM", "Pop Rock").
                Do NOT return song titles or artists. 
                Your response should be only the genre name, nothing else.

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
        
        return json.dumps({
            "genre": response_text,
            "wave_data": wave_data
        })
    
    except Exception as e:
        return json.dumps({"bpm": bpm, "error": str(e)})

