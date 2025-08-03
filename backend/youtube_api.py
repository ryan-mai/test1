from flask import Blueprint, request, jsonify
import os
import requests
from googleapiclient.discovery import build
from dotenv import load_dotenv
import traceback

# Load environment variables
load_dotenv()

# Get API key from environment variables
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

youtube_api = Blueprint('youtube_api', __name__)

@youtube_api.route('/get_youtube_url', methods=['POST'])
def get_youtube_url():
    """API endpoint to get YouTube URL for a song"""
    try:
        data = request.get_json()
        
        if not data or 'title' not in data or 'artist' not in data:
            return jsonify({"error": "Missing song title or artist"}), 400
        
        song_title = data['title']
        artist = data['artist']
        
        # Create YouTube API client if API key exists
        if YOUTUBE_API_KEY:
            youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)
            
            # Search for the song
            search_query = f"{song_title} {artist} official music video"
            
            # Execute search request
            search_response = youtube.search().list(
                q=search_query,
                part='snippet',
                maxResults=1,
                type='video'
            ).execute()
            
            # Get the video ID
            if not search_response.get('items'):
                return jsonify({"error": "No YouTube video found for this song"}), 404
            
            video_id = search_response['items'][0]['id']['videoId']
            video_title = search_response['items'][0]['snippet']['title']
            thumbnail = search_response['items'][0]['snippet']['thumbnails']['high']['url']
            
            # Form the video URL
            video_url = f"https://www.youtube.com/watch?v={video_id}"
            embed_url = f"https://www.youtube.com/embed/{video_id}"
            
            return jsonify({
                "video_id": video_id,
                "video_url": video_url,
                "embed_url": embed_url,
                "title": video_title,
                "thumbnail": thumbnail
            })
        else:
            # Fallback mode - for demo/development only
            # In a real application, you should ensure you have an API key
            video_id = "dQw4w9WgXcQ"  # Default video if no API key
            
            return jsonify({
                "video_id": video_id,
                "video_url": f"https://www.youtube.com/watch?v={video_id}",
                "embed_url": f"https://www.youtube.com/embed/{video_id}",
                "title": f"{song_title} by {artist}",
                "thumbnail": f"https://img.youtube.com/vi/{video_id}/hqdefault.jpg",
                "note": "Using fallback mode - no YouTube API key provided"
            })
    
    except Exception as e:
        print(f"Error in get_youtube_url: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": f"Server error: {str(e)}"}), 500
