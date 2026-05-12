/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Level } from '../constants';
import { ChevronRight, HelpCircle, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LevelInfoProps {
  level: Level;
  currentLevelIndex: number;
  totalLevels: number;
  isCompleted: boolean;
  onNextLevel: () => void;
  feedback?: string | null;
}

export default function LevelInfo({ level, currentLevelIndex, totalLevels, isCompleted, onNextLevel, feedback }: LevelInfoProps) {
  const [showHint, setShowHint] = useState(false);

  // Reset hint when level changes
  React.useEffect(() => {
    setShowHint(false);
  }, [level.id]);

  const difficultyColor = {
    Easy: 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5',
    Medium: 'text-amber-500 border-amber-500/20 bg-amber-500/5',
    Hard: 'text-rose-500 border-rose-500/20 bg-rose-500/5'
  }[level.difficulty];

  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar pr-2">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <span className={`px-2 py-0.5 border text-[10px] font-black uppercase tracking-widest rounded ${difficultyColor}`}>
            {level.difficulty}
          </span>
          <h2 className="text-indigo-600 font-black uppercase text-[10px] tracking-widest">Mission {currentLevelIndex + 1} of {totalLevels}</h2>
        </div>
        <h1 className="text-2xl font-black text-slate-900 leading-tight">{level.title}</h1>
      </div>

      <div className="bg-white border-2 border-slate-900 p-5 neo-card">
        <h2 className="text-indigo-600 font-black uppercase text-[10px] mb-2 tracking-widest">The Scenario</h2>
        <p className="text-slate-500 leading-relaxed text-sm italic mb-4">
          "{level.scenario}"
        </p>
        <h2 className="text-indigo-600 font-black uppercase text-[10px] mb-2 tracking-widest">Objective</h2>
        <p className="text-slate-700 leading-relaxed text-sm font-medium">
          {level.description}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <button 
          onClick={() => setShowHint(!showHint)}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors"
        >
          {showHint ? <EyeOff size={14} /> : <Eye size={14} />}
          {showHint ? "Hide Hint" : "Request Hint"}
        </button>

        <AnimatePresence>
          {(showHint || feedback) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-emerald-50 border-2 border-emerald-900 p-5 shadow-[4px_4px_0px_0px_rgba(6,78,59,1)]"
            >
              <h2 className="text-emerald-900 font-black uppercase text-[10px] mb-2 tracking-widest flex items-center gap-2">
                <HelpCircle size={14} />
                SQL Master's Hint
              </h2>
              <div className="text-emerald-800 text-xs leading-relaxed italic space-y-2">
                {feedback && <p className="font-bold border-b border-emerald-900/10 pb-2 bg-white/30 p-2 rounded mb-2">Feedback: {feedback}</p>}
                <p>{level.hint}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isCompleted && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={onNextLevel}
          className="px-8 py-3 bg-indigo-500 text-white font-black uppercase text-sm neo-button flex items-center justify-center gap-2 sticky bottom-0"
        >
          {currentLevelIndex + 1 === totalLevels ? 'COMPLETE QUEST' : 'NEXT MISSION'}
          <ChevronRight size={18} />
        </motion.button>
      )}
    </div>
  );
}
