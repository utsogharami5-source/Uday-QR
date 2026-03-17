import { useState } from 'react';
import clsx from 'clsx';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type QRSource } from '../db';

export default function History() {
  const [filter, setFilter] = useState<QRSource>('Scanned');

  const historyItems = useLiveQuery(
    () => db.history.where('source').equals(filter).reverse().sortBy('timestamp'),
    [filter]
  );

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'URL': return 'link';
      case 'Wi-Fi': return 'wifi';
      case 'Contact': return 'person';
      default: return 'notes';
    }
  };

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-300">
      {/* Header */}
      <header className="pt-12 px-6 pb-4 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 sticky top-0 z-10 transition-colors duration-300">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">ScanHistory Pro</span>
          <button 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            onClick={() => db.history.clear()}
          >
            <span className="material-symbols-outlined text-[20px]">delete</span>
          </button>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Activity</h1>
      </header>
      
      {/* Filter Tabs */}
      <div className="px-6 py-4 z-10 bg-background-light dark:bg-slate-950 transition-colors duration-300">
        <div className="flex h-11 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
          <label className={clsx(
            "flex cursor-pointer h-full grow items-center justify-center rounded-lg px-2 text-sm font-semibold transition-all duration-300",
            filter === 'Scanned' 
              ? "bg-white dark:bg-slate-700 shadow-sm text-primary" 
              : "text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          )}>
            <span className="truncate uppercase tracking-wider">Scanned</span>
            <input 
              className="hidden" 
              name="filter" 
              type="radio" 
              value="Scanned" 
              checked={filter === 'Scanned'}
              onChange={() => setFilter('Scanned')}
            />
          </label>
          <label className={clsx(
            "flex cursor-pointer h-full grow items-center justify-center rounded-lg px-2 text-sm font-semibold transition-all duration-300",
            filter === 'Generated' 
              ? "bg-white dark:bg-slate-700 shadow-sm text-primary" 
              : "text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          )}>
            <span className="truncate uppercase tracking-wider">Generated</span>
            <input 
              className="hidden" 
              name="filter" 
              type="radio" 
              value="Generated" 
              checked={filter === 'Generated'}
              onChange={() => setFilter('Generated')}
            />
          </label>
        </div>
      </div>
      
      {/* List */}
      <div className="flex-1 overflow-y-auto px-6 space-y-1 pb-20">
        {!historyItems || historyItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-500 mt-10">
            <span className="material-symbols-outlined text-5xl opacity-20 mb-4">history</span>
            <p className="font-medium text-sm">No {filter.toLowerCase()} history yet</p>
          </div>
        ) : (
          historyItems.map((item) => (
            <HistoryItem 
              key={item.id}
              icon={getIcon(item.type)} 
              title={item.type === 'URL' ? item.content : item.type} 
              subtitle={`${formatTime(item.timestamp)} • ${item.type}`} 
              onClick={() => {
                // Future enhancement: show details modal
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}

function HistoryItem({ icon, title, subtitle, onClick }: { icon: string, title: string, subtitle: string, onClick?: () => void }) {
  return (
    <div onClick={onClick} className="flex items-center gap-4 py-4 border-b border-slate-50 dark:border-slate-800 group cursor-pointer active:scale-95 transition-transform">
      <div className="flex items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0 size-14 transition-colors">
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        <p className="text-slate-900 dark:text-white text-base font-semibold truncate">{title}</p>
        <p className="text-slate-500 text-sm truncate">{subtitle}</p>
      </div>
      <div className="shrink-0 text-slate-300 group-hover:text-primary transition-colors">
        <span className="material-symbols-outlined">chevron_right</span>
      </div>
    </div>
  );
}
