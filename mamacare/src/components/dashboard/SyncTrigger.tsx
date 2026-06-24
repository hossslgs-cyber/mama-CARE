"use client";

import { useEffect } from 'react';
import { processSyncQueue, isOnline } from '@/lib/db/sync';

export function SyncTrigger() {
  useEffect(() => {
    const handleSync = async () => {
      if (isOnline()) {
        await processSyncQueue();
      }
    };

    window.addEventListener('online', handleSync);
    // Initial check
    handleSync();

    return () => window.removeEventListener('online', handleSync);
  }, []);

  return null; // Headless component
}
