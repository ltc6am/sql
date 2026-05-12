/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TableData } from '../constants';
import { Database, Table as TableIcon } from 'lucide-react';

interface DatabaseSchemaProps {
  tables: Record<string, TableData>;
  onTableClick: (tableName: string) => void;
}

export default function DatabaseSchema({ tables, onTableClick }: DatabaseSchemaProps) {
  return (
    <div className="bg-white border-2 border-slate-900 p-4 neo-shadow h-full flex flex-col">
      <h2 className="text-slate-900 font-black uppercase text-xs mb-3 tracking-widest border-b-2 border-slate-100 pb-2 flex items-center gap-2">
        <Database size={14} className="text-indigo-600" />
        Schema Explorer
      </h2>
      
      <div className="flex-1 overflow-auto custom-scrollbar flex flex-col gap-6">
        {Object.entries(tables).map(([name, data]) => (
          <div key={name} className="flex flex-col gap-3">
            <button 
              onClick={() => onTableClick(name)}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-400 text-left transition-colors group"
            >
              <TableIcon size={12} />
              <span className="font-mono text-xs font-black uppercase tracking-tight underline decoration-dotted underline-offset-4 group-hover:decoration-solid">{name}</span>
            </button>
            <ul className="text-[10px] font-mono space-y-2 ml-4">
              {data.columns.map((col, i) => (
                <li key={i} className="flex justify-between items-center border-b border-slate-50 pb-1">
                  <span className="text-slate-700 font-bold">{col}</span>
                  <span className="text-slate-400 italic">type</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
