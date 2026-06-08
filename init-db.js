const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const os = require('os');

const USER_DOCS = path.join(os.homedir(), 'Documents', 'Pandora 2.0');
const DB_DIR = path.join(USER_DOCS, 'db');
const DB_PATH = path.join(DB_DIR, 'pandora.db');

if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

const schemaPath = path.join(__dirname, 'db', 'schema.sql');
if (!fs.existsSync(schemaPath)) {
  console.error('schema.sql não encontrado em ./db');
  process.exit(1);
}

const schema = fs.readFileSync(schemaPath, 'utf8');

const db = new sqlite3.Database(DB_PATH);
db.exec(schema, (err) => {
  if (err) {
    console.error('Erro ao executar schema:', err);
    process.exit(1);
  }
  console.log('DB inicializado em', DB_PATH);
  db.close();
});
