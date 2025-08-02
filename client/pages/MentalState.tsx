import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
 ArrowLeft, 
 Brain, 
 Activity, 
 TrendingUp, 
 Clock, 
 Zap,
 Heart,
 Eye,
 Target,
 BarChart3,
 Play,
 Pause,
 RotateCcw,
 AlertCircle,
 CheckCircle,
 Music
} from "lucide-react";

interface BrainwaveData {
 alpha: number;
 beta: number;
 theta: number;
 delta: number;
 gamma: number;
}

interface MentalState {
 type: string;
 confidence: number;
 description: string;
 color: string;
 icon: React.ReactNode;
}

export default function MentalState() {
 const [isRecording, setIsRecording] = useState(false);
 const [recordingTime, setRecordingTime] = useState(0);
 const [brainwaveData, setBrainwaveData] = useState<BrainwaveData>({
 alpha: 0,
 beta: 0,
 theta: 0,
 delta: 0,
 gamma: 0
 });
 const [currentMentalState, setCurrentMentalState] = useState<MentalState | null>(null);
 const [signalQuality, setSignalQuality] = useState(0);
 const [isConnected, setIsConnected] = useState(false);

 // Simulate brainwave data
 useEffect(() => {
 if (isRecording) {
 const interval = setInterval(() => {
 setBrainwaveData({
 alpha: Math.random() * 100,
 beta: Math.random() * 100,
 theta: Math.random() * 100,
 delta: Math.random() * 100,
 gamma: Math.random() * 100
 });
 setSignalQuality(Math.random() * 100);
 setRecordingTime(prev => prev + 1);
 }, 1000);

 return () => clearInterval(interval);
 }
 }, [isRecording]);

 // Analyze mental state based on brainwave data
 useEffect(() => {
 if (isRecording && signalQuality > 50) {
 const avgAlpha = brainwaveData.alpha;
 const avgBeta = brainwaveData.beta;
 const avgTheta = brainwaveData.theta;

 let mentalState: MentalState;

 if (avgAlpha > 60 && avgBeta < 30) {
 mentalState = {
 type: "Relaxed",
 confidence: 85,
 description: "Your brain is in a calm, relaxed state. Great for meditation and stress relief.",
 color: "bg-green-500",
 icon: <Heart className="h-5 w-5" />
 };
 } else if (avgBeta > 60 && avgAlpha < 30) {
 mentalState = {
 type: "Focused",
 confidence: 78,
 description: "High concentration and alertness. Perfect for work and learning.",
 color: "bg-blue-500",
 icon: <Target className="h-5 w-5" />
 };
 } else if (avgTheta > 50) {
 mentalState = {
 type: "Creative",
 confidence: 72,
 description: "Enhanced creativity and imagination. Ideal for artistic activities.",
 color: "bg-purple-500",
 icon: <Eye className="h-5 w-5" />
 };
 } else {
 mentalState = {
 type: "Balanced",
 confidence: 65,
 description: "A balanced mental state with mixed brainwave activity.",
 color: "bg-yellow-500",
 icon: <Activity className="h-5 w-5" />
 };
 }

 setCurrentMentalState(mentalState);
 }
 }, [brainwaveData, isRecording, signalQuality]);

 const startRecording = () => {
 setIsRecording(true);
 setRecordingTime(0);
 setIsConnected(true);
 };

 const stopRecording = () => {
 setIsRecording(false);
 setIsConnected(false);
 };

 const resetRecording = () => {
 setIsRecording(false);
 setRecordingTime(0);
 setBrainwaveData({
 alpha: 0,
 beta: 0,
 theta: 0,
 delta: 0,
 gamma: 0
 });
 setCurrentMentalState(null);
 setSignalQuality(0);
 setIsConnected(false);
 };

 const formatTime = (seconds: number) => {
 const mins = Math.floor(seconds / 60);
 const secs = seconds % 60;
 return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
 };

 return (
 <div className="min-h-screen bg-background">
 {/* Header */}
 <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
 <div className="container flex h-16 items-center justify-between">
 <Link to="/" className="flex items-center space-x-2">
 <ArrowLeft className="h-4 w-4" />
 <span className="font-semibold">Back to Home</span>
 </Link>
 <div className="flex items-center space-x-4">
 <div className="flex items-center space-x-2">
 <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
 <span className="text-sm">{isConnected ? 'Connected' : 'Disconnected'}</span>
 </div>
 </div>
 </div>
 </div>

 {/* Main Content */}
 <div className="container py-8">
 <div className="mx-auto max-w-6xl">
 {/* Header */}
 <div className="text-center mb-8">
 <div className="inline-flex items-center justify-center w-16 h-16 bg-spotify-green rounded-full mb-6">
 <Brain className="h-8 w-8 text-white" />
 </div>
 <h1 className="text-4xl font-bold tracking-tight mb-4">
 Mental State <span className="text-spotify-green">Analysis</span>
 </h1>
 <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
 Monitor your brainwave patterns and understand your current mental state in real-time.
 </p>
 </div>

 {/* Recording Controls */}
 <Card className="mb-8">
 <CardHeader>
 <CardTitle className="flex items-center gap-2">
 <Activity className="h-5 w-5 text-green-600" />
 EEG Recording
 </CardTitle>
 <CardDescription>
 Connect your EEG device and start recording to analyze your mental state
 </CardDescription>
 </CardHeader>
 <CardContent>
 <div className="flex items-center justify-between mb-6">
 <div className="flex items-center space-x-4">
 <Button 
 onClick={isRecording ? stopRecording : startRecording}
 className={isRecording ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
 >
 {isRecording ? (
 <>
 <Pause className="h-4 w-4 mr-2" />
 Stop Recording
 </>
 ) : (
 <>
 <Play className="h-4 w-4 mr-2" />
 Start Recording
 </>
 )}
 </Button>
 <Button variant="outline" onClick={resetRecording}>
 <RotateCcw className="h-4 w-4 mr-2" />
 Reset
 </Button>
 </div>
 <div className="flex items-center space-x-2">
 <Clock className="h-4 w-4 text-muted-foreground" />
 <span className="font-mono text-lg">{formatTime(recordingTime)}</span>
 </div>
 </div>

 {/* Signal Quality */}
 <div className="space-y-2">
 <div className="flex items-center justify-between">
 <span className="text-sm font-medium">Signal Quality</span>
 <span className="text-sm text-muted-foreground">{Math.round(signalQuality)}%</span>
 </div>
 <Progress value={signalQuality} className="h-2" />
 <div className="flex items-center space-x-2 text-xs text-muted-foreground">
 {signalQuality > 80 ? (
 <CheckCircle className="h-3 w-3 text-green-500" />
 ) : signalQuality > 50 ? (
 <AlertCircle className="h-3 w-3 text-yellow-500" />
 ) : (
 <AlertCircle className="h-3 w-3 text-red-500" />
 )}
 <span>
 {signalQuality > 80 ? "Excellent signal" : 
 signalQuality > 50 ? "Good signal" : "Poor signal - check device connection"}
 </span>
 </div>
 </div>
 </CardContent>
 </Card>

 <div className="grid gap-8 lg:grid-cols-2">
 {/* Brainwave Analysis */}
 <Card>
 <CardHeader>
 <CardTitle className="flex items-center gap-2">
 <BarChart3 className="h-5 w-5 text-green-600" />
 Brainwave Analysis
 </CardTitle>
 <CardDescription>
 Real-time brainwave frequency analysis
 </CardDescription>
 </CardHeader>
 <CardContent className="space-y-4">
 {Object.entries(brainwaveData).map(([wave, value]) => (
 <div key={wave} className="space-y-2">
 <div className="flex items-center justify-between">
 <span className="text-sm font-medium capitalize">{wave} Waves</span>
 <span className="text-sm text-muted-foreground">{Math.round(value)}%</span>
 </div>
 <Progress value={value} className="h-2" />
 <div className="text-xs text-muted-foreground">
 {wave === 'alpha' && 'Relaxation and calmness (8-13 Hz)'}
 {wave === 'beta' && 'Active thinking and concentration (13-30 Hz)'}
 {wave === 'theta' && 'Deep relaxation and creativity (4-8 Hz)'}
 {wave === 'delta' && 'Deep sleep and unconsciousness (0.5-4 Hz)'}
 {wave === 'gamma' && 'High-level processing and insight (30-100 Hz)'}
 </div>
 </div>
 ))}
 </CardContent>
 </Card>

 {/* Mental State Detection */}
 <Card>
 <CardHeader>
 <CardTitle className="flex items-center gap-2">
 <Zap className="h-5 w-5 text-green-600" />
 Mental State Detection
 </CardTitle>
 <CardDescription>
 AI-powered mental state analysis
 </CardDescription>
 </CardHeader>
 <CardContent>
 {currentMentalState ? (
 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <div className="flex items-center space-x-3">
 <div className={`w-12 h-12 rounded-full flex items-center justify-center ${currentMentalState.color} text-white`}>
 {currentMentalState.icon}
 </div>
 <div>
 <h3 className="font-semibold text-lg">{currentMentalState.type}</h3>
 <p className="text-sm text-muted-foreground">
 Confidence: {currentMentalState.confidence}%
 </p>
 </div>
 </div>
 <Badge variant="secondary" className="text-xs">
 {currentMentalState.confidence}% confident
 </Badge>
 </div>
 <p className="text-sm text-muted-foreground">
 {currentMentalState.description}
 </p>
 <div className="space-y-2">
 <div className="flex items-center justify-between text-sm">
 <span>Confidence Level</span>
 <span>{currentMentalState.confidence}%</span>
 </div>
 <Progress value={currentMentalState.confidence} className="h-2" />
 </div>
 </div>
 ) : (
 <div className="text-center py-8">
 <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
 <p className="text-muted-foreground">
 {isRecording ? "Analyzing your mental state..." : "Start recording to analyze your mental state"}
 </p>
 </div>
 )}
 </CardContent>
 </Card>
 </div>

 {/* Historical Data */}
 <Card className="mt-8">
 <CardHeader>
 <CardTitle className="flex items-center gap-2">
 <TrendingUp className="h-5 w-5 text-green-600" />
 Mental State History
 </CardTitle>
 <CardDescription>
 Track your mental states over time
 </CardDescription>
 </CardHeader>
 <CardContent>
 <div className="grid gap-4 md:grid-cols-4">
 {[
 { type: "Focused", time: "2 hours ago", duration: "45 min", color: "bg-blue-500" },
 { type: "Relaxed", time: "4 hours ago", duration: "30 min", color: "bg-green-500" },
 { type: "Creative", time: "6 hours ago", duration: "20 min", color: "bg-purple-500" },
 { type: "Balanced", time: "8 hours ago", duration: "60 min", color: "bg-yellow-500" }
 ].map((session, index) => (
 <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border">
 <div className={`w-8 h-8 rounded-full ${session.color} flex items-center justify-center`}>
 <Activity className="h-4 w-4 text-white" />
 </div>
 <div className="flex-1">
 <p className="font-medium text-sm">{session.type}</p>
 <p className="text-xs text-muted-foreground">{session.time}</p>
 </div>
 <Badge variant="outline" className="text-xs">
 {session.duration}
 </Badge>
 </div>
 ))}
 </div>
 </CardContent>
 </Card>

 {/* Recommendations */}
 <Card className="mt-8">
 <CardHeader>
 <CardTitle className="flex items-center gap-2">
 <Music className="h-5 w-5 text-green-600" />
 Music Recommendations
 </CardTitle>
 <CardDescription>
 Based on your current mental state
 </CardDescription>
 </CardHeader>
 <CardContent>
 {currentMentalState ? (
 <div className="grid gap-4 md:grid-cols-3">
 {currentMentalState.type === "Relaxed" && (
 <>
 <div className="p-4 rounded-lg border">
 <h4 className="font-semibold mb-2">Ambient & Nature Sounds</h4>
 <p className="text-sm text-muted-foreground">Calming ambient music and nature sounds</p>
 </div>
 <div className="p-4 rounded-lg border">
 <h4 className="font-semibold mb-2">Classical Piano</h4>
 <p className="text-sm text-muted-foreground">Peaceful classical piano compositions</p>
 </div>
 <div className="p-4 rounded-lg border">
 <h4 className="font-semibold mb-2">Lo-fi Beats</h4>
 <p className="text-sm text-muted-foreground">Relaxing lo-fi hip-hop beats</p>
 </div>
 </>
 )}
 {currentMentalState.type === "Focused" && (
 <>
 <div className="p-4 rounded-lg border">
 <h4 className="font-semibold mb-2">Instrumental Focus</h4>
 <p className="text-sm text-muted-foreground">Concentration-enhancing instrumental music</p>
 </div>
 <div className="p-4 rounded-lg border">
 <h4 className="font-semibold mb-2">Productivity Beats</h4>
 <p className="text-sm text-muted-foreground">Upbeat electronic music for productivity</p>
 </div>
 <div className="p-4 rounded-lg border">
 <h4 className="font-semibold mb-2">Classical Focus</h4>
 <p className="text-sm text-muted-foreground">Baroque and classical compositions</p>
 </div>
 </>
 )}
 {currentMentalState.type === "Creative" && (
 <>
 <div className="p-4 rounded-lg border">
 <h4 className="font-semibold mb-2">Experimental Electronic</h4>
 <p className="text-sm text-muted-foreground">Innovative electronic and ambient sounds</p>
 </div>
 <div className="p-4 rounded-lg border">
 <h4 className="font-semibold mb-2">Jazz & Improvisation</h4>
 <p className="text-sm text-muted-foreground">Creative jazz and improvisational music</p>
 </div>
 <div className="p-4 rounded-lg border">
 <h4 className="font-semibold mb-2">World Music</h4>
 <p className="text-sm text-muted-foreground">Diverse cultural and traditional music</p>
 </div>
 </>
 )}
 </div>
 ) : (
 <p className="text-center text-muted-foreground py-8">
 Start recording to get personalized music recommendations
 </p>
 )}
 </CardContent>
 </Card>
 </div>
 </div>
 </div>
 );
}
