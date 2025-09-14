const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbFile = path.join(__dirname, "users.db");
const db = new sqlite3.Database(dbFile);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT,
      company TEXT,
      address_street TEXT,
      address_city TEXT,
      address_zip TEXT,
      geo_lat REAL,
      geo_lng REAL
    )
  `);
});

module.exports = db;
