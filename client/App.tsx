import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/login";
import Home from "./pages/Home";
import EEGDataset from "./pages/EEGDataset";
import Preprocessing from "./pages/Preprocessing";
import MentalState from "./pages/MentalState";
import MusicRecommendation from "./pages/MusicRecommendation";
import AudioRetrieval from "./pages/AudioRetrieval";
import Library from "./pages/Library";
import Settings from "./pages/Settings";
import About from "./pages/About";
import { SongProvider } from "./lib/SongContext";

const queryClient = new QueryClient();

const App = () => {
  // Set dark mode by default for music streaming theme
  document.documentElement.classList.add('dark');
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SongProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/home" element={<Home />} />
              <Route path="/eeg-dataset" element={<EEGDataset />} />
            <Route path="/preprocessing" element={<Preprocessing />} />
            <Route path="/mental-state" element={<MentalState />} />
            <Route path="/music-recommendation" element={<MusicRecommendation />} />
            <Route path="/audio-retrieval" element={<AudioRetrieval />} />
            <Route path="/library" element={<Library />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/about" element={<About />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </SongProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
