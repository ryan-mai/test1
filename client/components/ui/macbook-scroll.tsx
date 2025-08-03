"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { MotionValue, motion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";
import {
  IconBrightnessDown,
  IconBrightnessUp,
  IconCaretRightFilled,
  IconCaretUpFilled,
  IconChevronUp,
  IconMicrophone,
  IconMoon,
  IconPlayerSkipForward,
  IconPlayerTrackNext,
  IconPlayerTrackPrev,
  IconTable,
  IconVolume,
  IconVolume2,
  IconVolume3,
} from "@tabler/icons-react";
import { IconSearch } from "@tabler/icons-react";
import { IconWorld } from "@tabler/icons-react";
import { IconCommand } from "@tabler/icons-react";
import { IconCaretLeftFilled } from "@tabler/icons-react";
import { IconCaretDownFilled } from "@tabler/icons-react";


export const MacbookScroll = ({
  src,
  showGradient,
  title,
  badge,
}: {
  src?: string;
  showGradient?: boolean;
  title?: string | React.ReactNode;
  badge?: React.ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (window && window.innerWidth < 768) {
      setIsMobile(true);
    }
  }, []);

  const scaleX = useTransform(
    scrollYProgress,
    [0, 0.3],
    [1.2, isMobile ? 1 : 1.5],
  );
  const scaleY = useTransform(
    scrollYProgress,
    [0, 0.3],
    [0.6, isMobile ? 1 : 1.5],
  );
  const translate = useTransform(scrollYProgress, [0, 1], [0, 1500]);
  const rotate = useTransform(scrollYProgress, [0.1, 0.12, 0.3], [-28, -28, 0]);
  const textTransform = useTransform(scrollYProgress, [0, 0.3], [0, 100]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div
      ref={ref}
      className="flex min-h-[200vh] shrink-0 scale-[0.35] transform flex-col items-center justify-start py-0 [perspective:800px] sm:scale-50 md:scale-100 md:py-80"
    >
      <motion.h2
        style={{
          translateY: textTransform,
          opacity: textOpacity,
        }}
        className="mb-20 text-center text-3xl font-bold text-neutral-800 dark:text-white"
      >
        {title || (
          <span>
            This Macbook is built with Tailwindcss. <br /> No kidding.
          </span>
        )}
      </motion.h2>
      {/* Lid */}
      <Lid
        src={src}
        scaleX={scaleX}
        scaleY={scaleY}
        rotate={rotate}
        translate={translate}
      />
      {/* Base area */}
      <div className="relative -z-10 h-[22rem] w-[32rem] overflow-hidden rounded-2xl bg-gray-200 dark:bg-[#272729]">
        {/* above keyboard bar */}
        <div className="relative h-10 w-full">
          <div className="absolute inset-x-0 mx-auto h-4 w-[80%] bg-[#050505]" />
        </div>
        <div className="relative flex">
          <div className="mx-auto h-full w-[10%] overflow-hidden">
            <SpeakerGrid />
          </div>
          <div className="mx-auto h-full w-[80%]">
            <Keypad />
          </div>
          <div className="mx-auto h-full w-[10%] overflow-hidden">
            <SpeakerGrid />
          </div>
        </div>
        <Trackpad />
        <div className="absolute inset-x-0 bottom-0 mx-auto h-2 w-20 rounded-tl-3xl rounded-tr-3xl bg-gradient-to-t from-[#272729] to-[#050505]" />
        {showGradient && (
          <div className="absolute inset-x-0 bottom-0 z-50 h-40 w-full bg-gradient-to-t from-white via-white to-transparent dark:from-black dark:via-black"></div>
        )}
        {badge && <div className="absolute bottom-4 left-4">{badge}</div>}
      </div>
    </div>
  );
};

export const Lid = ({
  scaleX,
  scaleY,
  rotate,
  translate,
  src,
}: {
  scaleX: MotionValue<number>;
  scaleY: MotionValue<number>;
  rotate: MotionValue<number>;
  translate: MotionValue<number>;
  src?: string;
}) => {
  return (
    <div className="relative [perspective:800px]">
      <div
        style={{
          transform: "perspective(800px) rotateX(-25deg) translateZ(0px)",
          transformOrigin: "bottom",
          transformStyle: "preserve-3d",
        }}
        className="relative h-[12rem] w-[32rem] rounded-2xl bg-[#010101] p-2"
      >
        <div
          style={{
            boxShadow: "0px 2px 0px 2px #171717 inset",
          }}
          className="absolute inset-0 flex items-center justify-center rounded-lg bg-[#010101]"
        >
          <span className="text-white">
            <AceternityLogo />
          </span>
        </div>
      </div>
      <motion.div
        style={{
          scaleX: scaleX,
          scaleY: scaleY,
          rotateX: rotate,
          translateY: translate,
          transformStyle: "preserve-3d",
          transformOrigin: "top",
        }}
        className="absolute inset-0 h-96 w-[32rem] rounded-2xl bg-[#010101] p-2"
      >
        <div className="absolute inset-0 rounded-lg bg-[#272729]" />
        <img
          src={src as string}
          alt="aceternity logo"
          className="absolute inset-0 h-full w-full rounded-lg object-cover object-left-top"
        />
      </motion.div>
    </div>
  );
};

export const Trackpad = () => {
  return (
    <div
      className="mx-auto my-1 h-32 w-[40%] rounded-xl"
      style={{
        boxShadow: "0px 0px 1px 1px #00000020 inset",
      }}
    ></div>
  );
};

export const Keypad = () => {
  return (
    <div className="mx-1 h-full [transform:translateZ(0)] rounded-md bg-[#050505] p-1 [will-change:transform]">
      {/* First Row */}
      <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
        <KBtn
          className="w-10 items-end justify-start pb-[2px] pl-[4px]"
          childrenClassName="items-start"
        >
          esc
        </KBtn>
        <KBtn>
          <IconBrightnessDown className="h-[6px] w-[6px]" />
          <span className="mt-1 text-[6px]">F1</span>
        </KBtn>
        <KBtn>
          <IconBrightnessUp className="h-[6px] w-[6px]" />
          <span className="mt-1 text-[6px]">F2</span>
        </KBtn>
        <KBtn>
          <IconTable className="h-[6px] w-[6px]" />
          <span className="mt-1 text-[6px]">F3</span>
        </KBtn>
        <KBtn>
          <IconSearch className="h-[6px] w-[6px]" />
          <span className="mt-1 text-[6px]">F4</span>
        </KBtn>
        <KBtn>
          <IconMicrophone className="h-[6px] w-[6px]" />
          <span className="mt-1 text-[6px]">F5</span>
        </KBtn>
        <KBtn>
          <IconMoon className="h-[6px] w-[6px]" />
          <span className="mt-1 text-[6px]">F6</span>
        </KBtn>
        <KBtn>
          <IconPlayerTrackPrev className="h-[6px] w-[6px]" />
          <span className="mt-1 text-[6px]">F7</span>
        </KBtn>
        <KBtn>
          <IconPlayerSkipForward className="h-[6px] w-[6px]" />
          <span className="mt-1 text-[6px]">F8</span>
        </KBtn>
        <KBtn>
          <IconPlayerTrackNext className="h-[6px] w-[6px]" />
          <span className="mt-1 text-[6px]">F9</span>
        </KBtn>
        <KBtn>
          <IconVolume3 className="h-[6px] w-[6px]" />
          <span className="mt-1 text-[6px]">F10</span>
        </KBtn>
        <KBtn>
          <IconVolume2 className="h-[6px] w-[6px]" />
          <span className="mt-1 text-[6px]">F11</span>
        </KBtn>
        <KBtn>
          <IconVolume className="h-[6px] w-[6px]" />
          <span className="mt-1 text-[6px]">F12</span>
        </KBtn>
        <KBtn>
          <div className="h-[6px] w-[6px] rounded-full bg-slate-400" />
          <span className="mt-1 text-[6px]">pwr</span>
        </KBtn>
      </div>
      {/* Second row */}
      <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
        <KBtn>~</KBtn>
        <KBtn>1</KBtn>
        <KBtn>2</KBtn>
        <KBtn>3</KBtn>
        <KBtn>4</KBtn>
        <KBtn>5</KBtn>
        <KBtn>6</KBtn>
        <KBtn>7</KBtn>
        <KBtn>8</KBtn>
        <KBtn>9</KBtn>
        <KBtn>0</KBtn>
        <KBtn>-</KBtn>
        <KBtn>+</KBtn>
        <KBtn
          className="w-10 items-end justify-end pb-[2px] pr-[4px]"
          childrenClassName="items-end"
        >
          delete
        </KBtn>
      </div>
      {/* Third row */}
      <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
        <KBtn
          className="w-10 items-end justify-start pb-[2px] pl-[4px]"
          childrenClassName="items-start"
        >
          tab
        </KBtn>
        <KBtn>Q</KBtn>
        <KBtn>W</KBtn>
        <KBtn>E</KBtn>
        <KBtn>R</KBtn>
        <KBtn>T</KBtn>
        <KBtn>Y</KBtn>
        <KBtn>U</KBtn>
        <KBtn>I</KBtn>
        <KBtn>O</KBtn>
        <KBtn>P</KBtn>
        <KBtn>[</KBtn>
        <KBtn>]</KBtn>
        <KBtn>\</KBtn>
      </div>
      {/* Fourth row */}
      <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
        <KBtn
          className="w-[45px] items-end justify-start pb-[2px] pl-[4px]"
          childrenClassName="items-start"
        >
          caps lock
        </KBtn>
        <KBtn>A</KBtn>
        <KBtn>S</KBtn>
        <KBtn>D</KBtn>
        <KBtn>F</KBtn>
        <KBtn>G</KBtn>
        <KBtn>H</KBtn>
        <KBtn>J</KBtn>
        <KBtn>K</KBtn>
        <KBtn>L</KBtn>
        <KBtn>;</KBtn>
        <KBtn>'</KBtn>
        <KBtn
          className="w-[45px] items-end justify-end pb-[2px] pr-[4px]"
          childrenClassName="items-end"
        >
          return
        </KBtn>
      </div>
      {/* Fifth row */}
      <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
        <KBtn
          className="w-[57px] items-end justify-start pb-[2px] pl-[4px]"
          childrenClassName="items-start"
        >
          shift
        </KBtn>
        <KBtn>Z</KBtn>
        <KBtn>X</KBtn>
        <KBtn>C</KBtn>
        <KBtn>V</KBtn>
        <KBtn>B</KBtn>
        <KBtn>N</KBtn>
        <KBtn>M</KBtn>
        <KBtn>,</KBtn>
        <KBtn>.</KBtn>
        <KBtn>/</KBtn>
        <KBtn
          className="w-[57px] items-end justify-end pb-[2px] pr-[4px]"
          childrenClassName="items-end"
        >
          shift
        </KBtn>
      </div>
      {/* sixth row */}
      <div className="flex w-full shrink-0 gap-[2px]">
        <KBtn
          className="w-11 items-end justify-start pb-[2px] pl-[4px]"
          childrenClassName="items-start"
        >
          fn
        </KBtn>
        <KBtn
          className="w-11 items-end justify-start pb-[2px] pl-[4px]"
          childrenClassName="items-start"
        >
          control
        </KBtn>
        <KBtn
          className="w-11 items-end justify-start pb-[2px] pl-[4px]"
          childrenClassName="items-start"
        >
          option
        </KBtn>
        <KBtn
          className="w-11 items-end justify-start pb-[2px] pl-[4px]"
          childrenClassName="items-start"
        >
          <IconCommand className="h-[6px] w-[6px]" />
        </KBtn>
        <KBtn className="w-[88px]"> </KBtn>
        <KBtn
          className="w-11 items-end justify-start pb-[2px] pl-[4px]"
          childrenClassName="items-start"
        >
          <IconCommand className="h-[6px] w-[6px]" />
        </KBtn>
        <KBtn
          className="w-11 items-end justify-start pb-[2px] pl-[4px]"
          childrenClassName="items-start"
        >
          option
        </KBtn>

        <div className="my-[1px] flex w-[69px] flex-col gap-[2px]">
          <div className="flex gap-[2px]">
            <KBtn className="">
              <IconCaretLeftFilled className="h-[6px] w-[6px]" />
            </KBtn>
            <div className="flex flex-col gap-[2px]">
              <KBtn className="h-[23px]">
                <IconCaretUpFilled className="h-[6px] w-[6px]" />
              </KBtn>
              <KBtn className="h-[23px]">
                <IconCaretDownFilled className="h-[6px] w-[6px]" />
              </KBtn>
            </div>
            <KBtn className="">
              <IconCaretRightFilled className="h-[6px] w-[6px]" />
            </KBtn>
          </div>
        </div>
      </div>
    </div>
  );
};

export const KBtn = ({
  className,
  children,
  childrenClassName,
}: {
  className?: string;
  children?: React.ReactNode;
  childrenClassName?: string;
}) => {
  return (
    <div
      className={cn(
        "h-[48px] w-[32px] rounded-[4px] bg-[#0A090D] p-[0.5px] text-white",
        className,
      )}
    >
      <div
        className={cn(
          "flex h-full w-full flex-col items-center justify-center rounded-[3.5px] bg-[#0A090D] px-1 py-2 text-[8px]",
          childrenClassName,
        )}
        style={{
          boxShadow:
            "0px -0.5px 2px 0 #0D0D0F inset, -0.5px 0px 2px 0 #0D0D0F inset",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const SpeakerGrid = () => {
  return (
    <div className="flex h-32 w-full flex-col items-center justify-center">
      <div className="mt-8 grid grid-cols-3 gap-[2px]">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={`speaker-${i}`}
            className="h-[2px] w-[2px] rounded-full bg-neutral-600"
          />
        ))}
      </div>
    </div>
  );
};

export const OptionKey = ({ className }: { className: string }) => {
  return (
    <svg
      fill="none"
      version="1.1"
      id="icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      className={className}
    >
      <rect
        stroke="currentColor"
        strokeWidth={2}
        x="18"
        y="5"
        width="10"
        height="2"
      />
      <polygon
        stroke="currentColor"
        strokeWidth={2}
        points="10.6,5 4,5 4,7 9.4,7 18.4,27 28,27 28,25 19.6,25 "
      />
      <rect
        id="_Transparent_Rectangle_"
        className="st0"
        width="32"
        height="32"
        stroke="none"
      />
    </svg>
  );
};

const AceternityLogo = () => {
  return (
    <svg
      width="66"
      height="65"
      viewBox="0 0 66 65"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-3 w-3 text-white"
    >
      <path
        d="M8 8.05571C8 8.05571 54.9009 18.1782 57.8687 30.062C60.8365 41.9458 9.05432 57.4696 9.05432 57.4696"
        stroke="currentColor"
        strokeWidth="15"
        strokeMiterlimit="3.86874"
        strokeLinecap="round"
      />
    </svg>
  );
};
