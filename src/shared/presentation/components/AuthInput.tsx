import React from 'react';
import { cn } from '../lib/utils';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, helperText, className, id, required, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="flex flex-col gap-1.5 w-full text-left">
        <label
          htmlFor={inputId}
          className="text-xs font-medium text-foreground tracking-wide flex items-center gap-1"
        >
          {label}
          {required && <span className="text-destructive font-bold">*</span>}
        </label>
        <input
          ref={ref}
          id={inputId}
          required={required}
          className={cn(
            'flex h-11 w-full rounded-md border border-border bg-card px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground shadow-xs transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-destructive mt-0.5">{error}</span>}
        {!error && helperText && (
          <span className="text-xs text-muted-foreground mt-0.5">{helperText}</span>
        )}
      </div>
    );
  }
);
AuthInput.displayName = 'AuthInput';
