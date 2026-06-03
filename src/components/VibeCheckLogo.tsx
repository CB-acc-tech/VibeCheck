/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface VibeCheckLogoProps {
  className?: string;
  size?: number;
}

export default function VibeCheckLogo({ className = "w-10 h-10", size }: VibeCheckLogoProps) {
  // Use custom dimensions if size prop is passed, otherwise respect parent class styling
  const style = size ? { width: size, height: size } : undefined;

  return (
    <svg
      viewBox="0 0 220 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <defs>
        {/* Dynamic Fluent Gradient matching the uploaded logo */}
        <linearGradient id="logo-ribbon-gradient" x1="0%" y1="80%" x2="100%" y2="20%">
          <stop offset="0%" stopColor="#FFA629" />
          <stop offset="35%" stopColor="#FB6542" />
          <stop offset="70%" stopColor="#8F43EE" />
          <stop offset="100%" stopColor="#4D4DFF" />
        </linearGradient>

        {/* Shadow effect for depth */}
        <filter id="logo-depth-shadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="1" dy="3" stdDeviation="2" floodColor="#000000" floodOpacity="0.18" />
        </filter>

        {/* Gradient for film reel underpass */}
        <linearGradient id="film-reel-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
      </defs>

      {/* Group holding the elements */}
      <g>
        {/* 1. MOVIE FILM WHEEL/REEL BACKGROUND */}
        {/* Outer Circular Rim */}
        <circle
          cx="135"
          cy="60"
          r="40"
          className="stroke-slate-200 dark:stroke-white/10"
          strokeWidth="3.5"
          strokeDasharray="none"
          fill="none"
        />
        {/* Inner Film Circle */}
        <circle
          cx="135"
          cy="60"
          r="38"
          className="stroke-indigo-600/40 dark:stroke-violet-400/20"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Film Reel cut-out holes */}
        <circle cx="135" cy="38" r="8" className="fill-slate-100 dark:fill-[#121216]/60" />
        <circle cx="115" cy="56" r="8" className="fill-slate-100 dark:fill-[#121216]/60" />
        <circle cx="155" cy="56" r="8" className="fill-slate-100 dark:fill-[#121216]/60" />
        <circle cx="125" cy="74" r="8" className="fill-slate-100 dark:fill-[#121216]/60" />
        <circle cx="145" cy="74" r="8" className="fill-slate-100 dark:fill-[#121216]/60" />

        {/* Core center with tiny star */}
        <circle cx="135" cy="60" r="11" className="fill-indigo-600/10 dark:fill-violet-400/10 stroke-indigo-500/30 dark:stroke-violet-400/30" strokeWidth="1.5" />
        <path
          d="M135 55.5 L136.2 58.5 L139.5 58.5 L136.8 60.3 L137.8 63.3 L135 61.5 L132.2 63.3 L133.2 60.3 L130.5 58.5 L133.8 58.5 Z"
          className="fill-indigo-500 dark:fill-violet-300"
        />

        {/* 2. DYNAMIC GRADIENT FLUID RIBBON (V-WAVE) AND THE ARROW */}
        {/* Path representing the flowing film ribbon ribbon */}
        <path
          d="M 22 56 
             C 32 56, 32 72, 42 72
             C 52 72, 54 54, 66 54
             C 80 54, 82 100, 102 100
             C 126 100, 134 76, 150 61
             L 194 28"
          fill="none"
          stroke="url(#logo-ribbon-gradient)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#logo-depth-shadow)"
        />

        {/* Secondary path overlap line to emphasize the ribbon folds (3D overlap styling) */}
        <path
          d="M 22 56 
             C 32 56, 32 72, 42 72
             C 52 72, 54 54, 66 54"
          fill="none"
          stroke="url(#logo-ribbon-gradient)"
          strokeWidth="11"
          strokeLinecap="round"
          className="opacity-90"
        />

        {/* Left Side Decorative Tail Accent */}
        <path
          d="M 22 62 C 28 62, 34 52, 40 52"
          fill="none"
          stroke="url(#logo-ribbon-gradient)"
          strokeWidth="3.5"
          strokeLinecap="round"
          className="opacity-75"
        />

        {/* 3. SHARP UPWARD DIAGONAL ARROWHEAD */}
        {/* We place a beautiful arrow head at the end of the ribbon pointing up-right */}
        <path
          d="M 183 17 
             L 204 22 
             L 194 43 
             L 189 31 
             Y Z"
          fill="url(#logo-ribbon-gradient)"
          stroke="url(#logo-ribbon-gradient)"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* 4. FILM SPROCKET HOLES (Square punch paths on the rising arrow) */}
        {/* Sprockets aligned along the straight part of the arrow from (150, 61) to (194, 28) */}
        <g transform="rotate(-37 172 44)" className="fill-white dark:fill-[#050507]">
          <rect x="145" y="42.5" width="2.5" height="3.5" rx="0.5" />
          <rect x="151.5" y="42.5" width="2.5" height="3.5" rx="0.5" />
          <rect x="158" y="42.5" width="2.5" height="3.5" rx="0.5" />
          <rect x="164.5" y="42.5" width="2.5" height="3.5" rx="0.5" />
          <rect x="171" y="42.5" width="2.5" height="3.5" rx="0.5" />
          <rect x="177.5" y="42.5" width="2.5" height="3.5" rx="0.5" />
          <rect x="184" y="42.5" width="2.5" height="3.5" rx="0.5" />
        </g>
      </g>
    </svg>
  );
}
