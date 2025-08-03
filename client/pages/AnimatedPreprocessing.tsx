import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Timeline } from "@/components/timeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { NowPlayingBar } from "@/components/NowPlayingBar";
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";
import { MacbookScroll } from "@/components/macbook-scroll";
import SplitText from "@/components/SplitText";
import { Brain, FileUp, FileDown, Play, RotateCcw, CheckCircle2, AlertCircle, Filter, RefreshCw, BarChart4, Music, Youtube, ArrowDown, ChevronUp } from "lucide-react";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/resizable-navbar";
import api from "@/api";
import { useBrainwave } from "@/lib/BrainwaveContext";

// Extend the Window interface to include GSAPSplitText
declare global {
  interface Window {
    GSAPSplitText?: any;
  }
}

export default function AnimatedPreprocessing() {
  // State
  const [file, setFile] = useState<File | null>(null);
  const [fileDetails, setFileDetails] = useState<{ name: string; size: string; status: string } | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<number>(0);
  const [gsapLoaded, setGsapLoaded] = useState(false);

  // Check if GSAP is loaded
  useEffect(() => {
    // Check if window is defined (for SSR)
    if (typeof window !== 'undefined') {
      // Log GSAP registration status
      console.log('GSAP available:', typeof gsap !== 'undefined');
      
      // Check for SplitText plugin
      try {
        const splitTextAvailable = typeof (window as any).GSAPSplitText !== 'undefined';
        console.log('SplitText plugin available:', splitTextAvailable);
        setGsapLoaded(true);
      } catch (error) {
        console.error('Error checking SplitText plugin:', error);
      }
    }
  }, []);

  const [processingOptions, setProcessingOptions] = useState({
    applyFilter: true,
    removeArtifacts: true,
    filterFrequency: [0.5, 45],
    sampleRate: 250,
  });

  // Music preferences state
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [customGenre, setCustomGenre] = useState<string>("");
  const [customYear, setCustomYear] = useState<string>("");
  const [customArtist, setCustomArtist] = useState<string>("");
  const [customMood, setCustomMood] = useState<string>("");

  // Category display state
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Handler functions for music preferences
  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const toggleYear = (year: string) => {
    setSelectedYears(prev =>
      prev.includes(year)
        ? prev.filter(y => y !== year)
        : [...prev, year]
    );
  };

  // Access brainwave context
  const { 
    brainwaveData, 
    updateBrainwaveData, 
    processingStatus, 
    statusMessage: contextStatusMessage, 
    setProcessingStatus, 
    setStatusMessage: setContextStatusMessage 
  } = useBrainwave();

  const toggleArtist = (artist: string) => {
    setSelectedArtists(prev =>
      prev.includes(artist)
        ? prev.filter(a => a !== artist)
        : [...prev, artist]
    );
  };

  const toggleMood = (mood: string) => {
    setSelectedMoods(prev =>
      prev.includes(mood)
        ? prev.filter(m => m !== mood)
        : [...prev, mood]
    );
  };

  const toggleCategory = (category: string) => {
    setExpandedCategory(prev => prev === category ? null : category);
  };

  const addCustomGenre = () => {
    if (customGenre.trim() && !selectedGenres.includes(customGenre.trim())) {
      setSelectedGenres(prev => [...prev, customGenre.trim()]);
      setCustomGenre("");
    }
  };

  const addCustomYear = () => {
    if (customYear.trim() && !selectedYears.includes(customYear.trim())) {
      setSelectedYears(prev => [...prev, customYear.trim()]);
      setCustomYear("");
    }
  };

  const addCustomArtist = () => {
    if (customArtist.trim() && !selectedArtists.includes(customArtist.trim())) {
      setSelectedArtists(prev => [...prev, customArtist.trim()]);
      setCustomArtist("");
    }
  };

  const addCustomMood = () => {
    if (customMood.trim() && !selectedMoods.includes(customMood.trim())) {
      setSelectedMoods(prev => [...prev, customMood.trim()]);
      setCustomMood("");
    }
  };

  // Remove redundant state now that we're using context
  // const [bandPowers, setBandPowers] = useState({
  //   delta: 0,
  //   theta: 0,
  //   alpha: 0,
  //   beta: 0,
  //   gamma: 0,
  // });

  // const [bpm, setBpm] = useState<number | null>(null);
  
  // Use data from context
  const [bandPowers, setBandPowers] = useState({
    delta: 0,
    theta: 0,
    alpha: 0,
    beta: 0,
    gamma: 0,
  });

  const [bpm, setBpm] = useState<number | null>(null);
  const [songResult, setSongResult] = useState<string>("");
  const [songList, setSongList] = useState<Array<{
    title?: string;
    artist?: string;
    album?: string;
    bpm?: number;
    genre?: string;
    link?: string;
    imageUrl?: string;
  }> | null>(null);
  
  // YouTube video state
  const [selectedSong, setSelectedSong] = useState<{
    title?: string;
    artist?: string;
  } | null>(null);
  const [youtubeData, setYoutubeData] = useState<{
    video_id?: string;
    embed_url?: string;
    thumbnail?: string;
    loading?: boolean;
    error?: string;
  } | null>(null);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadSectionRef = useRef<HTMLDivElement>(null);
  const processSectionRef = useRef<HTMLDivElement>(null);
  const resultsSectionRef = useRef<HTMLDivElement>(null);

  // Scroll helper function
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>, sectionIndex: number) => {
    if (ref.current) {
      // Update active section first to ensure timeline progress updates
      setActiveSection(sectionIndex);

      // Give a short delay to allow the timeline animation to start
      setTimeout(() => {
        ref.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  };

  // Setup scroll observation
  useEffect(() => {
    // Function to determine which section is most visible
    const determineActiveSection = () => {
      if (!uploadSectionRef.current || !processSectionRef.current || !resultsSectionRef.current) return;

      const viewportHeight = window.innerHeight;
      const scrollPosition = window.scrollY;

      // Get the positions of each section relative to the viewport
      const uploadRect = uploadSectionRef.current.getBoundingClientRect();
      const processRect = processSectionRef.current.getBoundingClientRect();
      const resultsRect = resultsSectionRef.current.getBoundingClientRect();

      // Calculate the position of each section relative to the top of the viewport (as percentage)
      // A negative value means the section is above the viewport
      // A value between 0 and 1 means the section is partially visible
      // A value > 1 means the section is below the viewport
      const getRelativePosition = (rect: DOMRect) => {
        const topRelative = rect.top / viewportHeight;
        return topRelative;
      };

      const uploadPos = getRelativePosition(uploadRect);
      const processPos = getRelativePosition(processRect);
      const resultsPos = getRelativePosition(resultsRect);

      // Determine which section is most centered in the viewport
      // Prioritize sections that are visible or just above the viewport
      if (uploadPos <= 0.3 && processPos >= 0.3) {
        // Upload section is visible or just above
        setActiveSection(0);
      } else if (processPos <= 0.3 && resultsPos >= 0.3) {
        // Process section is visible or just above
        setActiveSection(1);
      } else if (resultsPos <= 0.3) {
        // Results section is visible or just above
        setActiveSection(2);
      }
    };

    // Call once on mount and then on scroll
    determineActiveSection();
    window.addEventListener('scroll', determineActiveSection);

    return () => {
      window.removeEventListener('scroll', determineActiveSection);
    };
  }, []);

  // File input handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setFileDetails({
      name: selectedFile.name,
      size: `${(selectedFile.size / 1024).toFixed(2)} KB`,
      status: 'Ready to upload'
    });

    setUploadStatus("idle");
    setStatusMessage("");
  };

  // Handle file upload action
  const handleUpload = async () => {
    if (!file) return; // safety check

    setUploadStatus("loading");
    setStatusMessage("Uploading your EEG data...");
    // Update file details status to show uploading
    setFileDetails(prev => prev ? {...prev, status: 'Uploading...'} : null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadStatus("success");
      setStatusMessage(`File uploaded: ${data.filename}`);
      // Update file details status to show success
      setFileDetails(prev => prev ? {...prev, status: 'Upload successful'} : null);

      // Immediately get BPM + genre (but not song)
      setStatusMessage("Analyzing EEG for BPM & genre...");
      const recRes = await api.get("/recommendation");

      if (recRes.data.error) throw new Error(recRes.data.error);

      // Update brain activity bands (convert to percentage for UI)
      const wave = recRes.data.wave_data;
      const brainwaveValues = {
        delta: +(wave.delta_mean * 100).toFixed(1),
        theta: +(wave.theta_mean * 100).toFixed(1),
        alpha: +(wave.alpha_mean * 100).toFixed(1),
        beta: +(wave.beta_mean * 100).toFixed(1),
        gamma: +(wave.gamma_mean * 100).toFixed(1),
        bpm: recRes.data.bpm,
        genre: recRes.data.genre
      };
      
      // Update local state
      setBandPowers({
        delta: brainwaveValues.delta,
        theta: brainwaveValues.theta,
        alpha: brainwaveValues.alpha,
        beta: brainwaveValues.beta,
        gamma: brainwaveValues.gamma,
      });
      
      // Update BPM & Genre in UI
      setBpm(brainwaveValues.bpm);
      setSongResult(`Recommended genre: ${brainwaveValues.genre}`);
      
      // Update the shared context
      updateBrainwaveData(brainwaveValues);
      setProcessingStatus("success");
      setContextStatusMessage("Brain activity processed successfully!");

    } catch (err) {
      setUploadStatus("error");
      setStatusMessage(`Upload failed: ${err.message}`);
      setProcessingStatus("error");
      setContextStatusMessage(`Brain activity processing failed: ${err.message}`);
      // Update file details status to show failure
      setFileDetails(prev => prev ? {...prev, status: 'Upload failed'} : null);
    }
  };



  // Reset the form
  const handleReset = () => {
    setFile(null);
    setFileDetails(null);
    setUploadStatus("idle");
    setStatusMessage("");
    // Reset brainwave context
    updateBrainwaveData({
      delta: 0,
      theta: 0,
      alpha: 0,
      beta: 0,
      gamma: 0,
      bpm: null,
      genre: null
    });
    setProcessingStatus("idle");
    setContextStatusMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Start preprocessing
  const handleStartPreprocessing = async () => {
    setUploadStatus("loading");
    setStatusMessage("Processing EEG data...");
    // Don't reset BPM to null, keep the existing value during processing
    // setBpm(null);
    setSongResult("");
    setSongList([]);
    
    // Update brainwave context status
    setProcessingStatus("loading");
    setContextStatusMessage("Processing EEG data...");

    try {
      // Call backend to get songs
      const response = await api.get("/recommend_songs");

      if (response.data.error) throw new Error(response.data.error);

      const bpmValue = response.data.bpm;
      const genreValue = response.data.genre;
      
      // Only update BPM if we actually got a new value
      if (bpmValue) {
        setBpm(bpmValue);
      }
      setSongResult(`Recommended genre: ${genreValue}`);
      
      // Update the brainwave context with processed data
      updateBrainwaveData({
        // Only update BPM if we got a new value, otherwise keep the existing one
        ...(bpmValue && { bpm: bpmValue }),
        genre: genreValue
      });

      // Display first song (or however you want to handle)
      if (response.data.songs && response.data.songs.length > 0) {
        setSongList(response.data.songs);
      }

      setUploadStatus("success");
      setStatusMessage("Song recommendations ready!");
      setProcessingStatus("success");
      setContextStatusMessage("Brain activity processed successfully!");

      // Scroll to results
      setActiveSection(2);
      setTimeout(() => {
        resultsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);

    } catch (error) {
      console.error("Error:", error);
      setUploadStatus("error");
      setStatusMessage(`Error: ${error instanceof Error ? error.message : "Failed to fetch songs"}`);
      
      // Update brainwave context with error
      setProcessingStatus("error");
      setContextStatusMessage(`Error processing brain activity: ${error instanceof Error ? error.message : "Failed to process"}`);
    }
  };
  
  // Function to fetch YouTube URL for a song
  const fetchYoutubeUrl = async (song: { title?: string; artist?: string }) => {
    if (!song.title || !song.artist) {
      setYoutubeData({ error: "Missing song title or artist" });
      return;
    }
    
    setYoutubeData({ loading: true });
    setSelectedSong(song);
    
    try {
      const response = await api.post("/api/get_youtube_url", {
        title: song.title,
        artist: song.artist
      });
      
      if (response.data.error) {
        setYoutubeData({ 
          error: response.data.error,
          loading: false 
        });
        return;
      }
      
      setYoutubeData({
        video_id: response.data.video_id,
        embed_url: response.data.embed_url,
        thumbnail: response.data.thumbnail,
        loading: false
      });
      
    } catch (error) {
      console.error("Error fetching YouTube URL:", error);
      setYoutubeData({ 
        error: error instanceof Error ? error.message : "Failed to fetch YouTube URL",
        loading: false 
      });
    }
  };

  // Render status alert - now only for processing status, not file upload status
  const renderStatusAlert = () => {
    // Skip showing upload-related alerts since they're now in the file details
    if (uploadStatus === "idle" || !statusMessage || 
        statusMessage.includes("Upload") || 
        statusMessage.includes("upload") ||
        statusMessage.includes("File uploaded")) return null;

    if (uploadStatus === "error") {
      return (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{statusMessage}</AlertDescription>
        </Alert>
      );
    }

    if (uploadStatus === "success") {
      return (
        <Alert className="mt-4 bg-green-50 border-green-200 text-green-800">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{statusMessage}</AlertDescription>
        </Alert>
      );
    }

    if (uploadStatus === "loading") {
      return (
        <Alert className="mt-4 bg-blue-50 border-blue-200 text-blue-800">
          <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
          <AlertTitle>Processing</AlertTitle>
          <AlertDescription>{statusMessage}</AlertDescription>
        </Alert>
      );
    }
  };

  const maxPower = Math.max(...Object.values(bandPowers));

  const openSongLink = (song: { title?: string; artist?: string; link?: string }) => {
  if (song.link) {
    // Open the provided link
    window.open(song.link, "_blank", "noopener,noreferrer");
  } else if (song.title && song.artist) {
    // Fallback: Search YouTube if no link
    const query = encodeURIComponent(`${song.title} ${song.artist}`);
    window.open(`https://www.youtube.com/results?search_query=${query}`, "_blank", "noopener,noreferrer");
  }
};

  const timelineData = [
    {
      title: "Upload",
      content: (
        <div ref={uploadSectionRef}>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-black/2 transition-colors cursor-pointer mb-4"
            onClick={() => fileInputRef.current?.click()}>
            <FileUp className="h-10 w-10 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium">Drag and drop your file here</p>
            <p className="text-sm text-muted-foreground">or click to browse</p>
            <p className="text-xs text-muted-foreground mt-2">
              Supported formats: .edf, .bdf, .gdf, .csv, .txt
            </p>
            <Input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".edf,.bdf,.gdf,.csv,.txt"
              onChange={handleFileChange}
            />
          </div>

          {fileDetails && (
            <div className="rounded-lg bg-muted p-4 mb-4 relative">
              <h3 className="font-medium mb-2">File Details</h3>
              
              <div className="relative">
                {/* Main file name with rounded borders - extends full width */}
                <div className="bg-neutral-800 rounded-full pr-4 py-2 flex items-center text-white mb-2 w-full border-2 border-neutral-800">
                  <span className="font-medium truncate pl-4 flex-1">{fileDetails.name}</span>
                  
                  {/* Status pill positioned within the same row as filename */}
                  <div className={`rounded-full px-3 py-2 flex items-center ml-2 z-10 ${
                    fileDetails.status === 'Ready to upload' 
                      ? 'bg-neutral-700 text-white'
                      : fileDetails.status === 'Uploading...' 
                      ? 'bg-yellow-400 text-yellow-900 animate-pulse'
                      : fileDetails.status === 'Upload successful' 
                      ? 'bg-[#1DB954] text-black'
                      : fileDetails.status === 'Upload failed' 
                      ? 'bg-red-700 text-white'
                      : 'bg-neutral-800 text-white'
                  }`}>
                    <span className="font-medium text-sm">
                      {fileDetails.status}
                      {fileDetails.status === 'Uploading...' && (
                        <span className="inline-block ml-1">
                          <RefreshCw className="h-3 w-3 inline animate-spin" />
                        </span>
                      )}
                      {fileDetails.status === 'Upload successful' && (
                        <span className="inline-block ml-1">
                          <CheckCircle2 className="h-6 w-6 inline" />
                        </span>
                      )}
                      {fileDetails.status === 'Upload failed' && (
                        <span className="inline-block ml-1">
                          <AlertCircle className="h-6 w-6 inline" />
                        </span>
                      )}
                    </span>
                  </div>
                </div>
                
                {/* Size text at bottom right with smaller text */}
                <div className="flex justify-end mt-1">
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                    {fileDetails.size}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end -mt-6">
            <div className="flex flex-col md:flex-row gap-4 mt-6">
              <Button variant="outline" onClick={handleReset} className="w-full md:w-auto">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!file || uploadStatus === "loading"}
                className="w-full md:w-auto"
              >
                {uploadStatus === "loading" ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <FileUp className="h-4 w-4 mr-2" />
                    Upload
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Process",
      content: (
        <div ref={processSectionRef}>
          {/* Wrap all content in a single parent div */}
          <div>
            {/* Music Preferences Section with Scroll Stack */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05)]">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Scan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(bandPowers).map(([band, power]) => (
                      <div key={band} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{band}</span>
                          <span>{power}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"

                            style={{
                              width: power > 0 ? `${(power / maxPower) * 100}%` : "0%"
                            }}

                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05)]">
                  <CardHeader className="relative flex items-center h-32 p-0 overflow-hidden">
                    {/* Centered, full-size Heart SVG background */}
                    <svg
                      viewBox="0 0 100 90"
                      className="absolute w-full h-full max-w-[100px] pointer-events-none select-none"
                      style={{ zIndex: 0, display: 'block', top: '40%', right: '5.5rem', position: 'absolute', transform: 'translateY(-50%)' }}
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <path
                        d="M10,30
                          a20,20 0 0,1 40,0
                          a20,20 0 0,1 40,0
                          q0,30 -40,50
                          q-40,-20 -40,-50z"
                        fill="#fb233b"
                      />
                    </svg>
                    <CardTitle className="relative flex items-start justify-start w-full h-full text-[5rem] font-extrabold leading-none tracking-tight text-primary text-left pl-8 mt-6 z-10">BPM</CardTitle>
                  </CardHeader>
                  {/* BPM value moved below the CardHeader */}
                  {bpm !== null && (
                    <div className="flex justify-start pl-8 mt-[-3.5rem]">
                      <span className="text-[8rem] md:text-[15rem] font-thin leading-none text-primary text-left" style={{lineHeight:1}}>{bpm}</span>
                    </div>
                  )}
              </Card>
            </div>

            {/* Apply Preferences Button */}
            {(selectedGenres.length > 0 || selectedYears.length > 0 || selectedArtists.length > 0 || selectedMoods.length > 0) && (
              <div className="mt-4 flex justify-center">
                <Button
                  className="bg-[#1DB954] hover:bg-[#1DB954]/80 text-black"
                  onClick={() => {
                    // This would call the API with user preferences to update recommendations
                    setStatusMessage("Updating recommendations based on your preferences...");
                    setUploadStatus("loading");

                    // Simulate API call
                    setTimeout(() => {
                      setUploadStatus("success");
                      setStatusMessage("Recommendations updated based on your preferences!");
                      setSongResult(`Based on your brain activity (${bpm} BPM) and preferences, we found this song for you.`);
                    }, 1500);
                  }}
                >
                  Apply Preferences
                </Button>
              </div>
            )}

            <div className="flex justify-end mt-6">
              <Button onClick={handleStartPreprocessing} disabled={uploadStatus === "loading"}>
                {uploadStatus === "loading" ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Process
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Results",
      content: (
        <div ref={resultsSectionRef}>
          {/* Recommendation summary removed as per user request */}
          <div className="h-[400px] w-full mt-[-10px]">
            <ScrollStack
              key={songList ? songList.length : 0} // force re-layout when songs change
              className="rounded-xl"
              itemDistance={30}
              itemStackDistance={12}
              baseScale={1.0}
              rotationAmount={0}
              blurAmount={0}
              stackPosition="5%"
              scaleEndPosition="10%"
            >
              {/* Genre Category */}
              {songList && songList.length > 0 && songList.slice(0, 4).map((song, index) => {
                const gradients = [
                  "bg-gradient-to-br from-[#7CF9A7] via-[#1DB954] to-[#23272A]",
                  "bg-gradient-to-br from-[#A6A1FF] via-[#450CF5] to-[#23272A]",
                  "bg-gradient-to-br from-[#FFB3DE] via-[#E4128B] to-[#23272A]",
                  "bg-gradient-to-br from-[#FFD699] via-[#FF9500] to-[#23272A]"
                ];
                const gradientClass = gradients[index % gradients.length];

                return (

<ScrollStackItem 
  key={index} 
  itemClassName={`${gradientClass} text-white shadow-lg rounded-[40px] overflow-hidden relative`}
>
  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-50 mix-blend-overlay"></div>
  <div className="h-full p-6 flex flex-col justify-between relative z-10">
    <div className="flex w-full">
      <div className="w-24 h-24 rounded-xl overflow-hidden mr-5 flex-shrink-0 bg-black/20 relative">
        <div className="absolute top-2 right-2 bg-black/40 px-2 py-1 rounded text-xs text-gray-300 font-semibold z-10">
          {song.album || "Unknown"}
        </div>
        <img 
          src={song.imageUrl || "/musicplayer.jpeg"} 
          alt={song.title || `Song ${index + 1}`}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex flex-1 items-center justify-between overflow-hidden max-w-[calc(100%-110px)]">
        <div className="flex flex-col justify-center overflow-hidden">
          {/* Make title clickable */}
          <a 
  onClick={() => openSongLink(song)}
  className="cursor-pointer font-extrabold text-black dark:text-white truncate hover:underline"
  style={{
    fontSize: `${song.title && song.title.length > 15 ? '1.8rem' : '2.5rem'}`,
    lineHeight: '1',
    height: '2.5rem',
    display: 'block',
    width: '100%',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  }}
>
  {song.title || `Song ${index + 1}`}
</a>
          <span className="flex items-center gap-2 mt-2 overflow-hidden" style={{height: '1.5rem'}}>
            <span className="text-neutral-700 dark:text-neutral-200 truncate" 
              style={{
                fontSize: `${song.artist && song.artist.length > 20 ? '1rem' : '1.5rem'}`, 
                lineHeight: '1', 
                fontWeight: 400,
                width: '100%',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis'
              }}
            >
              {song.artist || "Unknown Artist"}
            </span>
            {song.genre && (
              <span className="px-2 py-0.5 rounded-full text-sm md:text-base font-bold text-white/90 flex-shrink-0" 
                style={{background: '#1DB954', color: '#fff', marginLeft: '0.5rem'}}>
                {song.genre}
              </span>
            )}
          </span>
        </div>

        {/* Keep YouTube button as is */}
        <button 
          className="group relative rounded-full w-14 h-14 bg-white hover:bg-white/90 text-black flex items-center justify-center shadow-lg transform transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 ml-4"
          onClick={() => openSongLink(song)}

        >
          <Youtube className="h-6 w-6 transition-transform group-hover:scale-110" />
          <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
        </button>
      </div>
    </div>
  </div>
</ScrollStackItem>

                );
              })}
            </ScrollStack>
            
            {/* YouTube Video Player */}
            {selectedSong && (
              <div className="mt-8 max-w-4xl mx-auto">
                <Card className="overflow-hidden bg-neutral-900 border-neutral-800">
                  <CardHeader className="bg-neutral-900 text-white">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Youtube className="h-5 w-5 text-red-600" />
                        {selectedSong.title} by {selectedSong.artist}
                      </CardTitle>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-neutral-800 hover:bg-neutral-700 border-neutral-700"
                        onClick={() => {
                          setSelectedSong(null);
                          setYoutubeData(null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    {youtubeData?.loading && (
                      <div className="h-96 flex items-center justify-center bg-neutral-950">
                        <div className="flex flex-col items-center">
                          <RefreshCw className="h-10 w-10 text-neutral-500 animate-spin mb-4" />
                          <p className="text-neutral-400">Loading YouTube video...</p>
                        </div>
                      </div>
                    )}
                    
                    {youtubeData?.error && (
                      <div className="h-96 flex items-center justify-center bg-neutral-950">
                        <div className="flex flex-col items-center max-w-md text-center px-4">
                          <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
                          <p className="text-neutral-400 mb-2">Couldn't load YouTube video</p>
                          <p className="text-neutral-500 text-sm">{youtubeData.error}</p>
                        </div>
                      </div>
                    )}
                    
                    {youtubeData?.embed_url && (
                      <div className="aspect-video w-full">
                        <iframe
                          src={youtubeData.embed_url}
                          title={`${selectedSong.title} by ${selectedSong.artist}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        ></iframe>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header - Resizable Navbar, sticky to top */}
      <Navbar className="sticky top-0 z-40 mt-8">
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems
            items={[
              { name: "Home", link: "/" },
              { name: "Diagnose", link: "/animated-preprocessing" },
              { name: "Dashboard", link: "/mental-state" },
              { name: "About", link: "/home" }
            ]}
          />
          <div className="relative z-20 flex items-center gap-4">
            <NavbarButton variant="secondary" as="a" href="/login">
              Log in
            </NavbarButton>
            <NavbarButton variant="primary" as="a" href="/login">
              Sign up
            </NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <a href="/" className="flex items-center space-x-2">
              <Brain className="h-6 w-6" />
              <span className="font-bold">Legoat</span>
            </a>
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {[
              { name: "Home", link: "/" },
              { name: "Diagnose", link: "/animated-preprocessing" },
              { name: "Dashboard", link: "/mental-state" },
              { name: "About", link: "/home" }
            ].map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="secondary"
                as="a"
                href="/login"
                className="w-full"
              >
                Log in
              </NavbarButton>
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                as="a"
                href="/login"
                className="w-full"
              >
                Log in
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* Main Content */}
      <div className="py-0 md:py-8 space-y-4 flex-1 w-full">
        {/* Process Data Header with MacbookScroll */}
        <div className="relative w-full bg-white dark:bg-neutral-950">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start">
            <div className="w-full md:w-3/5 py-10 px-4 md:px-6 lg:px-8 z-10">
              <div className="block text-6xl mb-2 text-left font-bold text-neutral-900 dark:text-white">
                <SplitText 
                  text="Process Data" 
                  splitType="chars"
                  delay={50}
                  duration={0.8}
                  from={{ opacity: 0, y: 30, rotateX: -90 }}
                  to={{ opacity: 1, y: 0, rotateX: 0 }}
                  ease="power4.out"
                  textAlign="left"
                  className="text-6xl font-bold"
                />
              </div>
              <p className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base max-w-sm mb-0">
                Submit your patient's data to be scanned and analyzed. The entire process takes less than 1 minute.
              </p>
            </div>
            <div className="w-full md:w-2/5 md:-mt-28 absolute md:relative" style={{ bottom: '2rem', right: '12rem' }}>

              <MacbookScroll 
                src="/demo.gif" 
                showGradient={true}
                title=""
              />
            </div>
          </div>
        </div>

        {/* Timeline Component */}
        <div className="relative w-full mt-[-180px] md:mt-[-500px]">
          <Timeline data={timelineData} hideHeader={true} activeIndex={activeSection} />
        </div>
      </div>

      {/* Footer bar */}
      <NowPlayingBar />
    </div>
  );
}
