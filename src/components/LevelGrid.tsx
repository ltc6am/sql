/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Level, LEVELS } from '../constants';
import { Lock, CheckCircle2, Play } from 'lucide-react';
import { motion } from 'motion/react';

interface LevelGridProps {
  completedLevelIndex: number;
  onSelectLevel: (index: number) => void;
}

export default function LevelGrid({ completedLevelIndex, onSelectLevel }: LevelGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-4">
      {LEVELS.map((level, index) => {
        const isUnlocked = index <= completedLevelIndex;
        const isCompleted = index < completedLevelIndex;
        
        return (
          <motion.button
            key={level.id}
            whileHover={isUnlocked ? { scale: 1.02, y: -4 } : {}}
            whileTap={isUnlocked ? { scale: 0.98 } : {}}
            onClick={() => isUnlocked && onSelectLevel(index)}
            className={`
              relative flex flex-col p-6 border-2 text-left transition-all h-48
              ${isUnlocked 
                ? 'bg-white border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]' 
                : 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'}
            `}
          >
            <div className="flex justify-between items-start mb-4">
              <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                level.difficulty === 'Easy' ? 'border-emerald-200 text-emerald-600 bg-emerald-50' :
                level.difficulty === 'Medium' ? 'border-amber-200 text-amber-600 bg-amber-50' :
                'border-rose-200 text-rose-600 bg-rose-50'
              }`}>
                {level.difficulty}
              </span>
              {isCompleted ? (
                <CheckCircle2 size={16} className="text-emerald-500" />
              ) : !isUnlocked ? (
                <Lock size={16} className="text-slate-300" />
              ) : null}
            </div>

            <div className="flex-1">
              <h3 className="font-black text-slate-900 uppercase text-xs tracking-tight mb-2 line-clamp-2">
                {level.title}
              </h3>
              <p className="text-[10px] text-slate-500 font-medium line-clamp-3">
                {level.description}
              </p>
            </div>

            <div className="absolute bottom-4 right-4 text-[10px] font-black italic text-slate-300">
              MISSION_{String(index + 1).padStart(2, '0')}
            </div>
            
            {isUnlocked && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <Play className="text-indigo-600" size={32} />
              </div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
