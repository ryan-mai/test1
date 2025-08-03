# Legoat - Mental Health Monitoring System

This application integrates a React frontend with a Python backend using FastAPI to analyze mental states based on facial expressions, speech content, and tone of voice.

## System Overview

The system consists of two main parts:

1. **Python Backend**: 
   - Processes audio and video input using the Gemini AI API
   - Analyzes facial expressions, speech, and tone for signs of distress
   - Provides real-time mental state analysis through a FastAPI server

2. **React Frontend**: 
   - Displays mental state analysis in a user-friendly interface
   - Shows brainwave data visualization (simulated)
   - Tracks mental state history
   - Provides recording controls

## Setup Instructions

### Prerequisites

- Python 3.10+ installed
- Node.js and npm installed
- Google Gemini API key

### Backend Setup

1. Set up your environment variable for the Gemini API key:

   ```powershell
   $env:GEMINI_API_KEY="your_actual_api_key_here"
   ```

2. Install required Python packages:

   ```bash
   pip install fastapi uvicorn google-generativeai opencv-python pillow pyaudio mss
   ```

3. Run the FastAPI backend:

   ```bash
   cd backend
   python api.py
   ```

   The API will be available at http://localhost:8008

### Frontend Setup

1. Install the required npm packages:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

   The frontend will be available at the URL shown in your terminal (typically http://localhost:3000 or http://localhost:5173)

## Using the Application

1. Open the frontend application in your browser
2. Navigate to the Mental State page
3. Click "Start Recording" to begin analysis
4. The system will capture:
   - Video from your webcam (if permitted)
   - Audio from your microphone
5. The AI will analyze your facial expressions, speech content, and tone for signs of distress
6. Results will be displayed in real-time on the Mental State Dashboard
7. Click "Stop Recording" to end the session

## API Endpoints

- `POST /api/session/start` - Start a new analysis session
- `POST /api/session/stop` - Stop the current session
- `POST /api/analyze` - Analyze text or image input
- `GET /api/mental-state` - Get the current mental state
- `GET /api/mental-state/history` - Get the history of mental states
- `WebSocket /ws` - Real-time communication

## Troubleshooting

- If the backend fails to start, ensure your Gemini API key is correctly set
- If the webcam doesn't activate, ensure you've granted browser permissions
- Check browser console and server logs for error messages
