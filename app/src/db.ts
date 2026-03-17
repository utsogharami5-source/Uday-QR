import Dexie, { type EntityTable } from 'dexie';

export type QRType = 'URL' | 'Text' | 'Wi-Fi' | 'Contact';
export type QRSource = 'Scanned' | 'Generated';

export interface HistoryEntry {
  id?: number;
  type: QRType;
  source: QRSource;
  content: string;
  timestamp: Date;
}

const db = new Dexie('UdayQRDatabase') as Dexie & {
  history: EntityTable<HistoryEntry, 'id'>;
};

// Schema declaration
db.version(1).stores({
  history: '++id, type, source, timestamp' 
  // 'content' is not indexed as we don't plan to query by full content string often
});

export { db };
