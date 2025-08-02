import { createContext, useContext, useState, ReactNode } from 'react';

// Define the type for song information
export type SongInfo = {
  songTitle: string;
  artist: string;
  album: string;
  albumCoverUrl: string;
  currentTime: string;
  totalTime: string;
  progress: number;
  youtubeUrl?: string;
};

// Default song info
const defaultSongInfo: SongInfo = {
  songTitle: "Get Lucky",
  artist: "Daft Punk",
  album: "Random Access Memories",
  albumCoverUrl: "https://api.builder.io/api/v1/image/assets/TEMP/66efafa72425b614c848b254efe1e54b1bbdd411?width=102",
  currentTime: "2:23",
  totalTime: "4:45",
  progress: 45,
};

// Create the context with a default undefined value
type SongContextType = {
  songInfo: SongInfo;
  updateSongInfo: (newInfo: Partial<SongInfo>) => void;
  updateSongFromAPI: (apiResponse: any) => void;
};

const SongContext = createContext<SongContextType | undefined>(undefined);

// Provider component
export const SongProvider = ({ children }: { children: ReactNode }) => {
  const [songInfo, setSongInfo] = useState<SongInfo>(defaultSongInfo);

  // Update song info with partial data
  const updateSongInfo = (newInfo: Partial<SongInfo>) => {
    setSongInfo(prevInfo => ({ ...prevInfo, ...newInfo }));
  };

  // Update song info from the Gemini API response
  const updateSongFromAPI = (apiResponse: any) => {
    if (!apiResponse || !apiResponse.songDetails) return;
    
    const { songDetails } = apiResponse;
    
    updateSongInfo({
      songTitle: songDetails.title || songInfo.songTitle,
      artist: songDetails.artist || songInfo.artist,
      album: songDetails.album || songInfo.album,
      albumCoverUrl: songDetails.imageUrl || songInfo.albumCoverUrl,
      youtubeUrl: songDetails.youtubeUrl,
      // Reset playback to beginning when new song loads
      currentTime: "0:00",
      progress: 0,
    });
  };

  return (
    <SongContext.Provider value={{ songInfo, updateSongInfo, updateSongFromAPI }}>
      {children}
    </SongContext.Provider>
  );
};

// Custom hook to use the song context
export const useSong = () => {
  const context = useContext(SongContext);
  if (context === undefined) {
    throw new Error('useSong must be used within a SongProvider');
  }
  return context;
};
