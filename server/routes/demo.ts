
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
  const bandData = req.body; // expects { delta: number, theta: number, ... }
  if (!bandData || typeof bandData !== "object") {
    return res.status(400).json({ error: "Missing or invalid band data" });
  }
  const py = spawn("python", ["test.py", JSON.stringify(bandData)]);
  let output = "";
  let error = "";
  py.stdout.on("data", (data) => {
    output += data.toString();
  });
  py.stderr.on("data", (data) => {
    error += data.toString();
  });
  py.on("close", (code) => {
    if (code !== 0 || error) {
      return res.status(500).json({ error: error || "Python script error" });
    }
    const bpm = parseInt(output, 10);
    res.json({ bpm });
  });
};
