import React from 'react';
import { cn } from '../lib/utils';

interface AuthSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export const AuthSelect = React.forwardRef<HTMLSelectElement, AuthSelectProps>(
  ({ label, error, options, className, id, required, ...props }, ref) => {
    const selectId = id || props.name;

    return (
      <div className="flex flex-col gap-1.5 w-full text-left">
        <label
          htmlFor={selectId}
          className="text-xs font-medium text-foreground tracking-wide flex items-center gap-1"
        >
          {label}
          {required && <span className="text-destructive font-bold">*</span>}
        </label>
        <select
          ref={ref}
          id={selectId}
          required={required}
          className={cn(
            'flex h-11 w-full rounded-md border border-border bg-card px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className="text-xs text-destructive mt-0.5">{error}</span>}
      </div>
    );
  }
);
AuthSelect.displayName = 'AuthSelect';
