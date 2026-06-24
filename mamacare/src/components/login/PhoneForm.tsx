'use client';

import { useCallback, useState, type JSX } from 'react';
import { Smartphone, Eye, EyeOff, Loader2 } from 'lucide-react';

interface PhoneFormProps {
  phone: string;
  pin: string;
  onPhoneChange: (value: string) => void;
  onPinChange: (value: string) => void;
  onSubmit: () => Promise<void>;
  submitting: boolean;
}

export default function PhoneForm({
  phone,
  pin,
  onPhoneChange,
  onPinChange,
  onSubmit,
  submitting,
}: PhoneFormProps): JSX.Element {
  const [showPin, setShowPin] = useState(false);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      void onSubmit();
    },
    [onSubmit],
  );

  return (
    <form onSubmit={handleSubmit} className="motion-safe:animate-fade-in space-y-4">
      <div className="form-group">
        <label className="form-label" htmlFor="phone-input">
          Phone Number
        </label>
        <div className="input-wrapper">
          <input
            id="phone-input"
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="+254 7XX XXX XXX"
            autoComplete="tel"
            inputMode="tel"
            className="form-input"
          />
          <Smartphone className="input-icon h-4 w-4" />
        </div>
        <p className="hint-text">For Community Health Workers</p>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="pin-input">
          PIN Code
        </label>
        <div className="input-wrapper">
          <input
            id="pin-input"
            type={showPin ? 'text' : 'password'}
            value={pin}
            onChange={(e) => onPinChange(e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="4-digit PIN"
            autoComplete="current-password"
            inputMode="numeric"
            maxLength={4}
            className="form-input pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPin((prev) => !prev)}
            className="toggle-password"
            aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
          >
            {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <button type="submit" disabled={submitting} className="submit-btn">
        <span className="btn-text">{submitting ? 'Signing in...' : 'Continue'}</span>
        {submitting && (
          <span className="btn-loader">
            <Loader2 className="h-5 w-5 animate-spin text-white" />
          </span>
        )}
      </button>
    </form>
  );
}
