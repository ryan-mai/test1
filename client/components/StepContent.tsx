import React, { useRef, useEffect, useState, ReactNode } from "react";
import { gsap } from "gsap";

interface StepContentProps {
  children: ReactNode;
  isActive: boolean;
  index: number;
  activeIndex: number;
}

const StepContent: React.FC<StepContentProps> = ({
  children,
  isActive,
  index,
  activeIndex,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(isActive);

  useEffect(() => {
    if (!contentRef.current) return;

    const el = contentRef.current;
    
    if (isActive) {
      // Animate in
      setIsVisible(true);
      gsap.fromTo(
        el,
        { 
          y: index > activeIndex ? 50 : -50, 
          opacity: 0,
        },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.6, 
          ease: "power2.out",
          onComplete: () => {
            gsap.set(el, { clearProps: "all" });
          }
        }
      );
    } else {
      // Animate out
      gsap.to(el, {
        y: index < activeIndex ? -100 : 100,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
          setIsVisible(false);
        }
      });
    }
  }, [isActive, index, activeIndex]);

  if (!isVisible && !isActive) return null;

  return (
    <div
      ref={contentRef}
      className={`transition-all duration-300 ${isActive ? 'block' : 'absolute top-0 left-0 w-full'}`}
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      {children}
    </div>
  );
};

export default StepContent;
