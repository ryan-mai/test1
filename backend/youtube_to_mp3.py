import yt_dlp

def youtube_to_mp3(url, output_path="."):
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': f'{output_path}/%(title)s.%(ext)s',
        'postprocessors': [
            {  
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }
        ],
        'quiet': False
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

# Example usage
youtube_to_mp3("https://www.youtube.com/watch?v=In5fBfkCavk&list=RDMMYMldUzP7Zxw&index=6", output_path=".")
