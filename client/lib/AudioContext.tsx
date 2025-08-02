import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface SongInfo {
  songUrl: string;
  songTitle: string;
  artist: string;
  albumCoverUrl: string;
}

// Define the shape of our audio context
interface AudioContextType {
  audioRef: React.RefObject<HTMLAudioElement>;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  progressBarRef: React.RefObject<HTMLDivElement>;
  songTitle: string;
  artist: string;
  albumCoverUrl: string;
  songUrl: string;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (level: number) => void;
  formatTime: (time: number) => string;
  handleProgressBarClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleVolumeBarClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  initializeSong: (songInfo: SongInfo) => void;
}

// Create context with default values
const AudioContext = createContext<AudioContextType>({
  audioRef: { current: null },
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.75,
  progressBarRef: { current: null },
  songTitle: 'Test Song',
  artist: 'Demo Artist',
  albumCoverUrl: '/placeholder.svg',
  songUrl: '/test-song.mp3',
  togglePlay: () => {},
  seek: () => {},
  setVolume: () => {},
  formatTime: () => '0:00',
  handleProgressBarClick: () => {},
  handleVolumeBarClick: () => {},
  initializeSong: () => {},
});

// Provider component that wraps the app
export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Audio player state
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.75);
  
  // Track metadata (could be expanded to load from an API)
  const [songTitle, setSongTitle] = useState('Test Song');
  const [artist, setArtist] = useState('Demo Artist');
  const [albumCoverUrl, setAlbumCoverUrl] = useState('/placeholder.svg');
  const [songUrl, setSongUrl] = useState('/test-song.mp3');

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) return;
    
    // Set initial volume
    audioRef.current.volume = volume;
    
    // Event listeners
    const audio = audioRef.current;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    
    // Cleanup
    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, []);

  // Initialize or change the current song
  const initializeSong = (songInfo: SongInfo) => {
    if (!audioRef.current) return;
    
    // Save current playback state
    const wasPlaying = isPlaying;
    const currentPosition = currentTime;
    
    // Update song metadata
    setSongUrl(songInfo.songUrl);
    setSongTitle(songInfo.songTitle);
    setArtist(songInfo.artist);
    setAlbumCoverUrl(songInfo.albumCoverUrl);
    
    // Update audio source
    audioRef.current.src = songInfo.songUrl;
    audioRef.current.load();
    
    // Restore playback if it was playing
    if (wasPlaying) {
      audioRef.current.play().catch(err => console.error("Error playing audio:", err));
    }
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.error("Error playing audio:", err));
    }
  };

  // Seek to a specific time
  const seek = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, Math.min(time, duration));
    setCurrentTime(audioRef.current.currentTime);
  };

  // Set volume level
  const setVolume = (level: number) => {
    if (!audioRef.current) return;
    const newVolume = Math.max(0, Math.min(1, level));
    audioRef.current.volume = newVolume;
    setVolumeState(newVolume);
  };

  // Format time in mm:ss
  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  // Handle progress bar click
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !audioRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, clickX / rect.width));
    const seekTime = percent * duration;
    
    seek(seekTime);
  };

  // Handle volume bar click
  const handleVolumeBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, clickX / rect.width));
    
    setVolume(percent);
  };

  // Context value
  const value = {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    volume,
    progressBarRef,
    songTitle,
    artist,
    albumCoverUrl,
    songUrl,
    togglePlay,
    seek,
    setVolume,
    formatTime,
    handleProgressBarClick,
    handleVolumeBarClick,
    initializeSong,
  };

  return (
    <AudioContext.Provider value={value}>
      {/* Add the audio element here so it's available globally */}
      <audio ref={audioRef} src={songUrl} preload="metadata" />
      {children}
    </AudioContext.Provider>
  );
};

// Custom hook for using the audio context
export const useAudio = () => useContext(AudioContext);
