/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { MovieRecommendation } from "../types";
import { Play, Calendar, ExternalLink, Film, Award } from "lucide-react";

interface MovieGridProps {
  movies: MovieRecommendation[];
  isLoading: boolean;
  vibeQuery: string | null;
}

export default function MovieGrid({ movies, isLoading, vibeQuery }: MovieGridProps) {
  // Animation configurations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    },
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2.5 animate-pulse">
          <div className="h-6 w-32 bg-slate-200 dark:bg-white/10 rounded"></div>
          <div className="h-4 w-48 bg-slate-100 dark:bg-white/5 rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((idx) => (
            <div 
              key={idx} 
              className="bg-white dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/10 rounded-[24px] p-6 space-y-5 animate-pulse relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Fake movie reel accents */}
                <div className="flex justify-between pb-4 border-b border-dashed border-slate-200 dark:border-white/10">
                  <div className="w-5 h-5 bg-slate-200 dark:bg-white/10 rounded-full"></div>
                  <div className="w-5 h-5 bg-slate-200 dark:bg-white/10 rounded-full"></div>
                </div>

                {/* Animated poster skeleton placeholder */}
                <div className="relative w-full aspect-[2/3] bg-slate-100 dark:bg-white/5 rounded-2xl mb-4.5 mt-4">
                  <div className="absolute top-3 right-3 w-14 h-5.5 bg-slate-200 dark:bg-white/10 rounded-md"></div>
                </div>

                <div className="space-y-3">
                  <div className="h-6 bg-slate-200 dark:bg-white/10 rounded-lg w-3/4"></div>
                  <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-1/4"></div>
                </div>
                <div className="space-y-2 pt-2">
                  <div className="h-3.5 bg-slate-100 dark:bg-white/5 rounded w-full"></div>
                  <div className="h-3.5 bg-slate-100 dark:bg-white/5 rounded w-5/6"></div>
                </div>
              </div>
              <div className="h-10 bg-slate-200 dark:bg-white/10 rounded-xl w-full mt-4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return null;
  }

  // Accent highlights matching purple, cyan, indigo from the premium theme
  const cardAccents = [
    {
      glow: "hover:border-brand-purple/40",
      yearColor: "text-brand-purple dark:text-[#a78bfa]",
      buttonStyles: "border-slate-200 dark:border-white/15 dark:hover:border-transparent text-slate-700 dark:text-white hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black",
      badgeStyles: "bg-brand-purple/5 text-brand-purple dark:bg-brand-purple/10 border-brand-purple/10",
    },
    {
      glow: "hover:border-brand-cyan/40",
      yearColor: "text-brand-cyan dark:text-[#22d3ee]",
      buttonStyles: "border-slate-200 dark:border-white/15 dark:hover:border-transparent text-slate-700 dark:text-white hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black",
      badgeStyles: "bg-brand-cyan/5 text-brand-cyan dark:bg-brand-cyan/10 border-brand-cyan/10",
    },
    {
      glow: "hover:border-indigo-500/40",
      yearColor: "text-indigo-600 dark:text-[#818cf8]",
      buttonStyles: "border-slate-200 dark:border-white/15 dark:hover:border-transparent text-slate-700 dark:text-white hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black",
      badgeStyles: "bg-indigo-500/5 text-indigo-600 dark:bg-indigo-500/10 border-indigo-500/10",
    }
  ];

  return (
    <div className="space-y-6">
      {vibeQuery && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-white/5 pb-3">
          <div className="flex items-center gap-2.5">
            <Film className="w-4.5 h-4.5 text-brand-purple" />
            <h2 className="text-md font-display font-bold text-slate-800 dark:text-white/90">
              Vibe Recommendations
            </h2>
          </div>
          <p className="text-xs text-slate-400 dark:text-white/40 italic max-w-sm truncate">
            Matches &ldquo;{vibeQuery}&rdquo;
          </p>
        </div>
      )}

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {movies.map((movie, index) => {
          const accent = cardAccents[index % cardAccents.length];
          return (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
              className={`group flex flex-col justify-between bg-white dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/10 rounded-[24px] p-6 hover:bg-slate-50 dark:hover:bg-white/[0.05] shadow-lg shadow-slate-100/10 dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300 relative ${accent.glow}`}
            >
              <div>
                {/* Decorative Ticket Perforation / Movie strip lines */}
                <div className="flex justify-between items-center pb-3 mb-4.5 border-b border-dashed border-slate-200 dark:border-white/10">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-white/10"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-white/10"></span>
                  </div>
                  <span className={`text-[9px] font-mono font-bold tracking-widest px-2 py-0.5 rounded border ${accent.badgeStyles}`}>
                    MATCH 0{index + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-white/10"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-white/10"></span>
                  </div>
                </div>

                {/* Movie Poster Image segment */}
                <div className="relative w-full aspect-[2/3] mb-4.5 overflow-hidden rounded-2xl group/poster border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5 shadow-inner">
                  {movie.imdbRating && (
                    <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-[#F5C518] text-black font-sans font-black text-[10px] px-2 py-0.5 rounded shadow-md tracking-wider">
                      <span className="font-extrabold uppercase text-[8px] mr-0.5">IMDb</span>
                      <span className="text-[9px] text-[#222]">★</span>
                      <span>{movie.imdbRating}</span>
                    </div>
                  )}

                  {movie.posterUrl ? (
                    <>
                      <img 
                        src={movie.posterUrl} 
                        alt={`${movie.title} poster`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-all duration-500 ease-out group-hover/poster:scale-103 group-hover:brightness-105"
                        onError={(e) => {
                          const imgEl = e.currentTarget;
                          imgEl.style.display = 'none';
                          const parent = imgEl.parentElement;
                          if (parent) {
                            const fallback = parent.querySelector('.poster-fallback');
                            if (fallback) {
                              fallback.classList.remove('hidden');
                              fallback.classList.add('flex');
                            }
                          }
                        }}
                      />
                      {/* Fallback image in case of load failure */}
                      <div className="poster-fallback hidden absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-white/3 dark:to-white/5 text-center space-y-2">
                        <Film className="w-8 h-8 text-slate-300 dark:text-white/20 animate-pulse" />
                        <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 dark:text-white/30 uppercase">Poster Unavailable</span>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center space-y-2">
                      <Film className="w-8 h-8 text-slate-300 dark:text-white/20" />
                      <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 dark:text-white/30 uppercase">Artwork Pending</span>
                    </div>
                  )}
                </div>

                {/* Movie Header segment */}
                <div className="space-y-1">
                  <span className="movie-title text-xl font-display font-black text-slate-800 dark:text-white group-hover:text-[#8b5cf6] dark:group-hover:text-brand-cyan transition-colors duration-250 leading-snug">
                    {movie.title}
                  </span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`movie-year text-xs font-mono font-bold ${accent.yearColor}`}>
                      {movie.year}
                    </span>
                  </div>
                </div>

                <p className="movie-reason text-[13px] leading-relaxed text-slate-600 dark:text-white/70 font-sans mt-3">
                  {movie.reason}
                </p>
              </div>

              {/* Action Button - Web trailer redirect query */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5">
                <a
                  href={movie.trailerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`btn-trailer w-full py-2.5 px-4 rounded-xl text-xs font-display font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer border bg-transparent ${accent.buttonStyles}`}
                >
                  <Play className="w-3 h-3 fill-current" />
                  Watch Trailer
                  <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
                </a>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
