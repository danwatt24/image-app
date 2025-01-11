import sqlite3 from "sqlite3";
import path from "path";
import * as tables from './tables';

const dbPath = path.resolve("./server.db");
export let db:sqlite3.Database;

export function initializeDatabase() {
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error("Error opening database:", err);
      return;
    }
    console.log("Connected to the SQLite database.");

    // Create table if not exists
    db.run(tables.images,
      (err) => {
        if (err) {
          console.error("Error creating table:", err);
        }
      }
    );
  });

  db.on('trace', (sql) => {
    console.log('DB Query:', sql);
  });
}

export function SelectOne<T>(query: string, params?: any[]) {
  return new Promise<T>((res, rej) => {
    db.get<T>(query, params, (err, result) => {
      if (err) return rej(err);
      res(result);
    })
  });
}

export function SelectMany<T>(query: string, params?: any[]) {
  return new Promise<T[]>((res, rej) => {
    db.all<T>(query, params, (err, result) => {
      if (err) return rej(err);
      res(result);
    });
  });
}

interface RunResult {
  lastId: number;
  affectedRows: number;
}

function runQuery(query: string, params?: any[]) {
  return new Promise<RunResult>((res, rej) => {
    db.run(query, params, function (err) {
      if (err) return rej(err);
      res({ lastId: this.lastID, affectedRows: this.changes });
    });
  });
}

export function Insert(query:string, params: string[]) {
  return runQuery(query, params);
}

export function Delete(query: string, params?: any[]) {
  return runQuery(query, params);
}

export function Update(query: string, params?: any[]) {
  return runQuery(query, params);
}