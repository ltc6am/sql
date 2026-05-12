/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TableData } from '../constants';

interface DataTableProps {
  data: TableData | null;
  error?: string | null;
}

export default function DataTable({ data, error }: DataTableProps) {
  if (error) {
    return (
      <div className="flex flex-col h-full bg-pink-50 border-2 border-pink-900 p-6 neo-shadow">
        <h3 className="text-pink-900 font-black uppercase text-[10px] tracking-widest mb-2">Syntax Error</h3>
        <p className="text-pink-800 font-mono text-xs leading-relaxed">{error}</p>
      </div>
    );
  }

  if (!data || data.columns.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-white border-2 border-slate-900 border-dashed p-10 text-center neo-shadow">
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Execute query to retrieve data</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white border-2 border-slate-900 neo-shadow overflow-hidden">
      <div className="bg-slate-50 border-b-2 border-slate-900 px-4 py-2 flex justify-between items-center">
        <h2 className="text-slate-900 font-black uppercase text-[10px] tracking-widest">Result Set</h2>
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">
          {data.values.length} rows returned
        </span>
      </div>
      <div className="overflow-auto flex-1 custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-slate-50 border-b border-slate-200">
            <tr>
              {data.columns.map((col, i) => (
                <th key={i} className="px-4 py-2 font-bold text-slate-900 text-[10px] uppercase tracking-widest">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.values.map((row, i) => (
              <tr key={i} className="data-row">
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-2 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                    {String(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
