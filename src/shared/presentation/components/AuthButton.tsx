import React from 'react';
import { cn } from '../lib/utils';
import { Loader2 } from 'lucide-react';

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}

export const AuthButton = React.forwardRef<HTMLButtonElement, AuthButtonProps>(
  (
    {
      children,
      isLoading,
      loadingText,
      disabled,
      variant = 'primary',
      className,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      primary:
        'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm active:translate-y-[1px]',
      secondary:
        'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:translate-y-[1px]',
      outline:
        'border border-border bg-card hover:bg-muted text-foreground active:translate-y-[1px]',
      ghost: 'hover:bg-muted text-muted-foreground hover:text-foreground',
    }[variant];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex h-11 w-full items-center justify-center rounded-md px-4 text-sm font-semibold transition-all cursor-pointer select-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none',
          variantStyles,
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>{loadingText || children}</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);
AuthButton.displayName = 'AuthButton';
