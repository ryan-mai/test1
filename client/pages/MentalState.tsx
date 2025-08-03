"use client";

import { useState, useEffect, useId, useRef } from "react";
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
import { useBrainwave } from "@/lib/BrainwaveContext";
import { NowPlayingBar } from "@/components/NowPlayingBar";
import { motion, AnimatePresence } from "framer-motion";
import SplitText from "@/components/SplitText";

// Infinite scrolling row demo items
const infiniteRowItems = [
  { link: '#', text: 'Mojave', image: 'https://picsum.photos/600/400?random=1' },
  { link: '#', text: 'Sonoma', image: 'https://picsum.photos/600/400?random=2' },
  { link: '#', text: 'Monterey', image: 'https://picsum.photos/600/400?random=3' },
  { link: '#', text: 'Sequoia', image: 'https://picsum.photos/600/400?random=4' }
];

function InfiniteScrollingRow() {
  return (
    <div className="relative w-full overflow-hidden h-40 bg-transparent">
      <div className="flex items-center gap-8 animate-infinite-scroll whitespace-nowrap">
        {infiniteRowItems.map((item, idx) => (
          <a key={idx} href={item.link} className="inline-flex flex-col items-center justify-center min-w-[180px] mx-2">
            <img src={item.image} alt={item.text} className="w-24 h-24 rounded-xl object-cover mb-2 shadow-lg" />
            <span className="text-white font-semibold text-lg">{item.text}</span>
          </a>
        ))}
        {/* Duplicate for seamless loop */}
        {infiniteRowItems.map((item, idx) => (
          <a key={idx + 'dup'} href={item.link} className="inline-flex flex-col items-center justify-center min-w-[180px] mx-2">
            <img src={item.image} alt={item.text} className="w-24 h-24 rounded-xl object-cover mb-2 shadow-lg" />
            <span className="text-white font-semibold text-lg">{item.text}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
import { useOutsideClick } from "@/hooks/use-outside-click";
import { useAudio } from "@/lib/AudioContext";


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

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-x"
    >
      <path d="M18 6 6 18"></path>
      <path d="m6 6 12 12"></path>
    </motion.svg>
  );
};

const cards = [
  {
    description: "Lana Del Rey",
    title: "Summertime Sadness",
    src: "https://assets.aceternity.com/demos/lana-del-rey.jpeg",
    ctaText: "Play",
    ctaLink: "https://ui.aceternity.com/templates",
    content: () => {
      return (
        <p>
          Lana Del Rey, an iconic American singer-songwriter, is celebrated for
          her melancholic and cinematic music style. Born Elizabeth Woolridge
          Grant in New York City, she has captivated audiences worldwide with
          her haunting voice and introspective lyrics. <br /> <br /> Her songs
          often explore themes of tragic romance, glamour, and melancholia,
          drawing inspiration from both contemporary and vintage pop culture.
          With a career that has seen numerous critically acclaimed albums, Lana
          Del Rey has established herself as a unique and influential figure in
          the music industry, earning a dedicated fan base and numerous
          accolades.
        </p>
      );
    },
  },
  {
    description: "Babbu Maan",
    title: "Mitran Di Chhatri",
    src: "https://assets.aceternity.com/demos/babbu-maan.jpeg",
    ctaText: "Play",
    ctaLink: "https://ui.aceternity.com/templates",
    content: () => {
      return (
        <p>
          Babu Maan, a legendary Punjabi singer, is renowned for his soulful
          voice and profound lyrics that resonate deeply with his audience. Born
          in the village of Khant Maanpur in Punjab, India, he has become a
          cultural icon in the Punjabi music industry. <br /> <br /> His songs
          often reflect the struggles and triumphs of everyday life, capturing
          the essence of Punjabi culture and traditions. With a career spanning
          over two decades, Babu Maan has released numerous hit albums and
          singles that have garnered him a massive fan following both in India
          and abroad.
        </p>
      );
    },
  },
  {
    description: "Metallica",
    title: "For Whom The Bell Tolls",
    src: "https://assets.aceternity.com/demos/metallica.jpeg",
    ctaText: "Play",
    ctaLink: "https://ui.aceternity.com/templates",
    content: () => {
      return (
        <p>
          Metallica, an iconic American heavy metal band, is renowned for their
          powerful sound and intense performances that resonate deeply with
          their audience. Formed in Los Angeles, California, they have become a
          cultural icon in the heavy metal music industry. <br /> <br /> Their
          songs often reflect themes of aggression, social issues, and personal
          struggles, capturing the essence of the heavy metal genre. With a
          career spanning over four decades, Metallica has released numerous hit
          albums and singles that have garnered them a massive fan following
          both in the United States and abroad.
        </p>
      );
    },
  },
  {
    description: "Led Zeppelin",
    title: "Stairway To Heaven",
    src: "https://assets.aceternity.com/demos/led-zeppelin.jpeg",
    ctaText: "Play",
    ctaLink: "https://ui.aceternity.com/templates",
    content: () => {
      return (
        <p>
          Led Zeppelin, a legendary British rock band, is renowned for their
          innovative sound and profound impact on the music industry. Formed in
          London in 1968, they have become a cultural icon in the rock music
          world. <br /> <br /> Their songs often reflect a blend of blues, hard
          rock, and folk music, capturing the essence of the 1970s rock era.
          With a career spanning over a decade, Led Zeppelin has released
          numerous hit albums and singles that have garnered them a massive fan
          following both in the United Kingdom and abroad.
        </p>
      );
    },
  },
  {
    description: "Mustafa Zahid",
    title: "Toh Phir Aao",
    src: "https://assets.aceternity.com/demos/toh-phir-aao.jpeg",
    ctaText: "Play",
    ctaLink: "https://ui.aceternity.com/templates",
    content: () => {
      return (
        <p>
          &quot;Aawarapan&quot;, a Bollywood movie starring Emraan Hashmi, is
          renowned for its intense storyline and powerful performances. Directed
          by Mohit Suri, the film has become a significant work in the Indian
          film industry. <br /> <br /> The movie explores themes of love,
          redemption, and sacrifice, capturing the essence of human emotions and
          relationships. With a gripping narrative and memorable music,
          &quot;Aawarapan&quot; has garnered a massive fan following both in
          India and abroad, solidifying Emraan Hashmi&apos;s status as a
          versatile actor.
        </p>
      );
    },
  },
];

export function ExpandableCardDemo() {
  const [active, setActive] = useState<(typeof cards)[number] | boolean | null>(
    null
  );
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0  grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-[#1c1c1c] dark:bg-neutral-900 sm:rounded-3xl overflow-hidden border border-neutral-800"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <img
                  width={200}
                  height={200}
                  src={active.src}
                  alt={active.title}
                  className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                />
              </motion.div>

              <div>
                <div className="flex justify-between items-start p-4">
                  <div className="">
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-bold text-white dark:text-neutral-200"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="text-gray-400 dark:text-neutral-400"
                    >
                      {active.description}
                    </motion.p>
                  </div>

                  <motion.a
                    layoutId={`button-${active.title}-${id}`}
                    href={active.ctaLink}
                    target="_blank"
                    className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white"
                  >
                    {active.ctaText}
                  </motion.a>
                </div>
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-gray-300 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    {typeof active.content === "function"
                      ? active.content()
                      : active.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <ul className="max-w-2xl mx-auto w-full gap-4">
        {cards.map((card, index) => (
          <motion.div
            layoutId={`card-${card.title}-${id}`}
            key={`card-${card.title}-${id}`}
            onClick={() => setActive(card)}
            className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-[#232323] dark:hover:bg-neutral-800 rounded-xl cursor-pointer border border-neutral-800"
          >
            <div className="flex gap-4 flex-col md:flex-row ">
              <motion.div layoutId={`image-${card.title}-${id}`}>
                <img
                  width={100}
                  height={100}
                  src={card.src}
                  alt={card.title}
                  className="h-40 w-40 md:h-14 md:w-14 rounded-lg object-cover object-top"
                />
              </motion.div>
              <div className="">
                <motion.h3
                  layoutId={`title-${card.title}-${id}`}
                  className="font-medium text-white dark:text-neutral-200 text-center md:text-left"
                >
                  {card.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${card.description}-${id}`}
                  className="text-gray-400 dark:text-neutral-400 text-center md:text-left"
                >
                  {card.description}
                </motion.p>
              </div>
            </div>
            <motion.button
              layoutId={`button-${card.title}-${id}`}
              className="px-4 py-2 text-sm rounded-full font-bold bg-neutral-800 hover:bg-green-500 hover:text-white text-gray-300 mt-4 md:mt-0"
            >
              {card.ctaText}
            </motion.button>
          </motion.div>
        ))}
      </ul>
      <div className="mt-6 flex justify-center">
        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-800 text-gray-400 hover:bg-neutral-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
          </svg>
          <span className="font-medium">Discover More?</span>
        </button>
      </div>
    </>
  );
}

export default function MentalState() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  // Get brainwave data from shared context
  const { brainwaveData, updateBrainwaveData, processingStatus, statusMessage } = useBrainwave();
  
  // Local state for UI
  const [currentMentalState, setCurrentMentalState] = useState<MentalState | null>(null);
  const [signalQuality, setSignalQuality] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  
  // Effect to update mental state based on brainwave data from context
  useEffect(() => {
    if (processingStatus === 'success' && brainwaveData) {
      // Process the brainwave data to determine mental state
      determineMentalState(brainwaveData);
      // If we have data, consider ourselves connected
      setIsConnected(true);
      setSignalQuality(85); // Assume good signal quality if we have data
    }
  }, [brainwaveData, processingStatus]);
  
  // Function to determine mental state based on brainwave data
  const determineMentalState = (data: BrainwaveData) => {
    // Simple algorithm to determine mental state based on brainwave bands
    // This is a placeholder - you would use actual neuroscience here
    
    let mentalStateType = '';
    let confidence = 0;
    let description = '';
    let color = '';
    let icon = <Activity className="h-5 w-5" />;
    
    // Higher alpha often indicates relaxation
    if (data.alpha > 60) {
      mentalStateType = 'Relaxed';
      confidence = 0.8;
      description = 'You are in a calm, relaxed state. Your mind is clear and at ease.';
      color = 'bg-green-500';
      icon = <Heart className="h-5 w-5" />;
    } 
    // Higher beta often indicates focus/concentration
    else if (data.beta > 60) {
      mentalStateType = 'Focused';
      confidence = 0.75;
      description = 'You are focused and engaged. Your attention is directed and alert.';
      color = 'bg-blue-500';
      icon = <Target className="h-5 w-5" />;
    }
    // Higher theta can indicate creativity or drowsiness
    else if (data.theta > 60) {
      mentalStateType = 'Creative';
      confidence = 0.7;
      description = 'Your mind is in a creative flow state, with heightened imagination.';
      color = 'bg-purple-500';
      icon = <Zap className="h-5 w-5" />;
    }
    // Higher delta often indicates deep sleep or distress
    else if (data.delta > 60) {
      mentalStateType = 'Distressed';
      confidence = 0.6;
      description = 'You may be experiencing stress or anxiety. Consider some relaxation techniques.';
      color = 'bg-red-500';
      icon = <AlertCircle className="h-5 w-5" />;
    }
    // Balanced profile
    else {
      mentalStateType = 'Balanced';
      confidence = 0.65;
      description = 'Your brain activity shows a balanced pattern across different frequencies.';
      color = 'bg-yellow-500';
      icon = <Activity className="h-5 w-5" />;
    }
    
    setCurrentMentalState({
      type: mentalStateType,
      confidence: confidence * 100, // Convert to percentage
      description,
      color,
      icon
    });
  };

  // Connect to the backend API
  useEffect(() => {
    if (isRecording) {
      // Start the session on the backend
      fetch('http://localhost:8008/api/session/start', {
        method: 'POST',
      })
      .then(response => response.json())
      .then(data => {
        console.log("Session started:", data);
      })
      .catch(error => {
        console.error("Error starting session:", error);
        setIsConnected(false);
      });

      // Set up a timer to update recording time and fetch data from the backend
      const interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
        
        // Get current mental state from backend
        fetch('http://localhost:8008/api/mental-state')
          .then(response => response.json())
          .then(data => {
            if (data.mentalState) {
              // We're now using brainwave data from context, so we update it
              // using the updateBrainwaveData function instead of the non-existent setBrainwaveData
              updateBrainwaveData({
                alpha: Math.random() * 100,  // Replace with actual data when available
                beta: Math.random() * 100,
                theta: Math.random() * 100,
                delta: Math.random() * 100,
                gamma: Math.random() * 100
              });
              
              setSignalQuality(80); // Simulated good signal
            }
          })
          .catch(error => {
            console.error("Error fetching mental state:", error);
            setSignalQuality(prev => Math.max(prev - 10, 0)); // Decrease signal quality on error
          });
      }, 1000);

      return () => {
        clearInterval(interval);
        // Stop the session when recording stops
        fetch('http://localhost:8008/api/session/stop', {
          method: 'POST',
        }).catch(console.error);
      };
    }
  }, [isRecording]);

  // Analyze mental state based on brainwave data
  useEffect(() => {
    if (isRecording && signalQuality > 50) {
      // Send a message to analyze mental state
      const message = "User is currently being monitored.";
      
      fetch('http://localhost:8008/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: message }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.mentalState) {
            // Convert the backend's mental state to our frontend format
            let iconComponent;
            let colorClass;
            
            switch (data.mentalState.type) {
              case 'Relaxed':
                iconComponent = <Heart className="h-5 w-5" />;
                colorClass = "bg-green-500";
                break;
              case 'Focused':
                iconComponent = <Target className="h-5 w-5" />;
                colorClass = "bg-blue-500";
                break;
              case 'Creative':
                iconComponent = <Eye className="h-5 w-5" />;
                colorClass = "bg-purple-500";
                break;
              case 'Distressed':
                iconComponent = <AlertCircle className="h-5 w-5" />;
                colorClass = "bg-red-500";
                break;
              default:
                iconComponent = <Activity className="h-5 w-5" />;
                colorClass = "bg-yellow-500";
                break;
            }
            
            setCurrentMentalState({
              type: data.mentalState.type,
              confidence: data.mentalState.confidence,
              description: data.mentalState.description,
              color: colorClass,
              icon: iconComponent
            });
          }
        })
        .catch(error => {
          console.error("Error analyzing mental state:", error);
        });
    }
  }, [brainwaveData, isRecording, signalQuality]);

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    setIsConnected(true);
    
    // Send a message to start processing in the backend
    fetch('http://localhost:8008/api/session/start', {
      method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
      console.log("Session started:", data);
    })
    .catch(error => {
      console.error("Error starting session:", error);
      setIsConnected(false);
    });
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsConnected(false);
    
    // Send a message to stop processing in the backend
    fetch('http://localhost:8008/api/session/stop', {
      method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
      console.log("Session stopped:", data);
    })
    .catch(error => {
      console.error("Error stopping session:", error);
    });
  };

  const resetRecording = () => {
    setIsRecording(false);
    setRecordingTime(0);
    updateBrainwaveData({
      alpha: 0,
      beta: 0,
      theta: 0,
      delta: 0,
      gamma: 0
    });
    setCurrentMentalState(null);
    setSignalQuality(0);
    setIsConnected(false);
    
    // Stop the session on the backend
    fetch('http://localhost:8008/api/session/stop', {
      method: 'POST',
    }).catch(console.error);
  };

  const [historyData, setHistoryData] = useState([
    { type: "Focused", time: "2 hours ago", duration: "45 min", color: "bg-blue-500" },
    { type: "Relaxed", time: "4 hours ago", duration: "30 min", color: "bg-green-500" },
    { type: "Creative", time: "6 hours ago", duration: "20 min", color: "bg-purple-500" },
    { type: "Balanced", time: "8 hours ago", duration: "60 min", color: "bg-yellow-500" }
  ]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Fetch history data
  useEffect(() => {
    // Only fetch when recording or when component mounts
    fetch('http://localhost:8008/api/mental-state/history')
      .then(response => response.json())
      .then(data => {
        if (data.history && data.history.length > 0) {
          // Format the history data
          const formattedHistory = data.history.map(item => {
            // Convert timestamp to relative time
            const timestamp = new Date(item.timestamp);
            const now = new Date();
            const diffMs = now.getTime() - timestamp.getTime();
            const diffMins = Math.round(diffMs / (1000 * 60));
            
            let timeAgo;
            if (diffMins < 60) {
              timeAgo = `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
            } else {
              const diffHours = Math.round(diffMins / 60);
              timeAgo = `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
            }
            
            // Determine color based on state type
            let color;
            switch (item.type) {
              case 'Relaxed': color = 'bg-green-500'; break;
              case 'Focused': color = 'bg-blue-500'; break;
              case 'Creative': color = 'bg-purple-500'; break;
              case 'Distressed': color = 'bg-red-500'; break;
              default: color = 'bg-yellow-500'; break;
            }
            
            return {
              type: item.type,
              time: timeAgo,
              duration: "N/A", // Duration not tracked in backend yet
              color: color
            };
          });
          
          // Only update if there's actual data
          if (formattedHistory.length > 0) {
            setHistoryData(formattedHistory);
          }
        }
      })
      .catch(error => {
        console.error("Error fetching history:", error);
      });
  }, [isRecording]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#232323] via-[#1c1c1c] to-[#141414] text-white">
      {/* Header */}
      <div className="border-b border-neutral-800 bg-gradient-to-b from-[#232323]/95 to-[#1c1c1c]/95 backdrop-blur supports-[backdrop-filter]:from-[#232323]/60 supports-[backdrop-filter]:to-[#1c1c1c]/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="font-semibold">Back to Home</span>
          </Link>
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
            <div className="mb-4">
              <SplitText 
                text="Dashboard" 
                splitType="chars"
                delay={50}
                duration={0.8}
                from={{ opacity: 0, y: 30, rotateX: -90 }}
                to={{ opacity: 1, y: 0, rotateX: 0 }}
                ease="power4.out"
                className="text-6xl font-bold text-white"
              />
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Brainwave Analysis */}
            <Card className="bg-[#1c1c1c] border-neutral-800 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <BarChart3 className="h-5 w-5 text-green-500" />
                  Brainwave Analysis
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Real-time brainwave frequency analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(brainwaveData).map(([wave, value]) => {
                  // Skip non-numeric properties like 'bpm' and 'genre'
                  if (wave === 'bpm' || wave === 'genre') return null;
                  
                  // Ensure value is a number
                  const numericValue = typeof value === 'number' ? value : 0;
                  
                  return (
                    <div key={wave} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize text-gray-300">{wave} Waves</span>
                        <span className="text-sm text-gray-400">{Math.round(numericValue)}%</span>
                      </div>
                      {/* Sinusoidal SVG wave instead of Progress bar */}
                      <div className="h-8 w-full flex items-center">
                        <svg width="100%" height="32" viewBox="0 0 200 32" preserveAspectRatio="none" style={{ width: '100%', height: '32px', display: 'block' }}>
                          <polyline
                            fill="none"
                            stroke={(() => {
                              switch (wave) {
                                case 'alpha': return '#bae6fd'; // blue-200 (dimmed)
                                case 'beta': return '#ddd6fe'; // purple-200
                                case 'theta': return '#bbf7d0'; // green-200
                                case 'delta': return '#fef9c3'; // yellow-200
                                case 'gamma': return '#fbcfe8'; // pink-200
                                default: return '#c7d2fe'; // indigo-200
                              }
                            })()}
                            strokeWidth="2"
                            points={(() => {
                              // Generate a more curvy sinusoidal wave
                              const amplitude = 10 + (numericValue / 10); // amplitude based on value
                              const frequency = 3 + (numericValue / 50); // higher base frequency for more curves
                              const points = [];
                              for (let x = 0; x <= 200; x += 2) { // more points for smoother, curvier wave
                                const y = 16 + amplitude * Math.sin((x / 200) * frequency * 2 * Math.PI);
                                points.push(`${x},${y.toFixed(2)}`);
                              }
                              return points.join(' ');
                            })()}
                          />
                        </svg>
                      </div>
                      <div className="text-xs text-gray-400">
                        {wave === 'alpha' && 'Relaxation and calmness (8-13 Hz)'}
                        {wave === 'beta' && 'Active thinking and concentration (13-30 Hz)'}
                        {wave === 'theta' && 'Deep relaxation and creativity (4-8 Hz)'}
                        {wave === 'delta' && 'Deep sleep and unconsciousness (0.5-4 Hz)'}
                        {wave === 'gamma' && 'High-level processing and insight (30-100 Hz)'}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Music Recommendations */}
            <Card className="bg-[#1c1c1c] border-neutral-800 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Music className="h-5 w-5 text-green-500" />
                  Your Recommended
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentMentalState ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${currentMentalState.color} text-white`}>
                        {currentMentalState.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-white">{currentMentalState.type}</h3>
                        <p className="text-sm text-gray-400">
                          Based on your current mental state
                        </p>
                      </div>
                    </div>
                    <ExpandableCardDemo />
                  </div>
                ) : (
                  <div className="text-center py-4 mb-4">
                    <ExpandableCardDemo />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Historical Data */}
          <Card className="mt-8 bg-[#1c1c1c] border-neutral-800 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Your Ups & Downs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full">
                <InfiniteScrollingRow />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Gap before Now Playing Bar */}
      <div style={{ height: '124px' }} />

      {/* Now Playing Bar */}
      <NowPlayingBar />
    </div>
  );
}
