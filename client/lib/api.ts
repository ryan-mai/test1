// API utility for interacting with the Python backend
import { useSong } from './SongContext';
import { SongRecommendationResponse, EEGBandData } from '../../shared/api';

// Function to get song recommendation based on BPM
export const getSongRecommendation = async (bpm: number): Promise<SongRecommendationResponse> => {
  try {
    // Call the Python script via your server or API endpoint
    const response = await fetch('/api/recommend-song', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bpm }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting song recommendation:', error);
    return {
      bpm,
      result: `Error: ${error instanceof Error ? error.message : String(error)}`,
      error: String(error)
    };
  }
};

// Hook to get a song recommendation and update the player
export const useGeminiRecommendation = () => {
  const { updateSongFromAPI } = useSong();
  
  const getRecommendation = async (bpm: number) => {
    try {
      const response = await getSongRecommendation(bpm);
      
      if (response.error) {
        console.error('Error from recommendation API:', response.error);
        return null;
      }
      
      // Update the song context with the new recommendation
      updateSongFromAPI(response);
      
      return response;
    } catch (error) {
      console.error('Failed to get recommendation:', error);
      return null;
    }
  };
  
  return { getRecommendation };
};

// Function to get recommendation from EEG data
export const getRecommendationFromEEG = async (eegData: EEGBandData): Promise<SongRecommendationResponse> => {
  try {
    // Call the Python script via your server or API endpoint
    const response = await fetch('/api/recommend-from-eeg', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eegData),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting EEG recommendation:', error);
    return {
      bpm: 0,
      result: `Error: ${error instanceof Error ? error.message : String(error)}`,
      error: String(error)
    };
  }
};
