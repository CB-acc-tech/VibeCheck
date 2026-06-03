/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { VibeHistoryItem } from "../types";
import { History, Trash2, ArrowUpRight, Film } from "lucide-react";

interface HistoryListProps {
  history: VibeHistoryItem[];
  onSelect: (item: VibeHistoryItem) => void;
  onClearItem: (id: string) => void;
  onClearAll: () => void;
  activeId: string | null;
}

export default function HistoryList({ history, onSelect, onClearItem, onClearAll, activeId }: HistoryListProps) {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/10 rounded-[24px] p-6 shadow-md shadow-slate-100/10 dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-700 dark:text-white/80">
          <History className="w-4 h-4 text-brand-purple" />
          <h3 className="text-sm font-display font-bold">Your Recent Vibe Checks</h3>
        </div>
        <button
          type="button"
          onClick={onClearAll}
          className="text-[11px] font-bold text-rose-500 hover:text-rose-650 dark:text-[#f87171] hover:underline flex items-center gap-1 cursor-pointer"
          id="clear-all-history"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear All
        </button>
      </div>

      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
        {history.map((item) => {
          const isActive = activeId === item.id;
          return (
            <motion.div
              layout
              key={item.id}
              whileHover={{ x: 2 }}
              className={`group flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                isActive
                  ? "bg-indigo-50/60 dark:bg-brand-purple/10 border-brand-purple/30 dark:border-brand-purple/40"
                  : "bg-slate-50/60 dark:bg-white/5 border-slate-200/50 dark:border-white/5 hover:bg-slate-100/45 dark:hover:bg-white/10"
              }`}
            >
              <button
                type="button"
                onClick={() => onSelect(item)}
                className="flex-1 text-left cursor-pointer focus:outline-none"
              >
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs font-semibold text-slate-700 dark:text-white/80 line-clamp-1">
                    {item.vibe}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 dark:text-white/40 mt-1">
                    <span>{item.timestamp}</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-0.5 text-brand-purple dark:text-[#a78bfa]">
                      <Film className="w-3 h-3" />
                      {item.movies.length} movies
                    </span>
                  </div>
                </div>
              </button>

              <div className="flex items-center gap-1.5 ml-2">
                <button
                  type="button"
                  onClick={() => onClearItem(item.id)}
                  className="p-1 px-1.5 text-slate-400 hover:text-rose-500 dark:text-white/30 dark:hover:text-[#f87171] rounded-lg hover:bg-white dark:hover:bg-white/5 transition-colors cursor-pointer"
                  title="Delete from history"
                  aria-label="Delete query history item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onSelect(item)}
                  className="p-1 px-1.5 text-slate-400 hover:text-brand-purple dark:text-white/30 dark:hover:text-brand-cyan rounded-lg hover:bg-white dark:hover:bg-white/5 transition-colors cursor-pointer group-hover:translate-x-0.5 transition-transform"
                  title="Reload this search session"
                  aria-label="Reload vibe search history details"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
