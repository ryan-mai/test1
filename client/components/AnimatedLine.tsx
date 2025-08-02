import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";

interface AnimatedLineProps {
  progress: number; // 0 to 1
  color?: string;
  height?: string;
  thickness?: string;
}

const AnimatedLine: React.FC<AnimatedLineProps> = ({
  progress,
  color = "#3b82f6",
  height = "200px",
  thickness = "2px",
}) => {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lineRef.current) return;
    
    gsap.to(lineRef.current, {
      scaleY: progress,
      duration: 0.8,
      ease: "power2.inOut",
    });
    
  }, [progress]);

  return (
    <div 
      className="relative" 
      style={{ height }}
    >
      <div 
        className="absolute top-0 left-0 w-full h-full bg-gray-200"
        style={{ width: thickness }}
      />
      <div 
        ref={lineRef}
        className="absolute top-0 left-0 w-full h-full origin-top"
        style={{ 
          width: thickness, 
          backgroundColor: color,
          transform: "scaleY(0)"
        }}
      />
    </div>
  );
};

export default AnimatedLine;
