"use client";

import { MessageSquare } from 'lucide-react';
import { sendSMS, type SMSMessage } from '@/lib/utils/sms';

interface SMSButtonProps extends SMSMessage {
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  label?: string;
}

export function SMSButton({ 
  phone, 
  motherName, 
  appointmentDate, 
  type, 
  variant = 'secondary',
  className = '',
  label = 'Send SMS'
}: SMSButtonProps) {
  const handleClick = () => {
    sendSMS({ phone, motherName, appointmentDate, type });
  };

  const variants = {
    primary: 'bg-slate-900 text-white hover:bg-black',
    secondary: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50',
    ghost: 'text-slate-600 hover:bg-slate-100'
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold transition-all active:scale-95 shadow-sm ${variants[variant]} ${className}`}
    >
      <MessageSquare className="h-4 w-4" />
      {label}
    </button>
  );
}
