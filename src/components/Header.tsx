/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Sun, Moon, Sparkles } from "lucide-react";
import VibeCheckLogo from "./VibeCheckLogo";

interface HeaderProps {
  darkMode: boolean;
  onToggleTheme: () => void;
}

export default function Header({ darkMode, onToggleTheme }: HeaderProps) {
  return (
    <header className="border-b transition-all duration-300 md:py-5 py-4 border-slate-200/60 dark:border-white/10 bg-white/70 dark:bg-[#050507]/40 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ rotate: -15, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex items-center justify-center"
          >
            <VibeCheckLogo className="w-12 h-12" />
          </motion.div>
          <div>
            <h1 className="md:text-xl text-md font-display font-black tracking-tight flex items-center gap-2">
              <span className="bg-gradient-to-r from-brand-purple to-brand-cyan bg-clip-text text-transparent">
                VibeCheck
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-sans bg-slate-100 dark:bg-white/5 font-semibold text-brand-purple dark:text-[#a78bfa] border border-indigo-100/40 dark:border-white/5 transition-colors">
                by Chirag
              </span>
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-white/40 font-sans hidden sm:block mt-0.5">
              Find movies based on your weirdest, most obscure moods
            </p>
          </div>
        </div>

        {/* Action Widgets */}
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={onToggleTheme}
            className="p-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 text-slate-650 dark:text-white/70 hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-purple"
            aria-label="Toggle visual theme mode"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            id="theme-switcher-btn"
          >
            {darkMode ? (
              <Sun className="w-4.5 h-4.5 text-amber-400" />
            ) : (
              <Moon className="w-4.5 h-4.5 text-slate-750" />
            )}
          </motion.button>
        </div>
      </div>
    </header>
  );
}
