// init_db.mjs
import sqlite3 from 'sqlite3';
import { readFile } from 'fs/promises';

const db = new sqlite3.Database('compiti.db');

try {
  const schemaSQL = await readFile('db-schema.sql', 'utf-8');
  const seedSQL = await readFile('seed_db.sql', 'utf-8');
  const fullSQL = `${schemaSQL}\n${seedSQL}`;

  db.exec(fullSQL, (err) => {
    if (err) {
      console.error('Errore durante l\'inizializzazione o il popolamento del DB:', err.message);
    } else {
      console.log('Database inizializzato e popolato correttamente.');
    }
    db.close();
  });
} catch (err) {
  console.error('Errore durante la lettura dei file SQL:', err.message);
  db.close();
}

