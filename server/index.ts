import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo, handleCalculateBpm } from "./routes/demo";
import { handleRecommendSong, handleRecommendFromEEG } from "./routes/recommend";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.post("/api/calculate-bpm", handleCalculateBpm);
  
  // Song recommendation routes
  app.post("/api/recommend-song", handleRecommendSong);
  app.post("/api/recommend-from-eeg", handleRecommendFromEEG);

  return app;
}
