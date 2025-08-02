import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { NowPlayingBar } from "@/components/NowPlayingBar";
import { Brain, FileUp, FileDown, Play, RotateCcw, CheckCircle2, AlertCircle, Filter, RefreshCw, BarChart4 } from "lucide-react";
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
import { Link } from "react-router-dom";

export default function Preprocessing() {
  const [file, setFile] = useState<File | null>(null);
  const [fileDetails, setFileDetails] = useState<{ name: string; size: string; status: string } | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [processingOptions, setProcessingOptions] = useState({
    applyFilter: true,
    removeArtifacts: true,
    filterFrequency: [0.5, 45], // Hz range
    sampleRate: 250, // Hz
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    
    if (selectedFile) {
      // Convert file size to readable format
      const size = selectedFile.size;
      const sizeInKB = size / 1024;
      const sizeInMB = sizeInKB / 1024;
      const sizeStr = sizeInMB >= 1 
        ? `${sizeInMB.toFixed(2)} MB` 
        : `${sizeInKB.toFixed(2)} KB`;
      
      setFileDetails({
        name: selectedFile.name,
        size: sizeStr,
        status: "Ready to upload"
      });
      
      setUploadStatus("idle");
      setStatusMessage("");
    } else {
      setFileDetails(null);
    }
  };

  const handleUpload = () => {
    if (!file) {
      setUploadStatus("error");
      setStatusMessage("Please select a file first");
      return;
    }

    setUploadStatus("loading");
    setStatusMessage("Uploading file...");

    // Simulate upload process
    setTimeout(() => {
      setUploadStatus("success");
      setStatusMessage("File uploaded successfully");
      setActiveTab("preprocess");
      
      if (fileDetails) {
        setFileDetails({
          ...fileDetails,
          status: "Uploaded"
        });
      }
    }, 2000);
  };

  const handleReset = () => {
    setFile(null);
    setFileDetails(null);
    setUploadStatus("idle");
    setStatusMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleStartPreprocessing = () => {
    setUploadStatus("loading");
    setStatusMessage("Processing EEG data...");
    
    // Simulate preprocessing
    setTimeout(() => {
      setUploadStatus("success");
      setStatusMessage("EEG data processed successfully");
      setActiveTab("visualize");
    }, 3000);
  };

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
        <Alert variant="default" className="mt-4 bg-green-50 text-green-800 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{statusMessage}</AlertDescription>
        </Alert>
      );
    }
    
    if (uploadStatus === "loading") {
      return (
        <Alert variant="default" className="mt-4">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <AlertTitle>Processing</AlertTitle>
          <AlertDescription>{statusMessage}</AlertDescription>
        </Alert>
      );
    }
  };

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
            <NavbarButton variant="secondary" as={Link} href="/login">
              Log in
            </NavbarButton>
            <NavbarButton variant="primary" as={Link} href="/login">
              Sign up
            </NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <Link to="/" className="flex items-center space-x-2">
              <Brain className="h-6 w-6" />
              <span className="font-bold">Legoat</span>
            </Link>
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
              <Link
                key={`mobile-link-${idx}`}
                to={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </Link>
            ))}
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="secondary"
                as={Link}
                href="/login"
                className="w-full"
              >
                Log in
              </NavbarButton>
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                as={Link}
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">
              <FileUp className="h-4 w-4 mr-2" />
              Upload EEG
            </TabsTrigger>
            <TabsTrigger value="preprocess" disabled={!file}>
              <Filter className="h-4 w-4 mr-2" />
              Preprocess
            </TabsTrigger>
            <TabsTrigger value="visualize" disabled={!file || activeTab === "upload"}>
              <BarChart4 className="h-4 w-4 mr-2" />
              Visualize
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload EEG Data</CardTitle>
                <CardDescription>
                  Select and upload your EEG data files for preprocessing and analysis.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
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
                  <div className="rounded-lg bg-muted p-4">
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
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button onClick={handleUpload} disabled={!file || uploadStatus === "loading"}>
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
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Preprocess Tab */}
          <TabsContent value="preprocess" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preprocessing Options</CardTitle>
                <CardDescription>
                  Configure preprocessing parameters for your EEG data.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
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
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("upload")}>
                  Back to Upload
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
                      Start Preprocessing
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Visualize Tab */}
          <TabsContent value="visualize" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>EEG Signal Visualization</CardTitle>
                <CardDescription>
                  View and analyze your preprocessed EEG data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart4 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">EEG visualization will appear here</p>
                    <p className="text-xs text-muted-foreground mt-2">Data processed with selected preprocessing options</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="p-4">
                    <h3 className="font-semibold text-sm">Delta (0.5-4 Hz)</h3>
                    <p className="text-muted-foreground text-xs">Deep sleep, healing</p>
                    <p className="text-lg font-bold mt-2">32%</p>
                  </Card>
                  <Card className="p-4">
                    <h3 className="font-semibold text-sm">Theta (4-8 Hz)</h3>
                    <p className="text-muted-foreground text-xs">Meditation, creativity</p>
                    <p className="text-lg font-bold mt-2">25%</p>
                  </Card>
                  <Card className="p-4">
                    <h3 className="font-semibold text-sm">Alpha (8-13 Hz)</h3>
                    <p className="text-muted-foreground text-xs">Relaxation, calmness</p>
                    <p className="text-lg font-bold mt-2">18%</p>
                  </Card>
                  <Card className="p-4">
                    <h3 className="font-semibold text-sm">Beta (13-30 Hz)</h3>
                    <p className="text-muted-foreground text-xs">Focus, alertness</p>
                    <p className="text-lg font-bold mt-2">25%</p>
                  </Card>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("preprocess")}>
                  Back to Preprocessing
                </Button>
                <Button variant="outline">
                  <FileDown className="h-4 w-4 mr-2" />
                  Export Results
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 Legoat. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              About
            </Link>
            <Link to="/library" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Library
            </Link>
            <Link to="/settings" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Settings
            </Link>
          </div>
        </div>
      </footer>

      {/* Now Playing Bar */}
      <NowPlayingBar />
    </div>
  );
}
