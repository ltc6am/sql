/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TableData } from '../constants';

declare global {
  interface Window {
    initSqlJs: any;
  }
}

export class SqlEngine {
  private db: any;
  private sqlJs: any;

  async init() {
    if (this.db) return;

    // Load from CDN
    if (!window.initSqlJs) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/sql-wasm.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    this.sqlJs = await window.initSqlJs({
      locateFile: (file: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${file}`
    });

    this.db = new this.sqlJs.Database();
  }

  execute(sql: string): TableData[] {
    if (!this.db) throw new Error("Database not initialized");
    
    try {
      const res = this.db.exec(sql);
      return res.map((r: any) => ({
        columns: r.columns,
        values: r.values
      }));
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  reset(setupSql?: string) {
    if (this.db) {
      this.db.close();
    }
    this.db = new this.sqlJs.Database();
    if (setupSql) {
      this.db.run(setupSql);
    }
  }

  getTableData(tableName: string): TableData {
    const res = this.db.exec(`SELECT * FROM ${tableName}`);
    if (res.length === 0) return { columns: [], values: [] };
    return {
      columns: res[0].columns,
      values: res[0].values
    };
  }
}

export const sqlEngine = new SqlEngine();
