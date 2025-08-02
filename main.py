import sys
import json
import uvicorn
import shutil
import os
from google import genai
from google.genai import types
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

from backend.recommend_bpm import get_bpm_genre
from backend.recommend_genre import generate_genre

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    print("called")
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"filename": file.filename, "path": file_path}

@app.get("/recommendation")
async def recommendation():
    try:
        # Get BPM from EEG analysis
        bpm, wave_data = get_bpm_genre()

        # Get corresponding genre
        genre_json = generate_genre(bpm, wave_data)

        return {
            "bpm": bpm,
            "genre": json.loads(genre_json).get("genre"),
            "wave_data": json.loads(genre_json).get("wave_data")
        }
    except Exception as e:
        return {"error": str(e)}
    



if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)