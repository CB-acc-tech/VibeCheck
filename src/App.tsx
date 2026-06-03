/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Header from "./components/Header";
import VibeInput from "./components/VibeInput";
import MovieGrid from "./components/MovieGrid";
import HistoryList from "./components/HistoryList";
import { MovieRecommendation, VibeHistoryItem } from "./types";
import { Sparkles, Film, AlertCircle, HelpCircle, Compass, Smile, Flame } from "lucide-react";

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Default to dark mode if not set to fit the highly stylized cinematic vibe
    const saved = localStorage.getItem("vibecheck-theme");
    return saved ? saved === "dark" : true;
  });

  const [movies, setMovies] = useState<MovieRecommendation[]>([]);
  const [activeVibeQuery, setActiveVibeQuery] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<VibeHistoryItem[]>([]);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);

  // Sync theme with DOM and localStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("vibecheck-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("vibecheck-theme", "light");
    }
  }, [darkMode]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem("vibecheck-history");
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error("Error reading history from localStorage:", e);
    }
  }, []);

  // Save history helper
  const saveHistory = (newHistory: VibeHistoryItem[]) => {
    setHistory(newHistory);
    localStorage.setItem("vibecheck-history", JSON.stringify(newHistory));
  };

  const handleVibeSubmit = async (vibeText: string, cinemaType: "all" | "hollywood" | "indian") => {
    setIsLoading(true);
    setError(null);
    setMovies([]);
    setActiveVibeQuery(null);
    setActiveHistoryId(null);

    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vibe: vibeText, cinemaType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong. Let's try again!");
      }

      const recommendations: MovieRecommendation[] = data.recommendations;
      setMovies(recommendations);
      setActiveVibeQuery(vibeText);

      // Create new history item
      const newItem: VibeHistoryItem = {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
        vibe: vibeText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ", " + new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
        movies: recommendations,
      };

      const updatedHistory = [newItem, ...history].slice(0, 20); // Hold max 20 items
      saveHistory(updatedHistory);
      setActiveHistoryId(newItem.id);
    } catch (err: any) {
      setError(err.message || "Failed to contact movie recommendation server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistoryItem = (item: VibeHistoryItem) => {
    setMovies(item.movies);
    setActiveVibeQuery(item.vibe);
    setActiveHistoryId(item.id);
    setError(null);
  };

  const handleClearHistoryItem = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    saveHistory(updated);
    if (activeHistoryId === id) {
      setMovies([]);
      setActiveVibeQuery(null);
      setActiveHistoryId(null);
    }
  };

  const handleClearAllHistory = () => {
    saveHistory([]);
    setMovies([]);
    setActiveVibeQuery(null);
    setActiveHistoryId(null);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans relative overflow-x-hidden ${darkMode ? "bg-[#050507] bg-grid-pattern-dark text-slate-100" : "bg-slate-50 bg-grid-pattern text-slate-800"}`}>
      {/* Immersive radial glow halos */}
      <div className="glow-bg" />
      <div className="glow-bg-cyan opacity-40 dark:opacity-100" />

      <Header darkMode={darkMode} onToggleTheme={() => setDarkMode(!darkMode)} />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8 relative z-10">
        
        {/* Main interactive grid dividing layout on wide screens */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel / Input Area */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-2 text-left"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-purple/10 text-brand-purple border border-brand-purple/20 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase">
                <Sparkles className="w-3 h-3 text-brand-purple" />
                AI-Powered Curation
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight leading-tight text-slate-800 dark:text-white">
                Find Your Cinematic Vibe
              </h2>
              <p className="text-sm text-slate-500 dark:text-white/50 font-sans max-w-xl">
                Bored of simple genres? Tell VibeCheck what obscure scenario or hyper-specific emotional climate you're feeling, and let our AI curate perfect movie recommendations.
              </p>
            </motion.div>

            <VibeInput onSubmit={handleVibeSubmit} isLoading={isLoading} />

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-rose-50 border border-rose-100 dark:bg-[#050507] dark:border-rose-900/50 rounded-2xl flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-rose-850 dark:text-rose-450 font-display">
                    AI Query Failed
                  </h4>
                  <p className="text-xs text-rose-600 dark:text-rose-355 mt-1 leading-relaxed">
                    {error}
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right panel / Search and session history sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <HistoryList
              history={history}
              onSelect={handleSelectHistoryItem}
              onClearItem={handleClearHistoryItem}
              onClearAll={handleClearAllHistory}
              activeId={activeHistoryId}
            />

            {/* Explainer card promoting Vibe check usage parameters */}
            <div className="bg-white/40 dark:bg-white/[0.02] border border-slate-200/65 dark:border-white/5 rounded-[24px] p-6 space-y-3.5 shadow-sm">
              <h3 className="text-sm font-display font-bold text-slate-700 dark:text-white/85 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-brand-purple" />
                How to write a great vibe:
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-500 dark:text-white/45">
                <li className="flex items-start gap-2.5">
                  <span className="p-1 rounded bg-brand-purple/10 text-brand-purple font-mono text-[10px] font-bold">1</span>
                  <span>Combine conflicting aesthetics (e.g., modern dark magic but visually sunny and cheerful).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="p-1 rounded bg-brand-purple/10 text-brand-purple font-mono text-[10px] font-bold">2</span>
                  <span>Describe the protagonist's precise mental state (e.g., highly skilled but completely unbothered).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="p-1 rounded bg-brand-purple/10 text-brand-purple font-mono text-[10px] font-bold">3</span>
                  <span>Include sound design elements (e.g., soft lo-fi background rain sound effects).</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Dynamic content grid / Hero state segment */}
        <div className="pt-4 border-t border-slate-100 dark:border-white/5">
          <AnimatePresence mode="wait">
            {movies.length > 0 || isLoading ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <MovieGrid movies={movies} isLoading={isLoading} vibeQuery={activeVibeQuery} />
              </motion.div>
            ) : (
              <motion.div
                key="welcome-panel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 px-6 bg-white dark:bg-white/[0.02] rounded-[24px] border border-dashed border-slate-200 dark:border-white/10 text-center space-y-5"
              >
                <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-purple/10 to-brand-cyan/10 text-brand-purple flex items-center justify-center border border-brand-purple/20">
                  <Compass className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <h3 className="font-display font-bold text-md text-slate-800 dark:text-white/90">
                    Awaiting your transmission...
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-white/40 leading-relaxed font-sans">
                    Use our interactive text box above to generate your ideal vibe, or click one of the pre-configured shortcuts to sample what VibeCheck's AI recommender can do!
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="max-w-6xl mx-auto px-4 py-8 border-t border-slate-100 dark:border-white/5 text-center space-y-2 relative z-10">
        <p className="text-xs text-slate-400 dark:text-white/30 font-mono">
          VibeCheck &bull; Crafting obscure movie pairings with Gemini AI
        </p>
        <p className="text-[10px] text-slate-300 dark:text-white/20 font-sans">
          All images are sample simulations. Dynamic trailer search results are retrieved via public domain routing on YouTube on request.
        </p>
      </footer>
    </div>
  );
}
