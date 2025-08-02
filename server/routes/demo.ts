
import { RequestHandler } from "express";
import { DemoResponse } from "@shared/api";
import { spawn } from "child_process";

export const handleDemo: RequestHandler = (req, res) => {
  const response: DemoResponse = {
    message: "Hello from Express server",
  };
  res.status(200).json(response);
};

// POST /api/calculate-bpm
export const handleCalculateBpm: RequestHandler = (req, res) => {
  console.log("[API] /api/calculate-bpm called");
  const bandData = req.body; // expects { delta: number, theta: number, ... }
  
  if (!bandData || typeof bandData !== "object") {
    return res.status(400).json({ error: "Missing or invalid band data" });
  }

  // Spawn Python process with the band data
  const py = spawn("python", [
    "test.py", 
    JSON.stringify(bandData)
  ]);
  
  let output = "";
  let error = "";
  
  py.stdout.on("data", (data) => {
    output += data.toString();
  });
  
  py.stderr.on("data", (data) => {
    error += data.toString();
    console.error(`Python stderr: ${data.toString()}`);
  });
  
  py.on("close", (code) => {
    if (code !== 0) {
      console.error(`Python process exited with code ${code}`);
      return res.status(500).json({ 
        error: "Python script error", 
        details: error || "Unknown error",
        code
      });
    }
    
    // Try to parse the output as JSON
    try {
      const outputStr = output.trim();
      const result = JSON.parse(outputStr);
      return res.json(result);
    } catch (e) {
      console.error("Failed to parse Python output:", e);
      console.error("Raw output:", output);
      return res.status(500).json({ 
        error: "Failed to parse Python output", 
        details: (e as Error).message,
        raw: output 
      });
    }
  });
};
