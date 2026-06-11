import { supabase } from './supabase';
import { getAllRecords, putRecord, deleteRecord, getRecord } from './indexeddb';
import type { SyncQueueItem } from '@/types';

export async function processSyncQueue() {
  const queue = await getAllRecords<SyncQueueItem>('syncQueue');
  const pendingItems = queue
    .filter(item => item.status === 'pending')
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  if (pendingItems.length === 0) return { success: true, count: 0 };

  console.log(`Starting sync for ${pendingItems.length} items...`);
  let syncedCount = 0;

  for (const item of pendingItems) {
    try {
      const { error } = await supabase
        .from(item.table)
        .upsert(item.payload as any);

      if (error) throw error;

      // Update status to synced
      await putRecord('syncQueue', { ...item, status: 'synced' });
      
      // Optionally remove from queue to keep IDB light
      await deleteRecord('syncQueue', item.id);
      
      syncedCount++;
    } catch (err) {
      console.error(`Failed to sync item ${item.id}:`, err);
      await putRecord('syncQueue', { ...item, status: 'failed' });
    }
  }

  return { success: true, count: syncedCount };
}

export function isOnline(): boolean {
  if (typeof window === 'undefined') return false;
  return window.navigator.onLine;
}
