import React from "react";
import { BiShuffle, BiSkipPrevious, BiSkipNext, BiRepeat } from "react-icons/bi";
import { FaPlay, FaVolumeUp } from "react-icons/fa";
import { MdPause, MdQueueMusic } from "react-icons/md";
import { CgScreen } from "react-icons/cg";
import { useAudio } from "../lib/AudioContext";

interface NowPlayingBarProps {
  // Optional props for backward compatibility
  standalone?: boolean;
}

export const NowPlayingBar: React.FC<NowPlayingBarProps> = ({ standalone = false }) => {
  // Use the global audio context
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    progressBarRef,
    togglePlay,
    formatTime,
    handleProgressBarClick,
    handleVolumeBarClick,
    songTitle,
    artist,
    albumCoverUrl
  } = useAudio();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black to-[#121212]/95 pt-4 pb-4 px-8">
      <div className="flex justify-between items-center max-w-screen-2xl mx-auto">
        {/* Left: Song Info (placeholder) */}
        <div className="w-1/4 flex items-center gap-4">
          <div className="w-14 h-14 bg-gray-700 flex-shrink-0 flex items-center justify-center overflow-hidden">
            <img src={albumCoverUrl} alt={songTitle} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-white font-medium">{songTitle}</p>
            <p className="text-[#B3B3B3] text-sm">{artist}</p>
          </div>
        </div>
        
        {/* Center: Player Controls */}
        <div className="w-1/2 flex flex-col items-center">
          <div className="flex items-center gap-6 mb-4">
            <BiShuffle className="text-[#B3B3B3] hover:text-white cursor-pointer" size={22} />
            <BiSkipPrevious className="text-[#B3B3B3] hover:text-white cursor-pointer" size={32} />
            <button
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white hover:scale-105 transition-transform"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <MdPause className="text-black" size={24} />
              ) : (
                <FaPlay className="text-black ml-1" size={18} />
              )}
            </button>
            <BiSkipNext className="text-[#B3B3B3] hover:text-white cursor-pointer" size={32} />
            <BiRepeat className="text-[#B3B3B3] hover:text-white cursor-pointer" size={22} />
          </div>
          <div className="w-full flex items-center gap-2 select-none">
            <span className="text-xs text-[#B3B3B3] min-w-[40px] text-right">{formatTime(currentTime)}</span>
            <div
              ref={progressBarRef}
              className="flex-1 h-1.5 bg-[#404040] rounded-full cursor-pointer relative group"
              onClick={handleProgressBarClick}
            >
              <div
                className="h-full bg-white rounded-full transition-all group-hover:bg-green-500"
                style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
              ></div>
              {/* Thumb */}
              {duration > 0 && (
                <div
                  className="absolute top-1/2 -translate-y-1/2"
                  style={{ left: `calc(${(currentTime / duration) * 100}% - 6px)` }}
                >
                  <div className="w-3 h-3 bg-white rounded-full shadow border border-[#404040] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
                </div>
              )}
            </div>
            <span className="text-xs text-[#B3B3B3] min-w-[40px]">{formatTime(duration)}</span>
          </div>
        </div>
        
        {/* Right: Volume Controls */}
        <div className="w-1/4 flex items-center justify-end gap-4">
          <CgScreen className="text-[#B3B3B3] hover:text-white cursor-pointer" size={20} />
          <MdQueueMusic className="text-[#B3B3B3] hover:text-white cursor-pointer" size={20} />
          <div className="flex items-center gap-2">
            <FaVolumeUp className="text-[#B3B3B3] hover:text-white cursor-pointer" size={20} />
            <div
              className="w-24 h-1.5 bg-[#404040] rounded-full cursor-pointer relative group"
              onClick={handleVolumeBarClick}
            >
              <div
                className="h-full bg-white rounded-full transition-all group-hover:bg-green-500"
                style={{ width: `${volume * 100}%` }}
              ></div>
              {/* Thumb */}
              <div
                className="absolute top-1/2 -translate-y-1/2"
                style={{ left: `calc(${volume * 100}% - 6px)` }}
              >
                <div className="w-3 h-3 bg-white rounded-full shadow border border-[#404040] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
              </div>
            </div>
          </div>
          <button className="text-[#B3B3B3] hover:text-white">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1.5 1H6v1.5H3v10h10v-3H14.5v4.5h-14V1.5z M8 4H16v8H8V4zm6.5 6.5v-5h-5v5h5z"></path>
            </svg>
          </button>
          <button className="text-[#B3B3B3] hover:text-white">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M16 3v10H0V3h16zM1 4v8h14V4H1z"></path>
              <path d="M10 12h4V4h-4v8zm1-7h2v6h-2V5z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
