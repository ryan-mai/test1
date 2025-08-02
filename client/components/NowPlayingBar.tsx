import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Volume2, 
  Heart, 
  Plus, 
  FileText, 
  Monitor, 
  MoreHorizontal, 
  List 
} from "lucide-react";
import { useSong } from "../lib/SongContext";

export const NowPlayingBar = () => {
  const { songInfo } = useSong();
  const {
    songTitle,
    artist,
    album,
    albumCoverUrl,
    currentTime,
    totalTime,
    progress
  } = songInfo;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-20 bg-[#333842] rounded-t-[10px] px-3 sm:px-5 flex items-center justify-between gap-2 sm:gap-4">
      {/* Left Section - Playback Controls */}
      <div className="flex items-center gap-1">
        {/* Main Play/Pause Button */}
        <button className="w-[38px] h-[38px] bg-[#1ED760] rounded-full flex items-center justify-center hover:scale-105 transition-transform">
          <Pause className="w-5 h-5 text-black fill-black" />
        </button>
        
        {/* Previous Track */}
        <button className="w-[38px] h-[38px] flex items-center justify-center hover:bg-white/10 rounded-full transition-colors">
          <SkipBack className="w-5 h-5 text-music-text-secondary fill-music-text-secondary" />
        </button>
        
        {/* Next Track */}
        <button className="w-[38px] h-[38px] flex items-center justify-center hover:bg-white/10 rounded-full transition-colors">
          <SkipForward className="w-5 h-5 text-music-text-secondary fill-music-text-secondary" />
        </button>
        
        {/* Shuffle */}
        <button className="w-[38px] h-[38px] flex items-center justify-center hover:bg-white/10 rounded-full transition-colors">
          <Shuffle className="w-5 h-5 text-music-text-secondary" />
        </button>
        
        {/* Repeat */}
        <button className="w-[38px] h-[38px] flex items-center justify-center hover:bg-white/10 rounded-full transition-colors">
          <Repeat className="w-6 h-6 text-music-text-secondary" />
        </button>
      </div>

      {/* Center Section - Track Info and Progress */}
      <div className="flex flex-col items-center flex-1 max-w-md mx-2 sm:mx-8">
        {/* Track Info */}
        <div className="flex items-center gap-4 mb-2">
          <img 
            src={albumCoverUrl}
            alt={`${songTitle} album cover`}
            className="w-[51px] h-[51px] rounded-sm flex-shrink-0"
          />
          <div className="text-left min-w-0">
            <div className="text-sm font-normal text-music-text-primary tracking-wide">
              {songTitle}
            </div>
            <div className="text-sm text-music-text-secondary tracking-wide">
              {artist}
            </div>
            <div className="text-sm text-music-text-secondary tracking-wide">
              {album}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full flex items-center gap-3">
          <span className="text-xs text-music-text-secondary font-normal tracking-wide">
            {currentTime}
          </span>
          <div className="flex-1 relative">
            <div className="h-1 bg-music-text-secondary/25 rounded-full">
              <div className="h-1 bg-music-text-primary rounded-full" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <span className="text-xs text-music-text-secondary font-normal tracking-wide">
            {totalTime}
          </span>
        </div>
      </div>

      {/* Right Section - Controls and Actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Volume */}
        <button className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors">
          <Volume2 className="w-6 h-6 text-music-text-secondary" />
        </button>
        
        {/* Like */}
        <button className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors">
          <Heart className="w-5 h-5 text-music-text-secondary" />
        </button>
        
        {/* Add to Playlist */}
        <button className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors">
          <Plus className="w-5 h-5 text-music-text-secondary" />
        </button>
        
        {/* Lyrics */}
        <button className="hidden sm:flex w-10 h-10 items-center justify-center hover:bg-white/10 rounded-full transition-colors">
          <FileText className="w-5 h-5 text-music-text-secondary" />
        </button>

        {/* Device */}
        <button className="hidden sm:flex w-10 h-10 items-center justify-center hover:bg-white/10 rounded-full transition-colors">
          <Monitor className="w-5 h-5 text-music-text-secondary" />
        </button>
        
        {/* More Options */}
        <button className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors">
          <MoreHorizontal className="w-6 h-6 text-music-text-secondary" />
        </button>
        
        {/* Separator */}
        <div className="hidden sm:block w-px h-10 bg-music-text-secondary/30 mx-2" />

        {/* DJ Avatar */}
        <div className="hidden sm:block w-[47px] h-[47px] rounded-full overflow-hidden">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/5164f78b86046cc445ec4976af3e242e80ecbb26?width=66"
            alt="DJ avatar"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Queue */}
        <button className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors">
          <List className="w-6 h-6 text-music-text-secondary" />
        </button>
      </div>
    </div>
  );
};
