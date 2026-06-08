/**
 * agent.js
 * Serviço/Agente local para Pandora 2.0
 * - Expõe API REST local (localhost:3333)
 * - Acessa banco SQLite em db/pandora.db
 * - Endpoints para: status, executar comando (com permissão), listar arquivos (com permissão), criar/ler registros
 *
 * Atenção: para uso como serviço, instalar via install-service.ps1 (script PowerShell).
 */

const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const PORT = 3333;
const USER_DOCS = path.join(require('os').homedir(), 'Documents', 'Pandora 2.0');
const DB_PATH = path.join(USER_DOCS, 'db', 'pandora.db');

if (!fs.existsSync(USER_DOCS)) fs.mkdirSync(USER_DOCS, { recursive: true });
if (!fs.existsSync(path.dirname(DB_PATH))) fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

// open DB
const db = new sqlite3.Database(DB_PATH);
function ensureSchema() {
  const schema = fs.readFileSync(path.join(__dirname, 'db', 'schema.sql'), 'utf8');
  db.exec(schema, (err) => {
    if (err) console.error('Erro ao criar schema:', err);
    else console.log('Schema verificado/instalado.');
  });
}
ensureSchema();

const app = express();
app.use(bodyParser.json());

// middleware simples de auditoria
app.use((req, res, next) => {
  console.log(`[AGENT] ${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// status
app.get('/status', (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

// listar arquivos (somente dentro da pasta do projeto/pasta permitida)
app.post('/list-files', (req, res) => {
  const { dir } = req.body;
  if (!dir) return res.status(400).json({ error: 'dir required' });

  // normalize and restrict
  const allowedBase = USER_DOCS;
  const requested = path.resolve(dir);
  if (!requested.startsWith(allowedBase)) {
    return res.status(403).json({ error: 'Acesso negado: fora da pasta permitida.' });
  }
  fs.readdir(requested, { withFileTypes: true }, (err, entries) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(entries.map(e => ({ name: e.name, isDirectory: e.isDirectory() })));
  });
});

// executar comando (somente comandos permitidos)
const SAFE_COMMANDS = ['notepad.exe', 'calc.exe', 'explorer.exe']; // pode estender via config
app.post('/exec', (req, res) => {
  const { cmd, args } = req.body;
  if (!cmd) return res.status(400).json({ error: 'cmd required' });

  if (!SAFE_COMMANDS.includes(cmd)) {
    return res.status(403).json({ error: 'Comando não permitido por segurança.' });
  }

  try {
    const p = spawn(cmd, args || [], { detached: true, stdio: 'ignore' });
    p.unref();
    res.json({ ok: true, pid: p.pid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// salvar log de conversa / sessão
app.post('/sessions', (req, res) => {
  const { user, text, metadata } = req.body;
  const created_at = new Date().toISOString();
  db.run(`INSERT INTO sessions(user_name, created_at, query, metadata) VALUES (?,?,?,?)`, [user || 'local', created_at, text || '', JSON.stringify(metadata || {})], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ ok: true, id: this.lastID });
  });
});

// listar últimas sessões
app.get('/sessions', (req, res) => {
  db.all(`SELECT id, user_name, created_at, query FROM sessions ORDER BY id DESC LIMIT 50`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// shutdown (somente local; exige confirmação "secret" para evitar chamadas remotas)
app.post('/shutdown', (req, res) => {
  const { secret } = req.body;
  if (secret !== 'pandora-local-shutdown') return res.status(403).json({ error: 'secret inválido' });
  res.json({ ok: true });
  console.log('Agent encerrando por pedido local...');
  process.exit(0);
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Pandora agent ouvindo em http://127.0.0.1:${PORT}`);
});
