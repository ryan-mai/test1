import { useState } from 'react';
import { useGeminiRecommendation, getRecommendationFromEEG } from '../lib/api';
import { useSong } from '../lib/SongContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { NowPlayingBar } from '../components/NowPlayingBar';
import { Loader2 } from 'lucide-react';
import { SongRecommendationResponse } from '../../shared/api';

export default function MusicRecommendation() {
  const [bpm, setBpm] = useState<number>(120);
  const [loading, setLoading] = useState(false);
  const [eegData, setEegData] = useState({
    delta: 20,
    theta: 15,
    alpha: 30,
    beta: 25,
    gamma: 10
  });
  const [response, setResponse] = useState<SongRecommendationResponse | null>(null);
  const { getRecommendation } = useGeminiRecommendation();
  const { songInfo } = useSong();

  const handleBpmRecommendation = async () => {
    setLoading(true);
    try {
      const result = await getRecommendation(bpm);
      setResponse(result);
    } catch (error) {
      console.error('Error getting recommendation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEEGRecommendation = async () => {
    setLoading(true);
    try {
      const result = await getRecommendationFromEEG(eegData);
      setResponse(result);
      
      // Get the useSong hook's updateSongFromAPI function
      const { updateSongFromAPI } = useSong();
      
      // Update the player with the song data
      updateSongFromAPI(result);
    } catch (error) {
      console.error('Error getting EEG recommendation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEEGChange = (band: string, value: string) => {
    setEegData(prev => ({
      ...prev,
      [band]: parseInt(value) || 0
    }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Music Recommendation</h1>
      
      {/* BPM-based recommendation */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Get Recommendation by BPM</h2>
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <Label htmlFor="bpm">BPM</Label>
            <Input
              id="bpm"
              type="number"
              min="60"
              max="180"
              value={bpm}
              onChange={(e) => setBpm(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="self-end">
            <Button 
              onClick={handleBpmRecommendation}
              disabled={loading}
              className="w-full"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Get Recommendation
            </Button>
          </div>
        </div>
      </div>
      
      {/* EEG-based recommendation */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Get Recommendation from EEG Data</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
          {Object.entries(eegData).map(([band, value]) => (
            <div key={band}>
              <Label htmlFor={band}>{band.charAt(0).toUpperCase() + band.slice(1)}</Label>
              <Input
                id={band}
                type="number"
                min="0"
                max="100"
                value={value}
                onChange={(e) => handleEEGChange(band, e.target.value)}
                className="w-full"
              />
            </div>
          ))}
        </div>
        <Button 
          onClick={handleEEGRecommendation}
          disabled={loading}
          className="w-full md:w-auto"
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Calculate BPM & Get Recommendation
        </Button>
      </div>
      
      {/* Response display */}
      {response && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Recommended Song</h2>
          <div className="mb-4">
            <p><strong>BPM:</strong> {response.bpm}</p>
            {response.songDetails?.title && (
              <>
                <p><strong>Title:</strong> {response.songDetails.title}</p>
                <p><strong>Artist:</strong> {response.songDetails.artist}</p>
                <p><strong>Album:</strong> {response.songDetails.album}</p>
                {response.songDetails.youtubeUrl && (
                  <p>
                    <strong>YouTube:</strong>{" "}
                    <a 
                      href={response.songDetails.youtubeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {response.songDetails.youtubeUrl}
                    </a>
                  </p>
                )}
              </>
            )}
          </div>
          
          {/* Album artwork display if available */}
          {response.songDetails?.imageUrl && (
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Album Artwork</h3>
              <img 
                src={response.songDetails.imageUrl} 
                alt={`${response.songDetails.title} album cover`}
                className="max-w-xs rounded-md shadow-lg"
              />
            </div>
          )}
        </div>
      )}
      
      {/* Current playing info */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-20">
        <h2 className="text-xl font-semibold mb-4">Currently Playing</h2>
        <div className="flex items-center gap-4">
          <img 
            src={songInfo.albumCoverUrl} 
            alt={`${songInfo.songTitle} album cover`}
            className="w-16 h-16 object-cover rounded-md"
          />
          <div>
            <p className="font-medium">{songInfo.songTitle}</p>
            <p className="text-gray-600 dark:text-gray-400">{songInfo.artist}</p>
            <p className="text-gray-600 dark:text-gray-400">{songInfo.album}</p>
          </div>
        </div>
      </div>
      
      {/* Now Playing Bar will appear at the bottom of the page */}
    </div>
  );
}
