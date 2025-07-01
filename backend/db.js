const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./leads.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL,
    web TEXT NOT NULL,
    telefono TEXT,
    mensaje TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
});

function insertLead({ nombre, email, web, telefono, mensaje }) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO leads (nombre, email, web, telefono, mensaje) VALUES (?, ?, ?, ?, ?)`,
      [nombre, email, web, telefono, mensaje],
      function (err) {
        if (err) return reject(err);
        resolve(this.lastID);
      }
    );
  });
}

function getLeads() {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM leads ORDER BY fecha DESC`, [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

module.exports = { insertLead, getLeads }; 