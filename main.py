import sys
import json
import uvicorn
import shutil
import os
import asyncio
import base64
import threading
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Debug: Check if the API key is loaded
api_key = os.environ.get("GEMINI_API_KEY")
if api_key:
    print(f"GEMINI_API_KEY loaded successfully: {api_key[:5]}...")
else:
    print("WARNING: GEMINI_API_KEY not found in environment variables!")

from google import genai
from google.genai import types
from fastapi import FastAPI, File, UploadFile, WebSocket, WebSocketDisconnect, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

# from backend.recommend_bpm import calculate_bpm
# from backend.recommend_genre import generate
from backend.interpret_speech import AudioLoop, MODEL, CONFIG
from backend.recommend_bpm import get_bpm_genre
from backend.recommend_genre import generate_genre
from backend.recommend_song import generate_songs

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

uploaded_file_path = None

app = FastAPI()

# Add a root route with API documentation
@app.get("/", response_class=HTMLResponse)
async def root():
    return """
    <html>
        <head>
            <title>Legoat API</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
                h1 { color: #333; }
                h2 { color: #444; margin-top: 30px; }
                .endpoint { background: #f4f4f4; padding: 10px; margin: 10px 0; border-radius: 5px; }
                code { background: #e0e0e0; padding: 2px 5px; border-radius: 3px; }
            </style>
        </head>
        <body>
            <h1>Legoat API Documentation</h1>
            
            <h2>File Upload</h2>
            <div class="endpoint">
                <p><strong>POST /upload</strong> - Upload a file</p>
            </div>
            
            <h2>Mental Health Analysis</h2>
            <div class="endpoint">
                <p><strong>POST /api/analyze</strong> - Analyze text or image for mental health signals</p>
            </div>
            <div class="endpoint">
                <p><strong>GET /api/mental-state</strong> - Get current mental state</p>
            </div>
            <div class="endpoint">
                <p><strong>GET /api/mental-state/history</strong> - Get history of mental states</p>
            </div>
            <div class="endpoint">
                <p><strong>POST /api/session/start</strong> - Start a new analysis session</p>
            </div>
            <div class="endpoint">
                <p><strong>POST /api/session/stop</strong> - Stop the current session</p>
            </div>
            <div class="endpoint">
                <p><strong>WebSocket /ws</strong> - Real-time communication</p>
            </div>
            
            <p>For more information, see the <a href="/docs">API documentation</a>.</p>
        </body>
    </html>
    """

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store active sessions and mental state history (from api.py)
active_sessions = {}
mental_state_history = []

# Define models for mental state API
class MentalStateData(BaseModel):
    type: str
    confidence: int
    description: str
    timestamp: str

class AnalysisRequest(BaseModel):
    text: Optional[str] = None
    image: Optional[str] = None  # base64 encoded

class AnalysisResponse(BaseModel):
    mentalState: Optional[Dict[str, Any]] = None
    analysis: str
    confidence: int

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    global uploaded_file_path  # <-- add this
    print("called")
    file_path = os.path.abspath(os.path.join(UPLOAD_DIR, file.filename))
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    uploaded_file_path = file_path
    return {"filename": file.filename, "path": file_path}

# ==================== Mental Health Analysis API (from api.py) ====================

class StateManager:
    def __init__(self):
        self.client = genai.Client(
            http_options={"api_version": "v1beta"},
            api_key=os.environ.get("GEMINI_API_KEY"),
        )
        self.audio_loop = None
        self.is_running = False
        self.session_id = None
        self.analysis_results = []
        self.current_mental_state = None
        
    async def start_session(self, session_id):
        print(f"[DEBUG] start_session called with session_id={session_id}")
        if self.is_running:
            print("[DEBUG] Session already running, skipping start.")
            return False
        self.session_id = session_id
        print("[DEBUG] Creating AudioLoop instance...")
        self.audio_loop = AudioLoop(video_mode="camera")
        self.is_running = True
        print("[DEBUG] Starting audio loop thread...")
        threading.Thread(target=self._run_audio_loop, daemon=True).start()
        print("[DEBUG] Session started.")
        return True
    
    def _run_audio_loop(self):
        asyncio.run(self.audio_loop.run())
    
    async def stop_session(self):
        if not self.is_running:
            return False
        # Stop the audio loop
        if self.audio_loop:
            try:
                self.audio_loop.stop()
            except Exception:
                pass
        self.is_running = False
        self.audio_loop = None
        return True
    
    async def get_current_state(self):
        return self.current_mental_state
    
    async def analyze_input(self, text=None, image=None):
        print(f"[DEBUG] analyze_input called with text={text} image={'provided' if image else 'none'}")
        if not self.is_running:
            print("[DEBUG] analyze_input called but session is not running!")
            raise HTTPException(status_code=400, detail="No active session. Please start a session before analyzing input.")
        if not self.client:
            print("[DEBUG] Gemini client not initialized!")
            raise HTTPException(status_code=500, detail="Gemini client not initialized")
        prompt = (
            "You are a healthcare professional. "
            "Analyze the following input for any signs of distress, mental health conditions, or stress. "
            "Respond with a JSON object containing 'mentalState' (one of: 'Relaxed', 'Focused', 'Creative', 'Balanced', 'Distressed'), "
            "'confidence' (a number from 0-100), and 'analysis' (your detailed observations and recommendations)."
        )
        if text:
            prompt += f"\n\nUser's text: {text}"
        print("[DEBUG] Getting Gemini model...")
        model = self.client.get_model("models/gemini-2.5-flash-preview")
        print("[DEBUG] Sending prompt to Gemini:", prompt[:100], "...")
        response = model.generate_content(prompt)
        print("[DEBUG] Gemini response received.")
        try:
            json_str = response.text
            if "```json" in json_str:
                json_str = json_str.split("```json")[1].split("```" )[0].strip()
            elif "```" in json_str:
                json_str = json_str.split("```" )[1].split("```" )[0].strip()
            result = json.loads(json_str)
            self.current_mental_state = {
                "type": result.get("mentalState", "Unknown"),
                "confidence": result.get("confidence", 50),
                "description": result.get("analysis", "No analysis available"),
                "timestamp": self._get_timestamp()
            }
            mental_state_history.append(self.current_mental_state)
            if len(mental_state_history) > 20:
                mental_state_history.pop(0)
            print(f"[DEBUG] Gemini JSON parsed: {self.current_mental_state}")
            return {
                "mentalState": self.current_mental_state,
                "analysis": result.get("analysis", ""),
                "confidence": result.get("confidence", 50)
            }
        except Exception as e:
            print(f"[DEBUG] Gemini JSON parse failed: {e}")
            text_response = response.text
            mental_state = "Balanced"
            confidence = 50
            if "stress" in text_response.lower() or "anxiety" in text_response.lower() or "distress" in text_response.lower():
                mental_state = "Distressed"
                confidence = 75
            elif "calm" in text_response.lower() or "relax" in text_response.lower():
                mental_state = "Relaxed"
                confidence = 80
            elif "focus" in text_response.lower() or "concentrat" in text_response.lower():
                mental_state = "Focused"
                confidence = 70
            elif "creativ" in text_response.lower() or "imagin" in text_response.lower():
                mental_state = "Creative"
                confidence = 65
            self.current_mental_state = {
                "type": mental_state,
                "confidence": confidence,
                "description": text_response[:200] + "...",
                "timestamp": self._get_timestamp()
            }
            mental_state_history.append(self.current_mental_state)
            if len(mental_state_history) > 20:
                mental_state_history.pop(0)
            print(f"[DEBUG] Gemini fallback mental state: {self.current_mental_state}")
            return {
                "mentalState": self.current_mental_state,
                "analysis": text_response,
                "confidence": confidence
            }
    
    def _get_timestamp(self):
        import datetime
        return datetime.datetime.now().isoformat()

# Create a state manager instance
state_manager = StateManager()

@app.post("/api/analyze")
async def analyze(request: AnalysisRequest):
    """Analyze text or image input and return mental state assessment"""
    result = await state_manager.analyze_input(text=request.text, image=request.image)
    return result

@app.get("/api/mental-state")
async def get_mental_state():
    """Get the current mental state"""
    current_state = await state_manager.get_current_state()
    if not current_state:
        return {"mentalState": None}
    return {"mentalState": current_state}

@app.get("/api/mental-state/history")
async def get_mental_state_history():
    """Get the history of mental states"""
    return {"history": mental_state_history}

@app.post("/api/session/start")
async def start_session(background_tasks: BackgroundTasks):
    """Start a new session"""
    import uuid
    session_id = str(uuid.uuid4())
    
    success = await state_manager.start_session(session_id)
    if not success:
        raise HTTPException(status_code=400, detail="Session already running")
    
    return {"sessionId": session_id, "status": "started"}

@app.post("/api/session/stop")
async def stop_session():
    """Stop the current session (idempotent)"""
    await state_manager.stop_session()
    return {"status": "stopped"}

# WebSocket endpoint for real-time communication
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    try:
        while True:
            data = await websocket.receive_text()
            data = json.loads(data)
            
            if data.get("type") == "analyze":
                result = await state_manager.analyze_input(
                    text=data.get("text"), 
                    image=data.get("image")
                )
                await websocket.send_json(result)
            
            elif data.get("type") == "startSession":
                session_id = data.get("sessionId", str(hash(websocket)))
                success = await state_manager.start_session(session_id)
                await websocket.send_json({"status": "started" if success else "error"})
            
            elif data.get("type") == "stopSession":
                success = await state_manager.stop_session()
                await websocket.send_json({"status": "stopped" if success else "error"})
    
    except WebSocketDisconnect:
        # Clean up on disconnect
        await state_manager.stop_session()

@app.get("/recommendation")
async def recommendation():
    try:
        # Get BPM from EEG analysis
        bpm, wave_data = get_bpm_genre(uploaded_file_path)

        # Get corresponding genre
        genre_json = generate_genre(bpm, wave_data)

        return {
            "bpm": bpm,
            "genre": json.loads(genre_json).get("genre"),
            "wave_data": json.loads(genre_json).get("wave_data")
        }
    except Exception as e:
        return {"error": str(e)}
    
@app.get("/recommend_songs")
async def recommend_songs():
    try:
        # Get BPM + wave data
        bpm, wave_data = get_bpm_genre(uploaded_file_path)
        
        # Get genre from wave data
        genre_json = generate_genre(bpm, wave_data)
        genre = json.loads(genre_json).get("genre")
        
        # Generate 8 songs in a loop
        songs = []
        for _ in range(4):
            song_json = generate_songs(bpm, genre)
            try:
                song_data = json.loads(song_json)
            except json.JSONDecodeError:
                return {"error": "Invalid JSON from Gemini", "raw": song_json}
            songs.append(song_data)
        
        return {
            "bpm": bpm,
            "genre": genre,
            "songs": songs
        }
    except Exception as e:
        return {"error": str(e)}

# YouTube URL endpoint
class YouTubeUrlRequest(BaseModel):
    title: str
    artist: str

@app.post("/api/get_youtube_url")
async def get_youtube_url(request: YouTubeUrlRequest):
    """Get YouTube URL for a song"""
    try:
        song_title = request.title
        artist = request.artist
        
        # Create search query
        search_query = f"{song_title} {artist} official music video"
        
        # If we have a YouTube API key, use the official API
        youtube_api_key = os.environ.get("YOUTUBE_API_KEY")
        if youtube_api_key:
            try:
                from googleapiclient.discovery import build
                
                # Create YouTube API client
                youtube = build('youtube', 'v3', developerKey=youtube_api_key)
                
                # Execute search request
                search_response = youtube.search().list(
                    q=search_query,
                    part='snippet',
                    maxResults=1,
                    type='video'
                ).execute()
                
                # Get the video ID
                if not search_response.get('items'):
                    return {"error": "No YouTube video found for this song"}
                
                video_id = search_response['items'][0]['id']['videoId']
                video_title = search_response['items'][0]['snippet']['title']
                thumbnail = search_response['items'][0]['snippet']['thumbnails']['high']['url']
                
                # Form the video URL
                video_url = f"https://www.youtube.com/watch?v={video_id}"
                embed_url = f"https://www.youtube.com/embed/{video_id}"
                
                return {
                    "video_id": video_id,
                    "video_url": video_url,
                    "embed_url": embed_url,
                    "title": video_title,
                    "thumbnail": thumbnail
                }
            except Exception as e:
                print(f"YouTube API error: {str(e)}. Using fallback.")
        
        # Fallback response for development or when API key is not available
        video_id = "dQw4w9WgXcQ"  # Placeholder - use a real search in production
        
        return {
            "video_id": video_id,
            "video_url": f"https://www.youtube.com/watch?v={video_id}",
            "embed_url": f"https://www.youtube.com/embed/{video_id}",
            "title": f"{song_title} by {artist}",
            "thumbnail": f"https://img.youtube.com/vi/{video_id}/hqdefault.jpg",
            "note": "Using fallback mode - no YouTube API key provided or API error"
        }
    
    except Exception as e:
        print(f"Error in get_youtube_url: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)