import React, { useState, useRef, useEffect } from "react";
import { Timeline } from "@/components/timeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { NowPlayingBar } from "@/components/NowPlayingBar";
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";
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

export default function AnimatedPreprocessing() {
  // State
  const [file, setFile] = useState<File | null>(null);
  const [fileDetails, setFileDetails] = useState<{ name: string; size: string; status: string } | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<number>(0);
  
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
  
  // Simulated EEG band data (replace with real calculation after processing)
  const [bandPowers, setBandPowers] = useState({
    delta: 32,
    theta: 25,
    alpha: 18,
    beta: 25,
    gamma: 8,
  });

  const [bpm, setBpm] = useState<number | null>(null);
  const [songResult, setSongResult] = useState<string>("");
  const [songList, setSongList] = useState<Array<{
    title?: string;
    artist?: string;
    album?: string;
    bpm?: number;
    genre?: string;
  }> | null>(null);

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

  const formData = new FormData();
  formData.append("file", file);

  try {
    const { data } = await api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setUploadStatus("success");
    setStatusMessage(`File uploaded: ${data.filename}`);
  } catch {
    setUploadStatus("error");
    setStatusMessage("Upload failed");
  }
};


  // Reset the form
  const handleReset = () => {
    setFile(null);
    setFileDetails(null);
    setUploadStatus("idle");
    setStatusMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Start preprocessing
  const handleStartPreprocessing = async () => {
    setUploadStatus("loading");
    setStatusMessage("Processing EEG data...");
    setBpm(null);
    setSongResult("");
    setSongList([]);

    try {
      // Call backend to get songs
      const response = await api.get("/recommend_songs");

      if (response.data.error) throw new Error(response.data.error);

      setBpm(response.data.bpm);
      setSongResult(`Recommended genre: ${response.data.genre}`);

      // Display first song (or however you want to handle)
      if (response.data.songs && response.data.songs.length > 0) {
        setSongList(response.data.songs);
      }

      setUploadStatus("success");
      setStatusMessage("Song recommendations ready!");

      // Scroll to results
      setActiveSection(2);
      setTimeout(() => {
        resultsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);

    } catch (error) {
      console.error("Error:", error);
      setUploadStatus("error");
      setStatusMessage(`Error: ${error instanceof Error ? error.message : "Failed to fetch songs"}`);
    }
  };

  // Render status alert
  const renderStatusAlert = () => {
    if (uploadStatus === "idle" || !statusMessage) return null;

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

  // Timeline data structure based on the Library.tsx component
  const timelineData = [
    {
      title: "Upload",
      content: (
        <div ref={uploadSectionRef}>
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Select and upload your EEG data files for preprocessing and analysis.
          </p>

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
            <div className="rounded-lg bg-muted p-4 mb-4">
              <h3 className="font-medium mb-2">File Details</h3>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Filename</p>
                  <p className="font-medium truncate">{fileDetails.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Size</p>
                  <p className="font-medium">{fileDetails.size}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-medium">{fileDetails.status}</p>
                </div>
              </div>
            </div>
          )}

          {renderStatusAlert()}

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
          
          {uploadStatus === "success" && (
            <div className="mt-8 flex justify-center">
              <Button 
                variant="outline"
                onClick={() => scrollToSection(processSectionRef, 1)}
                className="flex items-center gap-2"
              >
                Continue to Processing <ArrowDown className="h-4 w-4 rotate-90" />
              </Button>
            </div>
          )}
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
                  <CardTitle className="text-lg">Brain Activity</CardTitle>
                  <CardDescription>Your brainwave bands distribution</CardDescription>
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
                            style={{ width: `${power}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05)]">
                <CardHeader>
                  <CardTitle className="text-lg">Music Recommendation</CardTitle>
                  <CardDescription>Based on your brain activity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {bpm && (
                    <div className="flex items-center gap-2">
                      <BarChart4 className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">Detected tempo: <strong>{bpm} BPM</strong></span>
                    </div>
                  )}
                  
                  {songResult && (
                    <p className="text-sm">{songResult}</p>
                  )}

                  {songDetails.title && (
                    <div className="mt-4 border rounded-lg p-4 bg-muted/30">
                      <div className="flex flex-col md:flex-row gap-4">
                        {songDetails.imageUrl && (
                          <div className="w-full md:w-1/3">
                            <img 
                              src={songDetails.imageUrl} 
                              alt={`${songDetails.title} album cover`} 
                              className="w-full h-auto rounded-md"
                            />
                          </div>
                        )}
                        <div className="w-full md:w-2/3">
                          <div className="flex items-center gap-3 mb-2">
                            <Music className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium">{songDetails.title}</p>
                              <p className="text-sm text-muted-foreground">{songDetails.artist}</p>
                            </div>
                          </div>
                          
                          {songDetails.album && (
                            <p className="text-sm mb-1">
                              <span className="text-muted-foreground">Album:</span> {songDetails.album}
                            </p>
                          )}
                          
                          {songDetails.bpm && (
                            <p className="text-sm mb-3">
                              <span className="text-muted-foreground">BPM:</span> {songDetails.bpm}
                            </p>
                          )}
                          
                          {songDetails.youtubeUrl && (
                            <Button variant="outline" size="sm" className="mt-2 w-full" asChild>
                              <a href={songDetails.youtubeUrl} target="_blank" rel="noopener noreferrer">
                                <Youtube className="h-4 w-4 mr-2" />
                                Listen on YouTube
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

          
            <div className="mt-8 flex justify-start">
              <Button 
                variant="outline"
                onClick={() => scrollToSection(processSectionRef, 1)}
                className="flex items-center gap-2"
              >
                <ArrowDown className="h-4 w-4 -rotate-90" /> Back to Processing
              </Button>
            </div>
            {renderStatusAlert()}

            <div className="flex justify-between mt-6">
              <Button 
                variant="outline" 
                onClick={() => scrollToSection(uploadSectionRef, 0)}
                className="flex items-center gap-2"
              >
                <ArrowDown className="h-4 w-4 -rotate-90" /> Back to Upload
              </Button>
              <Button onClick={handleStartPreprocessing} disabled={uploadStatus === "loading"}>
                {uploadStatus === "loading" ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Processing
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
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            View your brain activity patterns and personalized music recommendations based on your EEG data.
          </p>
          <h2 className="text-xl font-semibold mb-4">Music Preferences</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Fine-tune your music recommendations by selecting preferences from categories below or add your own.
          </p>
          <div className="h-[500px] w-full">
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
                  <ScrollStackItem key={index} itemClassName={`${gradientClass} text-white shadow-lg rounded-[40px]`}>
                    <div className="h-full p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold">{song.title || `Song ${index + 1}`}</h3>
                        <p className="text-sm text-white/70">{song.artist || "Unknown Artist"}</p>
                        <p className="mt-2 text-sm">Album: {song.album || "Unknown"}</p>
                        <p className="text-sm">BPM: {song.bpm}</p>
                      </div>
                    </div>
                  </ScrollStackItem>
                );
              })}

            </ScrollStack>
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
              { name: "Music", link: "/music-recommendation" },
              { name: "Mental State", link: "/mental-state" },
              { name: "Library", link: "/library" },
              { name: "About", link: "/about" }
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
              { name: "Music", link: "/music-recommendation" },
              { name: "Mental State", link: "/mental-state" },
              { name: "Library", link: "/library" },
              { name: "About", link: "/about" }
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
      <div className="container py-8 md:py-12 space-y-8 flex-1">
        {/* Timeline Component */}
        <div className="relative w-full overflow-clip">
          <Timeline data={timelineData} />
        </div>
      </div>

      {/* Footer bar */}
      <NowPlayingBar />
    </div>
  );
}
