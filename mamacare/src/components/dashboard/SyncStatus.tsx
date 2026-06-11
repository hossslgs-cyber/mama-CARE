"use client";

import { useEffect, useState } from 'react';
import { processSyncQueue, isOnline } from '@/lib/db/sync';
import { getAllRecords } from '@/lib/db/indexeddb';
import type { SyncQueueItem } from '@/types';
import { Cloud, CloudOff, RefreshCw } from 'lucide-react';

export function SyncStatus() {
  const [online, setOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);

  const updateStatus = async () => {
    setOnline(isOnline());
    const queue = await getAllRecords<SyncQueueItem>('syncQueue');
    setPendingCount(queue.filter(i => i.status === 'pending').length);
  };

  useEffect(() => {
    updateStatus();
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    const interval = setInterval(updateStatus, 5000); // Check every 5s

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
      clearInterval(interval);
    };
  }, []);

  const handleSync = async () => {
    if (!online || syncing) return;
    setSyncing(true);
    await processSyncQueue();
    await updateStatus();
    setSyncing(false);
  };

  if (!online && pendingCount === 0) return null;

  return (
    <div className={`flex items-center gap-3 rounded-full border px-4 py-2 text-xs font-bold transition-all shadow-sm ${
      online ? 'border-teal-100 bg-teal-50 text-teal-700' : 'border-slate-200 bg-slate-50 text-slate-500'
    }`}>
      {online ? <Cloud className="h-4 w-4" /> : <CloudOff className="h-4 w-4" />}
      
      <span className="uppercase tracking-wider">
        {online ? (pendingCount > 0 ? `${pendingCount} items pending` : 'All synced') : 'Offline Mode'}
      </span>

      {online && pendingCount > 0 && (
        <button 
          onClick={handleSync}
          disabled={syncing}
          className="ml-2 rounded-full bg-white p-1 hover:bg-teal-100 disabled:opacity-50"
        >
          <RefreshCw className={`h-3 w-3 ${syncing ? 'animate-spin' : ''}`} />
        </button>
      )}
    </div>
  );
}
