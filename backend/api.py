import os
import asyncio
import base64
import json
from typing import Optional, Dict, Any, List
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel
import threading

# Import from interpret_speech.py
from interpret_speech import AudioLoop, genai, MODEL, CONFIG

app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development. In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store active sessions
active_sessions = {}
mental_state_history = []

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
        if self.is_running:
            return False
        
        self.session_id = session_id
        self.audio_loop = AudioLoop(video_mode="camera")
        self.is_running = True
        
        # Start the audio loop in a background thread
        threading.Thread(target=self._run_audio_loop, daemon=True).start()
        return True
    
    def _run_audio_loop(self):
        asyncio.run(self.audio_loop.run())
    
    async def stop_session(self):
        if not self.is_running:
            return False
        
        # Stop the audio loop
        self.is_running = False
        self.audio_loop = None
        return True
    
    async def get_current_state(self):
        return self.current_mental_state
    
    async def analyze_input(self, text=None, image=None):
        """Analyze text or image input and return mental state assessment"""
        if not self.client:
            raise HTTPException(status_code=500, detail="Gemini client not initialized")
        
        prompt = (
            "You are a healthcare professional. "
            "Analyze the following input for any signs of distress, mental health conditions, or stress. "
            "Respond with a JSON object containing 'mentalState' (one of: 'Relaxed', 'Focused', 'Creative', 'Balanced', 'Distressed'), "
            "'confidence' (a number from 0-100), and 'analysis' (your detailed observations and recommendations)."
        )
        
        if text:
            prompt += f"\n\nUser's text: {text}"
        
        # For direct API analysis (not using the AudioLoop)
        model = self.client.get_model("models/gemini-2.5-flash-preview")
        response = model.generate_content(prompt)
        
        try:
            # Try to parse the response as JSON
            json_str = response.text
            # Find JSON content if it's within markdown code blocks
            if "```json" in json_str:
                json_str = json_str.split("```json")[1].split("```")[0].strip()
            elif "```" in json_str:
                json_str = json_str.split("```")[1].split("```")[0].strip()
                
            result = json.loads(json_str)
            
            # Update the current mental state
            self.current_mental_state = {
                "type": result.get("mentalState", "Unknown"),
                "confidence": result.get("confidence", 50),
                "description": result.get("analysis", "No analysis available"),
                "timestamp": self._get_timestamp()
            }
            
            # Add to history
            mental_state_history.append(self.current_mental_state)
            if len(mental_state_history) > 20:
                mental_state_history.pop(0)
                
            return {
                "mentalState": self.current_mental_state,
                "analysis": result.get("analysis", ""),
                "confidence": result.get("confidence", 50)
            }
            
        except Exception as e:
            # If JSON parsing fails, extract information manually
            text_response = response.text
            
            # Determine mental state based on keywords
            mental_state = "Balanced"  # Default
            confidence = 50  # Default confidence
            
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
                "description": text_response[:200] + "...",  # Truncate long responses
                "timestamp": self._get_timestamp()
            }
            
            # Add to history
            mental_state_history.append(self.current_mental_state)
            if len(mental_state_history) > 20:
                mental_state_history.pop(0)
                
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
    """Stop the current session"""
    success = await state_manager.stop_session()
    if not success:
        raise HTTPException(status_code=400, detail="No session running")
    
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

if __name__ == "__main__":
    uvicorn.run("api:app", host="127.0.0.1", port=8008, reload=True)
