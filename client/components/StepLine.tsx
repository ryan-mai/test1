import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";

interface StepLineProps {
  progress: number; // Value between 0-1
  direction?: "horizontal" | "vertical";
  color?: string;
  width?: string;
  height?: string;
}

const StepLine: React.FC<StepLineProps> = ({
  progress,
  direction = "horizontal",
  color = "var(--primary)",
  width = "100%",
  height = "4px",
}) => {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lineRef.current) return;
    
    const property = direction === "horizontal" ? "scaleX" : "scaleY";
    
    gsap.to(lineRef.current, {
      [property]: progress,
      duration: 0.6,
      ease: "power2.inOut"
    });
  }, [progress, direction]);

  return (
    <div 
      className="relative overflow-hidden" 
      style={{ 
        width: direction === "horizontal" ? width : height,
        height: direction === "horizontal" ? height : width
      }}
    >
      <div 
        className="absolute top-0 left-0 w-full h-full bg-gray-200"
      />
      <div 
        ref={lineRef}
        className="absolute top-0 left-0 w-full h-full origin-left"
        style={{ 
          backgroundColor: color,
          transform: direction === "horizontal" ? "scaleX(0)" : "scaleY(0)",
          transformOrigin: direction === "horizontal" ? "left center" : "center top"
        }}
      />
    </div>
  );
};

export default StepLine;
