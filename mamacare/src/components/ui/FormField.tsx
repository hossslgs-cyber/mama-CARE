import type { InputHTMLAttributes } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

interface FormFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
  containerClassName?: string;
}

export function FormField({ label, registration, error, containerClassName, ...inputProps }: FormFieldProps) {
  return (
    <label className={`space-y-1 ${containerClassName ?? ''}`}>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        {...registration}
        {...inputProps}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
      />
      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
    </label>
  );
}
