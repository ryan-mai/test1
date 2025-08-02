import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface TimelineData {
  title: string;
  content: React.ReactNode;
}

interface AnimatedTimelineProps {
  data: TimelineData[];
  activeStep?: number;
  onStepChange?: (step: number) => void;
}

const AnimatedTimeline: React.FC<AnimatedTimelineProps> = ({
  data,
  activeStep = 0,
  onStepChange,
}) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState(activeStep);
  const [progress, setProgress] = useState(0);
  
  // Handle changes in active step
  useEffect(() => {
    if (activeStep !== currentStep) {
      setCurrentStep(activeStep);
      updateProgressLine(activeStep);
    }
  }, [activeStep]);

  // Initialize the timeline
  useEffect(() => {
    // Calculate initial progress line height
    updateProgressLine(currentStep);
    
    // Set up a demo auto-progress (remove this in production and use real progress)
    const intervalId = setInterval(() => {
      setProgress(prev => {
        if (prev >= 1) {
          // Move to the next step when progress is complete
          if (currentStep < data.length - 1) {
            const nextStep = currentStep + 1;
            setCurrentStep(nextStep);
            if (onStepChange) onStepChange(nextStep);
            return 0;
          }
          return 0;
        }
        return prev + 0.01;
      });
    }, 100);
    
    return () => clearInterval(intervalId);
  }, [currentStep, data.length, onStepChange]);
  
  // Update the progress line based on current step and progress
  const updateProgressLine = (step: number) => {
    if (!progressLineRef.current) return;
    
    const progressPercentage = ((step + progress) / data.length) * 100;
    progressLineRef.current.style.height = `${progressPercentage}%`;
  };
  
  // Effect to update progress line when progress changes
  useEffect(() => {
    updateProgressLine(currentStep);
  }, [progress, currentStep]);
  
  // Function to move to a specific step
  const goToStep = (step: number) => {
    if (step >= 0 && step < data.length) {
      setCurrentStep(step);
      setProgress(0);
      if (onStepChange) onStepChange(step);
    }
  };
  return (
    <div ref={timelineRef} className="relative pt-8 pb-16">
      {/* Timeline line */}
      <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700">
        <motion.div 
          ref={progressLineRef}
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-blue-500 to-purple-500"
          style={{ height: "0%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        ></motion.div>
      </div>
      
      {/* Timeline items */}
      <div className="relative">
        <AnimatePresence>
          {data.map((item, index) => {
            // Calculate vertical position based on step
            let positionClass = "";
            if (index < currentStep) {
              positionClass = "sticky top-4";
            } else if (index === currentStep) {
              positionClass = "sticky top-1/2 -translate-y-1/2";
            } else {
              positionClass = "sticky bottom-4";
            }
            
            return (
              <motion.div
                key={index}
                ref={el => (timelineItemsRef.current[index] = el)}
                className={`relative pl-12 md:pl-16 py-8 mb-8 transition-all duration-500 ${positionClass}`}
                layout
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: index === currentStep ? 1 : index < currentStep ? 0.4 : 0.7,
                }}
                transition={{ duration: 0.5 }}
              >
                {/* Timeline dot */}
                <motion.div
                  className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${
                    index < currentStep
                      ? "bg-blue-500 text-white"
                      : index === currentStep
                      ? "bg-purple-500 text-white ring-4 ring-purple-200 dark:ring-purple-900/30"
                      : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                  animate={{
                    scale: index === currentStep ? 1.2 : 1
                  }}
                >
                  {index + 1}
                </motion.div>
                
                {/* Timeline content */}
                <div className="mb-6">
                  <h3 className={`text-xl font-bold mb-2 transition-colors ${
                    index === currentStep ? "text-purple-600 dark:text-purple-400" : 
                    index < currentStep ? "text-gray-400 dark:text-gray-500" : 
                    "text-gray-700 dark:text-gray-300"
                  }`}>
                    {item.title}
                  </h3>
                  <motion.div 
                    className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg transition-all"
                    animate={{
                      opacity: index === currentStep ? 1 : 0.5,
                      scale: index === currentStep ? 1 : 0.98,
                      filter: index === currentStep ? "blur(0px)" : "blur(1px)"
                    }}
                  >
                    {item.content}
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AnimatedTimeline;
