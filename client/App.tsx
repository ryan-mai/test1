import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/login";
import Home from "./pages/Home";
import EEGDataset from "./pages/EEGDataset";
import AnimatedPreprocessing from "./pages/AnimatedPreprocessing";
import MentalState from "./pages/MentalState";
import AudioRetrieval from "./pages/AudioRetrieval";
import { TimelineDemo } from "./pages/Library";
import Settings from "./pages/Settings";
import About from "./pages/About";
import Index from "./pages/Index";
import { SongProvider } from "./lib/SongContext";
import { AudioProvider } from "./lib/AudioContext";

const queryClient = new QueryClient();

const App = () => {
  // Set dark mode by default for music streaming theme
  document.documentElement.classList.add('dark');
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SongProvider>
          <AudioProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/home" element={<Home />} />
                <Route path="/eeg-dataset" element={<EEGDataset />} />
                <Route path="/preprocessing" element={<AnimatedPreprocessing />} />
                <Route path="/animated-preprocessing" element={<AnimatedPreprocessing />} />
                <Route path="/mental-state" element={<MentalState />} />
                <Route path="/audio-retrieval" element={<AudioRetrieval />} />
                <Route path="/library" element={<TimelineDemo />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/about" element={<About />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AudioProvider>
        </SongProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);

createRoot(document.getElementById("root")!).render(<App />);
