import sys
import json
import os
import requests
import base64
from google import genai
from google.genai import types

def generate(bpm):
    # Load .env if present
    try:
        from dotenv import load_dotenv
        load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))
    except ImportError:
        pass  # dotenv is optional, but recommended

    api_key = os.environ.get("GEMINI_API_KEY")
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

def calculate_bpm_from_eeg(band_data):
    """
    Calculate BPM based on EEG band powers.
    This is a simplified algorithm - in a real app, you'd use a more 
    sophisticated approach based on neurological research.
    """
    # Example formula: weight the bands differently to get a BPM
    # Alpha (relaxation) might suggest slower music
    # Beta and Gamma (alertness/focus) might suggest faster music
    
    delta_weight = 0.1  # deep sleep - slow
    theta_weight = 0.2  # meditation - moderate slow
    alpha_weight = 0.3  # relaxed - moderate
    beta_weight = 0.3   # alert - faster
    gamma_weight = 0.1  # high cognition - very fast
    
    # Normalize the weights to sum to 1
    total_weight = delta_weight + theta_weight + alpha_weight + beta_weight + gamma_weight
    
    # Calculate weighted BPM starting from a base of 60 BPM
    # Map to a range between 60-180 BPM
    try:
        base_bpm = 60
        bpm_range = 120
        
        weighted_sum = (
            delta_weight * band_data.get('delta', 0) +
            theta_weight * band_data.get('theta', 0) +
            alpha_weight * band_data.get('alpha', 0) +
            beta_weight * band_data.get('beta', 0) +
            gamma_weight * band_data.get('gamma', 0)
        )
        
        # Normalize the weighted sum (assuming each band is a percentage)
        normalized_weight = weighted_sum / total_weight / 100 if total_weight > 0 else 0.5
        
        # Calculate BPM in the range 60-180
        calculated_bpm = base_bpm + normalized_weight * bpm_range
        
        # Round to nearest integer
        return round(calculated_bpm)
    except Exception as e:
        print(f"Error calculating BPM: {str(e)}", file=sys.stderr)
        return 120  # Default BPM if calculation fails

if __name__ == "__main__":
    if len(sys.argv) > 1:
        try:
            # Try to parse as integer first (direct BPM value)
            try:
                bpm = int(sys.argv[1])
            except ValueError:
                # If not an integer, try to parse as JSON (band data)
                band_data = json.loads(sys.argv[1])
                bpm = calculate_bpm_from_eeg(band_data)
        except Exception as e:
            print(json.dumps({"error": f"Invalid argument: {str(e)}"}))
            sys.exit(1)
    else:
        bpm = 120  # Default BPM if not provided
    
    result = generate(bpm)
    if result:
        print(result)  # Print the JSON result
    