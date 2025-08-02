import React, { useState, useRef } from "react";
import { Timeline } from "@/components/timeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { NowPlayingBar } from "@/components/NowPlayingBar";
import { Brain, FileUp, FileDown, Play, RotateCcw, CheckCircle2, AlertCircle, Filter, RefreshCw, BarChart4, Music, Youtube, ArrowDown } from "lucide-react";
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

export default function AnimatedPreprocessing() {
  // State
  const [file, setFile] = useState<File | null>(null);
  const [fileDetails, setFileDetails] = useState<{ name: string; size: string; status: string } | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  
  const [processingOptions, setProcessingOptions] = useState({
    applyFilter: true,
    removeArtifacts: true,
    filterFrequency: [0.5, 45],
    sampleRate: 250,
  });
  
  // Simulated EEG band data (replace with real calculation after processing)
  const [bandPowers, setBandPowers] = useState({
    delta: 32,
    theta: 25,
    alpha: 18,
    beta: 25,
    gamma: 8,
  });
  
  const [bpm, setBpm] = useState<number|null>(null);
  const [songResult, setSongResult] = useState<string>("");
  const [songDetails, setSongDetails] = useState<{
    title?: string;
    artist?: string;
    youtubeUrl?: string;
  }>({});
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
  const handleUpload = () => {
    if (!file) return;
    
    setUploadStatus("loading");
    setStatusMessage("Uploading your EEG data...");
    
    // Simulate upload process
    setTimeout(() => {
      setUploadStatus("success");
      setStatusMessage("File uploaded successfully. You can now proceed to preprocessing.");
    }, 2000);
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
    setSongDetails({});
    
    // Simulate preprocessing delay
    setTimeout(async () => {
      // Simulate successful processing
      setUploadStatus("success");
      setStatusMessage("EEG data processed successfully!");
      
      // Simulate generating a song recommendation
      setBpm(128);
      setSongResult("Based on your brain activity, we recommend relaxing music with alpha wave entrainment.");
      setSongDetails({
        title: "Weightless",
        artist: "Marconi Union",
        youtubeUrl: "https://www.youtube.com/watch?v=UfcAVejslrU",
      });
    }, 3000);
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
        <div>
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Select and upload your EEG data files for preprocessing and analysis.
          </p>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer mb-4" 
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
        </div>
      ),
    },
    {
      title: "Process",
      content: (
        <div>
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Configure preprocessing parameters for your EEG data to extract meaningful brainwave patterns.
          </p>

          <div className="grid gap-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="apply-filter">Apply Bandpass Filter</Label>
                <p className="text-sm text-muted-foreground">
                  Remove unwanted frequencies
                </p>
              </div>
              <Switch 
                id="apply-filter" 
                checked={processingOptions.applyFilter} 
                onCheckedChange={(checked) => 
                  setProcessingOptions({...processingOptions, applyFilter: checked})
                }
              />
            </div>

            {processingOptions.applyFilter && (
              <div className="space-y-4 pl-4 border-l-2 border-gray-200 ml-2">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="filter-frequency">Frequency Range (Hz)</Label>
                    <span className="text-sm">
                      {processingOptions.filterFrequency[0]} - {processingOptions.filterFrequency[1]} Hz
                    </span>
                  </div>
                  <Slider 
                    id="filter-frequency"
                    min={0} 
                    max={100} 
                    step={0.5} 
                    value={processingOptions.filterFrequency}
                    onValueChange={(value) => 
                      setProcessingOptions({...processingOptions, filterFrequency: value as [number, number]})
                    }
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="remove-artifacts">Artifact Removal</Label>
                <p className="text-sm text-muted-foreground">
                  Remove eye blinks, muscle artifacts, and other noise
                </p>
              </div>
              <Switch 
                id="remove-artifacts" 
                checked={processingOptions.removeArtifacts} 
                onCheckedChange={(checked) => 
                  setProcessingOptions({...processingOptions, removeArtifacts: checked})
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="sample-rate">Sample Rate (Hz)</Label>
                <span className="text-sm">{processingOptions.sampleRate} Hz</span>
              </div>
              <Slider 
                id="sample-rate"
                min={100} 
                max={1000} 
                step={1} 
                value={[processingOptions.sampleRate]}
                onValueChange={(value) => 
                  setProcessingOptions({...processingOptions, sampleRate: value[0]})
                }
              />
            </div>
          </div>

          {renderStatusAlert()}

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
                  Start Processing
                </>
              )}
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: "Results",
      content: (
        <div>
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            View your brain activity patterns and personalized music recommendations based on your EEG data.
          </p>

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
                    <div className="flex items-center gap-3 mb-2">
                      <Music className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{songDetails.title}</p>
                        <p className="text-sm text-muted-foreground">{songDetails.artist}</p>
                      </div>
                    </div>
                    
                    {songDetails.youtubeUrl && (
                      <Button variant="outline" size="sm" className="mt-2 w-full" asChild>
                        <a href={songDetails.youtubeUrl} target="_blank" rel="noopener noreferrer">
                          <Youtube className="h-4 w-4 mr-2" />
                          Listen on YouTube
                        </a>
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://assets.aceternity.com/templates/startup-1.webp"
              alt="EEG waveform visualization"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
            <img
              src="https://assets.aceternity.com/templates/startup-2.webp"
              alt="Brain activity map"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <Navbar>
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
                Sign up
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* Main Content */}
      <div className="container py-8 md:py-12 space-y-8 flex-1">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl">
              EEG Preprocessing
            </h1>
          </div>
          <p className="max-w-[36rem] text-muted-foreground md:text-xl">
            Upload, visualize, and preprocess raw EEG signals to extract brainwave bands for analysis.
          </p>
        </div>

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
