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
  repeat: boolean;
  isMuted: boolean;
  progressBarRef: React.RefObject<HTMLDivElement>;
  songTitle: string;
  artist: string;
  albumCoverUrl: string;
  songUrl: string;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (level: number) => void;
  toggleRepeat: () => void;
  toggleMute: () => void;
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
  repeat: false,
  isMuted: false,
  progressBarRef: { current: null },
  songTitle: 'Oh yea its Symph',
  artist: 'R.J.H.',
  albumCoverUrl: '/musicplayer.jpg',
  songUrl: '/merry.mp3',
  togglePlay: () => {},
  seek: () => {},
  setVolume: () => {},
  toggleRepeat: () => {},
  toggleMute: () => {},
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
  const [repeat, setRepeat] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(0.75); // Store previous volume for unmuting
  
  // Track metadata (could be expanded to load from an API)
  const [songTitle, setSongTitle] = useState('Hey, Symph');
  const [artist, setArtist] = useState('R.J.H.');
  const [albumCoverUrl, setAlbumCoverUrl] = useState('/musicplayer.jpeg');
  const [songUrl, setSongUrl] = useState('/merry.mp3');

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
    const onEnded = () => {
      if (repeat) {
        audio.currentTime = 0;
        audio.play().catch(err => console.error("Error replaying audio:", err));
      } else {
        setIsPlaying(false);
      }
    };
    
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    
    // Cleanup
    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, [repeat]);

  // Initialize or change the current song
  const initializeSong = (songInfo: SongInfo) => {
    if (!audioRef.current) return;
    
    // Save current playback state
    const wasPlaying = isPlaying;
    
    // Update song metadata
    setSongUrl(songInfo.songUrl);
    setSongTitle(songInfo.songTitle);
    setArtist(songInfo.artist);
    setAlbumCoverUrl(songInfo.albumCoverUrl);
    
    // Update audio source
    audioRef.current.src = songInfo.songUrl;
    audioRef.current.load();
    
    // Add an event listener to check if loading is successful
    const handleCanPlay = () => {
      console.log("Audio can now be played");
      // Restore playback if it was playing
      if (wasPlaying) {
        audioRef.current?.play().catch(err => console.error("Error playing audio:", err));
      }
      // Remove the event listener after it fires once
      audioRef.current?.removeEventListener('canplay', handleCanPlay);
    };
    
    // Add error handling
    const handleError = (e: Event) => {
      console.error("Error loading audio:", e);
      console.error("Failed to load audio from URL:", songInfo.songUrl);
      // Remove the event listener after it fires once
      audioRef.current?.removeEventListener('error', handleError);
    };
    
    audioRef.current.addEventListener('canplay', handleCanPlay);
    audioRef.current.addEventListener('error', handleError);
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play()
        .catch(err => {
          console.error("Error playing audio:", err);
          // Check if the audio source exists
          if (!audioRef.current.src || audioRef.current.src === window.location.href) {
            console.error("Audio source is missing or invalid");
            // Set a default source if needed
            if (songUrl) {
              audioRef.current.src = songUrl;
              audioRef.current.load();
              audioRef.current.play().catch(e => console.error("Second play attempt failed:", e));
            }
          }
        });
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

  // Toggle repeat mode
  const toggleRepeat = () => {
    setRepeat(!repeat);
  };

  // Toggle mute
  const toggleMute = () => {
    if (!audioRef.current) return;
    
    if (isMuted) {
      // Unmute - restore previous volume
      audioRef.current.volume = previousVolume;
      audioRef.current.muted = false;
      setVolumeState(previousVolume);
    } else {
      // Mute - save current volume first
      setPreviousVolume(volume);
      audioRef.current.volume = 0;
      audioRef.current.muted = true;
      setVolumeState(0);
    }
    
    setIsMuted(!isMuted);
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
    repeat,
    isMuted,
    progressBarRef,
    songTitle,
    artist,
    albumCoverUrl,
    songUrl,
    togglePlay,
    seek,
    setVolume,
    toggleRepeat,
    toggleMute,
    formatTime,
    handleProgressBarClick,
    handleVolumeBarClick,
    initializeSong,
  };

  return (
    <AudioContext.Provider value={value}>
      {/* Add the audio element here so it's available globally */}
      <audio 
        ref={audioRef} 
        src={songUrl} 
        preload="metadata"
        onError={(e) => console.error("Audio element error:", e)}
      />
      {children}
    </AudioContext.Provider>
  );
};

// Custom hook for using the audio context
export const useAudio = () => useContext(AudioContext);
