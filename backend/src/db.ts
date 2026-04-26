import Database from 'better-sqlite3'
import { dirname } from 'node:path'
import { mkdirSync } from 'node:fs'

const DB_PATH = process.env.DATABASE_PATH || './data/leads.db'

mkdirSync(dirname(DB_PATH), { recursive: true })

export const db = new Database(DB_PATH)

db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            TEXT    NOT NULL,
    phone           TEXT    NOT NULL UNIQUE,
    region          TEXT    NOT NULL,
    interests       TEXT    NOT NULL,
    sms_consent     INTEGER NOT NULL DEFAULT 0,
    privacy_consent INTEGER NOT NULL DEFAULT 1,
    ref             TEXT    NOT NULL DEFAULT 'direct',
    user_agent      TEXT,
    ip              TEXT,
    status          TEXT    NOT NULL DEFAULT 'new',
    memo            TEXT,
    created_at      TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_leads_ref        ON leads(ref);
  CREATE INDEX IF NOT EXISTS idx_leads_status     ON leads(status);
`)

export interface LeadRow {
  id: number
  name: string
  phone: string
  region: string
  interests: string
  sms_consent: 0 | 1
  privacy_consent: 0 | 1
  ref: string
  user_agent: string | null
  ip: string | null
  status: string
  memo: string | null
  created_at: string
}
