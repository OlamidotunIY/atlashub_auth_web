import React from 'react';

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8 bg-muted/40">
      <div className="w-full max-w-md bg-card border border-border/80 shadow-md rounded-2xl p-6 sm:p-8 flex flex-col gap-6 text-center">
        {/* Brand header */}
        <div className="flex flex-col items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black text-xl tracking-tighter shadow-xs">
            A
          </div>
          <span className="font-bold tracking-tight text-lg text-foreground">AtlasHub</span>
        </div>

        <div className="flex flex-col gap-1.5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">{title}</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">{subtitle}</p>
        </div>

        <div className="flex flex-col gap-4 text-left">{children}</div>

        {footer && <div className="text-xs text-muted-foreground pt-2 border-t border-border/60">{footer}</div>}
      </div>
    </div>
  );
}
