/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, MessageSquareCode, Shuffle } from "lucide-react";

interface VibeInputProps {
  onSubmit: (vibe: string, cinemaType: "all" | "hollywood" | "indian") => void;
  isLoading: boolean;
  initialValue?: string;
}

const QUIRKY_VIBE_SUGGESTIONS = [
  "Cozy sci-fi where nobody dies and robots make delicious matcha in giant spacesuits",
  "Cyberpunk detective who is too tired to fight and just wants a hot bowl of ramen",
  "Victorian ghosts having a quiet friendly board game night in a dusty comforting attic",
  "Nostalgic summery road trip through coastal towns with a dreamy indie folk soundtrack",
  "High-stakes royal political intrigue but with an absurdly wholesome and optimistic protagonist",
  "Deep forest magic with ancient warm creatures who speak in gentle poetic whispers"
];

export default function VibeInput({ onSubmit, isLoading, initialValue = "" }: VibeInputProps) {
  const [vibeText, setVibeText] = useState(initialValue);
  const [cinemaType, setCinemaType] = useState<"all" | "hollywood" | "indian">("all");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vibeText.trim() || isLoading) return;
    onSubmit(vibeText, cinemaType);
  };

  const selectRandomSuggestion = () => {
    const randomIndex = Math.floor(Math.random() * QUIRKY_VIBE_SUGGESTIONS.length);
    setVibeText(QUIRKY_VIBE_SUGGESTIONS[randomIndex]);
  };

  return (
    <div className="bg-white dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/10 rounded-[24px] p-6 sm:p-8 shadow-xl shadow-slate-200/10 dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2.5">
          <label 
            htmlFor="vibe-text-input" 
            className="block text-sm font-display font-bold text-slate-700 dark:text-white/80 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-brand-purple animate-pulse" />
            Describe your highly specific, weirdest movie vibe...
          </label>
          <div className="relative">
            <textarea
              id="vibe-text-input"
              rows={3}
              value={vibeText}
              onChange={(e) => setVibeText(e.target.value)}
              placeholder="e.g., Cozy sci-fi where nobody dies and robots make delicious matcha..."
              className="w-full text-base px-4 py-3 bg-slate-50/50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all placeholder:text-slate-400 dark:placeholder:text-white/30 resize-none font-sans"
              maxLength={400}
              disabled={isLoading}
            />
            <div className="absolute bottom-2.5 right-3 text-[10px] text-slate-400 dark:text-white/30 font-mono">
              {vibeText.length}/400
            </div>
          </div>
        </div>

        {/* Cinema Switcher Segment */}
        <div className="space-y-2.5">
          <label className="block text-xs font-display font-extrabold tracking-wider text-slate-400 dark:text-white/40 uppercase">
            Cinema Focus Region
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-50 dark:bg-white/3 border border-slate-200/50 dark:border-white/5 rounded-2xl">
            <button
              type="button"
              onClick={() => setCinemaType("all")}
              disabled={isLoading}
              className={`py-2 px-3 rounded-xl text-xs font-display font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 select-none ${
                cinemaType === "all"
                  ? "bg-white dark:bg-white/10 text-brand-purple dark:text-brand-cyan shadow-sm border border-slate-200/20 dark:border-white/5"
                  : "text-slate-500 dark:text-white/60 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-white/3 border border-transparent"
              }`}
            >
              <span>🌎</span>
              <span>All Movies</span>
            </button>
            <button
              type="button"
              onClick={() => setCinemaType("hollywood")}
              disabled={isLoading}
              className={`py-2 px-3 rounded-xl text-xs font-display font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 select-none ${
                cinemaType === "hollywood"
                  ? "bg-white dark:bg-white/10 text-brand-purple dark:text-brand-cyan shadow-sm border border-slate-200/20 dark:border-white/5"
                  : "text-slate-500 dark:text-white/60 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-white/3 border border-transparent"
              }`}
            >
              <span>🗽</span>
              <span>Hollywood</span>
            </button>
            <button
              type="button"
              onClick={() => setCinemaType("indian")}
              disabled={isLoading}
              className={`py-2 px-3 rounded-xl text-xs font-display font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 select-none ${
                cinemaType === "indian"
                  ? "bg-white dark:bg-white/10 text-brand-purple dark:text-brand-cyan shadow-sm border border-slate-200/20 dark:border-white/5"
                  : "text-slate-500 dark:text-white/60 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-white/3 border border-transparent"
              }`}
            >
              <span>🇮🇳</span>
              <span>Indian</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={selectRandomSuggestion}
              disabled={isLoading}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-white/80 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 border border-transparent dark:border-white/5"
              id="randomize-prompt-btn"
            >
              <Shuffle className="w-3.5 h-3.5 text-brand-purple" />
              Surprise Me
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading || !vibeText.trim()}
            className="px-7 py-3 bg-gradient-to-r from-brand-purple to-indigo-600 text-white rounded-xl font-display font-semibold shadow-lg shadow-brand-purple/20 hover:opacity-95 transition-all text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            id="find-vibe-btn"
          >
            <Sparkles className="w-4 h-4" />
            {isLoading ? "Querying AI..." : "Find My Vibe"}
          </motion.button>
        </div>
      </form>

      {/* Suggested shortcuts */}
      <div className="mt-6 pt-5 border-t border-slate-100 dark:border-white/5">
        <span className="text-xs font-display font-bold text-slate-400 dark:text-white/45 block mb-3">
          Try clicking these sample vibes:
        </span>
        <div className="flex flex-wrap gap-2">
          {QUIRKY_VIBE_SUGGESTIONS.slice(0, 4).map((suggestion, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setVibeText(suggestion)}
              disabled={isLoading}
              className="text-[11px] text-slate-500 dark:text-white/60 hover:text-brand-purple dark:hover:text-brand-cyan bg-slate-50 hover:bg-indigo-50/50 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200/60 dark:border-white/5 hover:border-indigo-100 dark:hover:border-white/10 rounded-full py-1.5 px-3 transition-all text-left font-sans cursor-pointer disabled:opacity-40"
            >
              {suggestion.substring(0, 52)}...
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
