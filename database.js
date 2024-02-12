import sqlite3 from "sqlite3";
import fs from "fs";

let _dbInstance;

async function init(dbName) {
  if (!fs.existsSync(dbName)) {
    if (_dbInstance) {
      _dbInstance.close();
      _dbInstance = null;
    }
    await createDatabase(dbName);
  }

  if (!_dbInstance)
    _dbInstance = new sqlite3.Database(dbName, sqlite3.OPEN_READWRITE);
}

async function createDatabase(dbName) {
  const db = await new Promise((res, rej) => {
    const db = new sqlite3.Database(dbName, (err) =>
      err ? rej(err) : res(db)
    );
  });
  await new Promise((res, rej) => {
    db.exec(
      `
        CREATE TABLE "images" (
          "id"	INTEGER,
          "author" TEXT NOT NULL,
          "quote" TEXT NOT NULL,
          "image"	TEXT NOT NULL,
          "hash"	TEXT NOT NULL,
          "created"	TEXT DEFAULT CURRENT_TIMESTAMP,
          "updated"	TEXT,
          PRIMARY KEY("id" AUTOINCREMENT)
        )
      `,
      (err) => (err ? rej(err) : res())
    );
  });
  await new Promise((res, rej) => db.close((err) => (err ? rej(err) : res())));
}

/**
 * returns the current database instance
 * @returns {sqlite3.Database}
 */
function getDatabase() {
  if (!_dbInstance)
    throw new Error("database was not initialized. run database.init() first.");
  return _dbInstance;
}

async function insert(author, quote, imageName, hash) {
  const db = getDatabase();
  const insertId = await new Promise((res, rej) => {
    db.serialize(() => {
      const stmt = db.prepare(
        `INSERT INTO images (author, quote, image, hash) VALUES (?,?,?,?) RETURNING id`
      );
      stmt.run([author, quote, imageName, hash], function (err) {
        if (err) return rej(err);
        res(this.lastID);
      });
      stmt.finalize();
    });
  });

  return insertId;
}

/**
 * Returns the entires that match the given params
 * @param {string} author
 * @param {string} quote
 * @param {string} imageHash
 * @returns {Promise<number | undefined>}
 */
async function getByAuthorQuoteOrHash(author, quote, imageHash) {
  const db = getDatabase();
  const entry = await new Promise((res, rej) => {
    db.get(
      `SELECT id FROM images WHERE (author=? AND quote=?) OR hash=?`,
      [author, quote, imageHash],
      (err, row) => {
        if (err) return rej(err);
        res(row);
      }
    );
  });
  return entry;
}

const database = {
  insert,
  init,
  getByAuthorQuoteOrHash,
};

export default database;
