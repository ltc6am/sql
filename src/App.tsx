import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { sqlEngine } from './lib/sqlEngine';
import { LEVELS, TableData, Level } from './constants';
import { auth, signInWithGoogle, logout, saveUserProgress, getUserProgress } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import SqlEditor from './components/SqlEditor';
import DataTable from './components/DataTable';
import LevelInfo from './components/LevelInfo';
import DatabaseSchema from './components/DatabaseSchema';
import LevelGrid from './components/LevelGrid';
import { Database, Sparkles, LogIn, LogOut, ChevronLeft } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [unlockedLevelIndex, setUnlockedLevelIndex] = useState(0);
  const [view, setView] = useState<'home' | 'game'>('home');
  const [code, setCode] = useState(LEVELS[0].initialSql);
  const [result, setResult] = useState<TableData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isEngineReady, setIsEngineReady] = useState(false);
  const [schema, setSchema] = useState<Record<string, TableData>>({});
  const [isGameOver, setIsGameOver] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [isShakeTriggered, setIsShakeTriggered] = useState(false);

  const currentLevel = LEVELS[currentLevelIndex];

  // Engine pre-initialization
  useEffect(() => {
    const warmup = async () => {
      try {
        await sqlEngine.init();
        setIsEngineReady(true);
      } catch (err) {
        console.error("Early engine warm-up failed:", err);
      }
    };
    warmup();
  }, []);

  // Auth monitoring with safety timeout
  useEffect(() => {
    const safetyTimeout = setTimeout(() => {
      setAuthLoading(false);
    }, 8000); // Max 8s wait for auth/sync

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          // Wrap in a race to prevent long hangs on slow Firestore response
          const progress = await Promise.race([
            getUserProgress(currentUser.uid),
            new Promise<number>((resolve) => setTimeout(() => resolve(0), 4000))
          ]) as number;

          setUnlockedLevelIndex(progress);
          if (progress > 0 && progress < LEVELS.length) {
            setCurrentLevelIndex(progress);
          }
        } catch (e) {
          console.warn("Progress sync interrupted:", e);
        }
      } else {
        setUnlockedLevelIndex(0);
        setCurrentLevelIndex(0);
      }
      setAuthLoading(false);
      clearTimeout(safetyTimeout);
    });

    return () => {
      unsubscribe();
      clearTimeout(safetyTimeout);
    };
  }, []);

  const handleExecute = async (overrideCode?: string) => {
    const codeToRun = overrideCode !== undefined ? overrideCode : code;
    setError(null);
    setFeedback(null);
    setIsShakeTriggered(false);
    try {
      const results = sqlEngine.execute(codeToRun);
      if (results.length > 0) {
        setResult(results[0]);
        // Only mark as completed if it wasn't an automatic preview execute
        if (overrideCode === undefined && currentLevel.expectedResult(results[0])) {
          setIsCompleted(true);
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#4f46e5', '#141414', '#ffffff']
          });
          
          const nextIndex = currentLevelIndex + 1;
          if (nextIndex > unlockedLevelIndex) {
            setUnlockedLevelIndex(nextIndex);
            if (user) {
              saveUserProgress(user.uid, nextIndex);
            }
          }
        } else if (overrideCode === undefined) {
          setIsShakeTriggered(true);
          setFeedback(currentLevel.hint);
        }
      }
    } catch (err: any) {
      if (overrideCode === undefined) {
        setError(err.message);
        setIsShakeTriggered(true);
        setFeedback(currentLevel.hint);
      }
    }
  };

  const initGame = useCallback(async () => {
    if (view !== 'game') return;
    try {
      if (!isEngineReady) {
        await sqlEngine.init();
      }
      sqlEngine.reset(currentLevel.setupSql);
      
      const newSchema: Record<string, TableData> = {};
      currentLevel.tables.forEach(table => {
        newSchema[table] = sqlEngine.getTableData(table);
      });
      setSchema(newSchema);
      setIsEngineReady(true);
      setCode(currentLevel.initialSql);
      
      // Automatic execution on start
      handleExecute(currentLevel.initialSql);
    } catch (err) {
      console.error("Engine failed:", err);
    }
  }, [currentLevel, view, isEngineReady]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleReset = () => {
    setCode(currentLevel.initialSql);
    setResult(null);
    setError(null);
    setFeedback(null);
    setIsCompleted(false);
    handleExecute(currentLevel.initialSql);
  };

  const nextLevel = () => {
    if (currentLevelIndex + 1 < LEVELS.length) {
      setCurrentLevelIndex(prev => prev + 1);
      setResult(null);
      setError(null);
      setIsCompleted(false);
      setFeedback(null);
    } else {
      setIsGameOver(true);
    }
  };

  const handleTablePreview = (tableName: string) => {
    const previewSql = `SELECT * FROM ${tableName};`;
    setCode(previewSql);
    handleExecute(previewSql);
  };

  const renderHeader = () => (
    <header className="flex items-center justify-between bg-white border-2 border-slate-900 p-4 neo-shadow shrink-0">
      <div className="flex items-center gap-4">
        {view === 'game' ? (
          <button 
            onClick={() => setView('home')}
            className="p-2 border-2 border-slate-900 bg-white hover:bg-slate-50 neo-shadow transition-all"
          >
            <ChevronLeft size={20} />
          </button>
        ) : (
          <div className="w-10 h-10 bg-indigo-600 flex items-center justify-center text-white font-bold text-xl border-2 border-slate-900">
            S
          </div>
        )}
        <div className="flex flex-col">
          <h1 className="text-2xl font-black uppercase tracking-tighter text-slate-900 leading-none">
            SQL Quest<span className="text-indigo-600">.edu</span>
          </h1>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">Command Line Chronicles</span>
        </div>
      </div>
      
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-8">
          {view === 'game' && (
            <div className="flex items-center gap-6 font-bold uppercase text-xs tracking-widest border-r-2 border-slate-200 pr-8 mr-2">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-slate-400 text-[10px]">Relational Progress</span>
                <span className="text-slate-900 font-black">{currentLevelIndex + 1}: {currentLevel.title}</span>
              </div>
              <div className="w-32 h-4 bg-slate-200 border-2 border-slate-900 relative overflow-hidden hidden sm:block">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentLevelIndex + (isCompleted ? 1 : 0)) / LEVELS.length) * 100}%` }}
                  className="absolute top-0 left-0 h-full bg-emerald-400"
                />
              </div>
            </div>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authenticated</span>
                <span className="text-xs font-black text-indigo-600 truncate max-w-[120px]">{user.displayName || user.email}</span>
              </div>
              <button 
                onClick={logout}
                className="p-2 border-2 border-slate-900 bg-white text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors neo-shadow shrink-0"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button 
              onClick={signInWithGoogle}
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-900 font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 neo-shadow group transition-all"
            >
              <LogIn size={14} className="group-hover:rotate-12 transition-transform" />
              Sign in with Google
            </button>
          )}
        </div>
      </div>
    </header>
  );

  if (view === 'home') {
    return (
      <div className="w-full h-screen flex flex-col p-8 gap-8 grid-pattern overflow-y-auto custom-scrollbar">
        {renderHeader()}
        <section className="flex-1 flex flex-col gap-8 max-w-7xl mx-auto w-full">
          <div className="flex flex-col gap-2">
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Mission Hub</h2>
            <p className="text-slate-500 font-medium font-sans">Choose a mission to begin your SQL journey. Complete missions to unlock more advanced challenges.</p>
          </div>

          {!user && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-amber-50 border-2 border-amber-500 p-4 neo-shadow flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="bg-amber-500 p-2 text-white border-2 border-slate-900">
                  <LogIn size={20} />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest">Guest Mode Active</h4>
                  <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">Please sign in with Google to save your mission progress and unlocks permantly!</p>
                </div>
              </div>
              <button 
                onClick={signInWithGoogle}
                className="px-4 py-2 bg-white border-2 border-slate-900 font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 neo-shadow transition-all"
              >
                Sign In Now
              </button>
            </motion.div>
          )}

          <LevelGrid 
            completedLevelIndex={unlockedLevelIndex} 
            onSelectLevel={(idx) => {
              setCurrentLevelIndex(idx);
              setResult(null);
              setError(null);
              setIsCompleted(false);
              setFeedback(null);
              setView('game');
            }} 
          />
        </section>
        <footer className="h-10 flex items-center justify-center text-[9px] font-black text-slate-400 uppercase tracking-widest shrink-0">
           &copy; 2026 Relational Academy | MISSION_CONTROL_ONLINE
        </footer>
      </div>
    );
  }

  if (authLoading || (view === 'game' && !isEngineReady)) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-6 bg-slate-50 text-slate-900 grid-pattern">
        <div className="relative">
          <Database className="animate-bounce text-indigo-600 relative z-10" size={48} />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-2 bg-slate-900/10 blur-sm rounded-full" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            {authLoading ? "Synchronizing Mission Data..." : "Initializing V-WASM Engine..."}
          </p>
          <div className="w-32 h-1 bg-slate-200 border border-slate-900 relative overflow-hidden">
             <motion.div 
               animate={{ left: ['-100%', '100%'] }}
               transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
               className="absolute top-0 w-1/2 h-full bg-indigo-600"
             />
          </div>
        </div>
      </div>
    );
  }

  if (isGameOver) {
    return (
      <div className="h-screen w-full flex items-center justify-center p-6 bg-quest-bg grid-pattern">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full text-center bg-white p-12 border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]"
        >
          <div className="w-24 h-24 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
            <Sparkles size={48} />
          </div>
          <h1 className="text-5xl font-black tracking-tighter mb-4 text-slate-900 uppercase">QUEST COMPLETED!</h1>
          <p className="text-xl text-slate-500 mb-10 leading-relaxed font-medium">
            The database submits to your will. You have completed all missions and mastered the fundamentals of SQL.
          </p>
          <button 
            onClick={() => setView('home')}
            className="px-10 py-4 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-y-1 active:shadow-none transition-all"
          >
            Return to Mission Hub
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col p-8 gap-6 grid-pattern overflow-hidden">
      {renderHeader()}

      <main className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
        {/* Objectives Section - 3 columns */}
        <section className="col-span-3 flex flex-col gap-4 overflow-hidden">
          <LevelInfo 
            level={currentLevel}
            currentLevelIndex={currentLevelIndex}
            totalLevels={LEVELS.length}
            isCompleted={isCompleted}
            onNextLevel={nextLevel}
            feedback={feedback}
          />
        </section>

        {/* Editor Section - 6 columns */}
        <section className="col-span-6 flex flex-col overflow-hidden">
          <SqlEditor 
            code={code} 
            onChange={setCode} 
            onExecute={handleExecute} 
            onReset={handleReset} 
            isError={isShakeTriggered}
          />
        </section>

        {/* Schema & Results Section - 3 columns */}
        <section className="col-span-3 flex flex-col gap-6 overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <DatabaseSchema tables={schema} onTableClick={handleTablePreview} />
          </div>
          <div className="flex-[1.5] overflow-hidden">
            <DataTable data={result} error={error} />
          </div>
        </section>
      </main>

      <footer className="h-10 flex items-center justify-between border-t-2 border-slate-200 pt-2 text-[9px] font-black text-slate-400 uppercase tracking-widest shrink-0">
        <div>&copy; 2026 Relational Academy</div>
        <div className="flex gap-8">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            V-WASM Engine Online
          </span>
          <span>Mission Protocol {currentLevelIndex + 1}/{LEVELS.length}</span>
        </div>
      </footer>
    </div>
  );
}

