"use client";

import { useEffect, useState } from 'react';
import { Smartphone, RefreshCw, X } from 'lucide-react';

export function PWARefresh() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      (window as any).workbox !== undefined
    ) {
      const wb = (window as any).workbox;
      
      const promptNewVersionAvailable = () => {
        setShow(true);
      };

      wb.addEventListener('waiting', promptNewVersionAvailable);
      wb.addEventListener('externalwaiting', promptNewVersionAvailable);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 z-[100] mx-auto max-w-md animate-bounce-in">
      <div className="flex items-center gap-4 rounded-[2rem] bg-slate-900 p-6 text-white shadow-2xl shadow-slate-400">
        <div className="rounded-2xl bg-white/10 p-3">
          <Smartphone className="h-6 w-6 text-teal-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold">New Version Available</p>
          <p className="text-xs text-slate-400">Update now for the latest features.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => window.location.reload()}
            className="rounded-xl bg-teal-600 p-2 hover:bg-teal-500 transition-colors"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
          <button 
            onClick={() => setShow(false)}
            className="rounded-xl bg-white/10 p-2 hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
