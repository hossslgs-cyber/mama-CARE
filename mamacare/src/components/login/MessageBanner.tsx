'use client';

import { useEffect, type JSX } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import type { MessageState } from '@/types';

interface MessageBannerProps {
  message: MessageState | null;
  onDismiss: () => void;
}

export default function MessageBanner({ message, onDismiss }: MessageBannerProps): JSX.Element | null {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  const isError = message.type === 'error';

  return (
    <div
      role="alert"
      className={`motion-safe:animate-slide-left flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm ${
        isError
          ? 'border border-red-500/20 bg-red-500/10 text-red-300'
          : 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
      }`}
    >
      {isError ? (
        <AlertCircle className="h-4 w-4 shrink-0" />
      ) : (
        <CheckCircle2 className="h-4 w-4 shrink-0" />
      )}
      <span>{message.text}</span>
    </div>
  );
}
