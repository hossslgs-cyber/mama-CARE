"use client";

import { MessageCircle } from 'lucide-react';
import { openWhatsApp, type WhatsAppMessage } from '@/lib/utils/whatsapp';

interface WhatsAppButtonProps extends WhatsAppMessage {
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  label?: string;
}

export function WhatsAppButton({ 
  phone, 
  motherName, 
  appointmentDate, 
  type, 
  variant = 'primary',
  className = '',
  label = 'Message Mother'
}: WhatsAppButtonProps) {
  const handleClick = () => {
    openWhatsApp({ phone, motherName, appointmentDate, type });
  };

  const variants = {
    primary: 'bg-[#25D366] text-white hover:bg-[#20ba56]',
    secondary: 'bg-white border border-[#25D366] text-[#25D366] hover:bg-[#f0fff4]',
    ghost: 'text-[#25D366] hover:bg-[#f0fff4]'
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold transition-all active:scale-95 shadow-sm ${variants[variant]} ${className}`}
    >
      <MessageCircle className="h-4 w-4" />
      {label}
    </button>
  );
}
