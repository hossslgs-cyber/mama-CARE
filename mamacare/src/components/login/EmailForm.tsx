'use client';

import { useCallback, useState, type JSX } from 'react';
import { Mail, Eye, EyeOff, Loader2 } from 'lucide-react';

interface EmailFormProps {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => Promise<void>;
  submitting: boolean;
}

export default function EmailForm({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  submitting,
}: EmailFormProps): JSX.Element {
  const [showPassword, setShowPassword] = useState(false);

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
        <label className="form-label" htmlFor="email-input">
          Email Address
        </label>
        <div className="input-wrapper">
          <input
            id="email-input"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="nurse@clinic.go.ke"
            autoComplete="email"
            className="form-input"
          />
          <Mail className="input-icon h-4 w-4" />
        </div>
        <p className="hint-text">For Nurses &amp; Supervisors</p>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="password-input">
          Password
        </label>
        <div className="input-wrapper">
          <input
            id="password-input"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="Enter password"
            autoComplete="current-password"
            className="form-input pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="toggle-password"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <button type="submit" disabled={submitting} className="submit-btn">
        <span className="btn-text">{submitting ? 'Signing in...' : 'Sign In'}</span>
        {submitting && (
          <span className="btn-loader">
            <Loader2 className="h-5 w-5 animate-spin text-white" />
          </span>
        )}
      </button>
    </form>
  );
}
