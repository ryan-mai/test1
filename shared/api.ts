/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Song details from Gemini API
 */
export interface SongDetails {
  title?: string;
  artist?: string;
  album?: string;
  bpm?: number;
  imageUrl?: string;
  youtubeUrl?: string;
}

/**
 * Response type for song recommendation API
 */
export interface SongRecommendationResponse {
  bpm: number;
  result: string;
  songDetails?: SongDetails;
  error?: string;
}

/**
 * EEG band data for recommendation
 */
export interface EEGBandData {
  delta?: number;
  theta?: number;
  alpha?: number;
  beta?: number;
  gamma?: number;
  [key: string]: number | undefined;
}
