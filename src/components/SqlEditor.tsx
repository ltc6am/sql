/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-sql';
import 'prismjs/themes/prism-tomorrow.css';
import { Play, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';

interface SqlEditorProps {
  code: string;
  onChange: (code: string) => void;
  onExecute: () => void;
  onReset: () => void;
  isError?: boolean;
}

export default function SqlEditor({ code, onChange, onExecute, onReset, isError }: SqlEditorProps) {
  return (
    <motion.div 
      animate={isError ? { x: [-10, 10, -10, 10, 0] } : {}}
      transition={{ duration: 0.4 }}
      className="flex flex-col h-full bg-slate-900 border-2 border-slate-900 neo-shadow overflow-hidden"
    >
      <div className="bg-slate-800 p-3 flex items-center justify-between border-b-2 border-slate-900">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-slate-600" />
          <div className="w-3 h-3 rounded-full bg-slate-600" />
          <div className="w-3 h-3 rounded-full bg-slate-600" />
        </div>
        <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Query_Editor.sql</span>
      </div>
      <div className="flex-1 overflow-auto p-4 editor-scrollbar relative">
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-slate-800/30 flex flex-col items-center pt-5 text-slate-600 text-[10px] font-mono pointer-events-none">
          <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
        </div>
        <div className="pl-6 h-full">
          <Editor
            value={code}
            onValueChange={onChange}
            highlight={code => highlight(code, languages.sql, 'sql')}
            padding={10}
            className="code-editor min-h-full text-white/90 outline-none leading-relaxed"
            textareaId="sql-textarea"
          />
        </div>
      </div>
      <div className="p-4 bg-slate-800 border-t-2 border-slate-900 flex justify-end gap-3">
        <button
          onClick={onReset}
          className="px-6 py-2 bg-slate-700 text-white font-bold uppercase text-[10px] border-2 border-slate-900 hover:bg-slate-600 active:translate-y-0.5 transition-all"
          id="reset-btn"
        >
          Reset
        </button>
        <button
          onClick={onExecute}
          className="px-8 py-2 bg-indigo-500 text-white font-black uppercase text-[10px] border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:bg-indigo-400 active:translate-y-0.5 transition-all"
          id="execute-btn"
        >
          Execute Query
        </button>
      </div>
    </motion.div>
  );
}
