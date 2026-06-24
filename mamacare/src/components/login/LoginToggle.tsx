'use client';

import { memo, useCallback, type JSX } from 'react';
import { Smartphone, Mail } from 'lucide-react';
import type { LoginMethod } from '@/types';

interface LoginToggleProps {
  method: LoginMethod;
  onChange: (method: LoginMethod) => void;
}

function LoginToggle({ method, onChange }: LoginToggleProps): JSX.Element {
  const selectPhone = useCallback(() => onChange('phone'), [onChange]);
  const selectEmail = useCallback(() => onChange('email'), [onChange]);

  return (
    <div className="flex rounded-xl border border-[rgba(0,212,170,0.15)] bg-[rgba(15,23,42,0.7)] p-1 relative z-[2]">
      <button
        type="button"
        onClick={selectPhone}
        className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
          method === 'phone'
            ? 'bg-gradient-to-br from-[#00d4aa] to-[#0891b2] text-white shadow-[0_2px_12px_rgba(0,212,170,0.3)]'
            : 'text-slate-400 hover:text-[#f0f9ff]'
        }`}
      >
        <Smartphone className="h-4 w-4" />
        Phone
      </button>
      <button
        type="button"
        onClick={selectEmail}
        className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
          method === 'email'
            ? 'bg-gradient-to-br from-[#00d4aa] to-[#0891b2] text-white shadow-[0_2px_12px_rgba(0,212,170,0.3)]'
            : 'text-slate-400 hover:text-[#f0f9ff]'
        }`}
      >
        <Mail className="h-4 w-4" />
        Email
      </button>
    </div>
  );
}

export default memo(LoginToggle);
