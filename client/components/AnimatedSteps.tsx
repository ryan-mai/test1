import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import StepLine from "./StepLine";

interface Step {
  title: string;
  description?: string;
}

interface AnimatedStepsProps {
  steps: Step[];
  activeStep: number;
  onStepClick?: (step: number) => void;
  orientation?: "horizontal" | "vertical";
}

const AnimatedSteps: React.FC<AnimatedStepsProps> = ({
  steps,
  activeStep,
  onStepClick,
  orientation = "horizontal",
}) => {
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  
  useEffect(() => {
    // Animate the active step
    stepsRef.current.forEach((step, index) => {
      if (!step) return;
      
      const isActive = index === activeStep;
      const isPast = index < activeStep;
      const isFuture = index > activeStep;
      
      gsap.to(step, {
        scale: isActive ? 1.1 : 1,
        opacity: isFuture ? 0.6 : 1,
        duration: 0.4,
        ease: "power2.out"
      });
    });
  }, [activeStep, steps.length]);

  return (
    <div className={`flex ${orientation === "horizontal" ? "flex-row" : "flex-col"} items-center justify-between w-full`}>
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          {/* Step circle */}
          <div 
            ref={el => (stepsRef.current[index] = el)}
            onClick={() => onStepClick?.(index)}
            className={`
              relative flex flex-col items-center cursor-pointer transition-colors
              ${orientation === "vertical" ? "mb-12" : ""}
            `}
          >
            <div 
              className={`
                flex items-center justify-center w-12 h-12 rounded-full 
                transition-all duration-300 z-10
                ${index <= activeStep 
                  ? "bg-primary text-white" 
                  : "bg-gray-200 text-gray-500"
                }
              `}
            >
              {index + 1}
            </div>
            <div className="mt-2 text-center">
              <p 
                className={`
                  font-medium text-sm
                  ${index === activeStep ? "text-primary" : "text-gray-500"}
                `}
              >
                {step.title}
              </p>
              {step.description && (
                <p className="text-xs text-gray-400 mt-1">{step.description}</p>
              )}
            </div>
          </div>

          {/* Connection line between steps */}
          {index < steps.length - 1 && (
            <div className={`flex-1 px-2 ${orientation === "vertical" ? "h-12 py-2" : ""}`}>
              <StepLine 
                progress={index < activeStep ? 1 : 0}
                direction={orientation === "horizontal" ? "horizontal" : "vertical"}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default AnimatedSteps;
