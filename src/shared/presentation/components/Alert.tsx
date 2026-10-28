import React from 'react';
import { cn } from '../lib/utils';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface AlertProps {
  type?: 'error' | 'success' | 'info';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Alert({ type = 'error', title, children, className }: AlertProps) {
  const styles = {
    error: 'bg-destructive/10 border-destructive/20 text-destructive',
    success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
    info: 'bg-primary/10 border-primary/20 text-primary',
  }[type];

  const Icon = type === 'success' ? CheckCircle2 : AlertCircle;

  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 rounded-lg border p-3.5 text-xs text-left leading-relaxed',
        styles,
        className
      )}
    >
      <Icon className="h-4 w-4 shrink-0 mt-0.5" />
      <div className="flex-1">
        {title && <h5 className="font-semibold mb-0.5">{title}</h5>}
        <div>{children}</div>
      </div>
    </div>
  );
}
