"use client";
import {
  useMotionValueEvent,
  useScroll,
  useTransform,
  motion,
} from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import SplitText from "./SplitText";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

interface TimelineProps {
  data: TimelineEntry[];
  hideHeader?: boolean;
  activeIndex?: number;
}

export const Timeline = ({ data, hideHeader = false, activeIndex }: TimelineProps & { activeIndex?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [progressHeight, setProgressHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  // Set up scroll detection
  const { scrollYProgress } = useScroll({
    offset: ["start 0%", "end 100%"],  // Monitor the entire page
  });

  // Additional container-specific scroll detection
  const containerScrollProgress = useScroll({
    target: containerRef,
    offset: ["start 0%", "end 40%"],
  }).scrollYProgress;

  // Listen to scroll changes and update the progressHeight
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Only update if we don't have an explicit activeIndex
    if (activeIndex === undefined) {
      setProgressHeight(height * latest);
    }
  });

  // Also listen to container-specific scroll
  useMotionValueEvent(containerScrollProgress, "change", (latest) => {
    // Only update if we don't have an explicit activeIndex
    if (activeIndex === undefined) {
      setProgressHeight(height * latest);
    }
  });

  // Update based on activeIndex prop if provided
  useEffect(() => {
    if (activeIndex !== undefined && data.length > 0) {
      // Calculate progress based on active index
      const progress = activeIndex / (data.length - 1);
      setProgressHeight(height * progress);
    }
  }, [activeIndex, data.length, height]);

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full bg-white dark:bg-neutral-950 font-sans md:px-10"
      ref={containerRef}
    >
      {!hideHeader && (
        <div className="max-w-7xl mx-auto py-10 px-4 md:px-6 lg:px-8">
          <SplitText
            text="Process Data"
            className="block text-6xl mb-2 text-left font-bold text-white dark:text-white"
            splitType="chars"
          />
          <p className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base max-w-sm mb-0">
            Submit your patient's data to be scanned and analyzed. The entire process takes total time should take &lt;1 minute.
          </p>
        </div>
      )}

      <div ref={ref} className="relative max-w-7xl mx-auto pb-0">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-4 md:pt-12 md:gap-4"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white dark:bg-black flex items-center justify-center">
                <div className={`h-4 w-4 rounded-full ${activeIndex === index ? 'bg-[#1DB954] dark:bg-[#1DB954]' : 'bg-neutral-200 dark:bg-neutral-800'} border border-neutral-300 dark:border-neutral-700 p-2`} />
              </div>
              <h3 className={`hidden md:block text-xl md:pl-20 md:text-5xl font-bold ${activeIndex === index ? 'text-white dark:text-white' : 'text-neutral-500 dark:text-neutral-500'}`}>
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className={`md:hidden block text-2xl mb-4 text-left font-bold ${activeIndex === index ? 'text-white dark:text-white' : 'text-neutral-500 dark:text-neutral-500'}`}>
                {item.title}
              </h3>
              {item.content}{" "}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
        >
          <motion.div
            style={{
              height: progressHeight,
              opacity: progressHeight > 0 ? 1 : 0,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-[#1DB954] via-[#1ED760] to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
