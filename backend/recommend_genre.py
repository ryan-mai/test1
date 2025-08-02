import sys
import json
import os
from google import genai
from google.genai import types

def generate(bpm):
    # Load .env if present
    try:
        from dotenv import load_dotenv
        load_dotenv('.env')
    except ImportError:
        pass  # dotenv is optional, but recommended
    
    api_key = os.environ.get("GEMINI_API_KEY")
    print("Successfully retrieving API key")

    if not api_key:
        print(json.dumps({"error": "No Gemini API key provided in .env or environment"}))
        return

    client = genai.Client(
        api_key=api_key,
    )

    model = "gemini-2.5-flash-lite"
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text=f"""Find a mainstream, popular, hip hop, tiktok, trendy, song. DO NOT Output a song with no song or artist The song MUST have a BPM lower than or equal to {bpm} (prefer exact {bpm} BPM if possible, but do not return any song with BPM above {bpm}). Respond with this exact format only: 'Song: [title]\nArtist: [artist]\nAlbum: [album name]\nBPM: [bpm]\nImage: [direct URL to album cover image]\nYouTube: [YouTube link]'"""),
            ],
        ),
    ]
    tools = [
        types.Tool(googleSearch=types.GoogleSearch()),
    ]
    generate_content_config = types.GenerateContentConfig(
        thinking_config=types.ThinkingConfig(
            thinking_budget=0,
        ),
        tools=tools,
    )

    try:
        response_text = ""
        for chunk in client.models.generate_content_stream(
            model=model,
            contents=contents,
            config=generate_content_config,
        ):
            if chunk.text:
                response_text += chunk.text
        
        # Verify that the BPM in the response meets our requirements
        try:
            # Try to extract the BPM from the response

            print(response_text)
            bpm_match = response_text.split("BPM: ")[1].split("\n")[0]
            returned_bpm = int(bpm_match.strip())
            
            # Check if the returned BPM is valid
            if returned_bpm < bpm:
                print(f"\nWarning: The returned song has BPM {returned_bpm}, which is less than the requested {bpm}", file=sys.stderr)
        except (IndexError, ValueError):
            # Couldn't parse the BPM from the response
            pass
        
        # Parse all song details
        song_details = {}
        try:
            # Extract song title
            if "Song: " in response_text:
                song_details["title"] = response_text.split("Song: ")[1].split("\n")[0].strip()
            
            # Extract artist
            if "Artist: " in response_text:
                song_details["artist"] = response_text.split("Artist: ")[1].split("\n")[0].strip()
                
            # Extract album
            if "Album: " in response_text:
                song_details["album"] = response_text.split("Album: ")[1].split("\n")[0].strip()
            
            # Extract BPM
            if "BPM: " in response_text:
                song_details["bpm"] = int(response_text.split("BPM: ")[1].split("\n")[0].strip())
                
            # Extract Image URL
            if "Image: " in response_text:
                song_details["imageUrl"] = response_text.split("Image: ")[1].split("\n")[0].strip()
                
            # Extract YouTube link
            if "YouTube: " in response_text:
                song_details["youtubeUrl"] = response_text.split("YouTube: ")[1].split("\n")[0].strip()
        except Exception as e:
            print(f"Error parsing song details: {str(e)}", file=sys.stderr)
        
        # Return a structured response
        return json.dumps({
            "bpm": bpm,
            "result": response_text,
            "songDetails": song_details
        })
    except Exception as e:
        error_msg = str(e)
        print(f"Error: {error_msg}", file=sys.stderr)
        return json.dumps({"bpm": bpm, "error": error_msg})