export interface DbImage {
  id: Readonly<number>;
  created: Readonly<Date>;
  updated: Readonly<Date>;
  uuid: string;
  fileName: string;
  image: string;
  thumb: string;
  author: string;
  quote: string;
};

export const images =
`CREATE TABLE IF NOT EXISTS images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  uuid TEXT UNIQUE,
  fileName TEXT,
  image TEXT,
  thumb TEXT,
  author TEXT,
  quote TEXT
)`;