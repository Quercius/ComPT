import sqlite3 from 'sqlite3';
import { readFile } from 'fs/promises';

const db = new sqlite3.Database('compiti.db');

try {
  const fileSQL = await readFile('edit-db.sql', 'utf-8');

  db.exec(fileSQL, (err) => {
    if (err) {
      console.error('Errore durante la modifica del db:', err.message);
    } else {
      console.log('Database modificato');
    }
    db.close();
  });
} catch (err) {
  console.error('Errore durante la lettura dei file SQL:', err.message);
  db.close();
}