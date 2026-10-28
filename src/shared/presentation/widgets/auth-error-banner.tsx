interface AuthErrorBannerProps {
  error: Error | string | null;
  fallback?: string;
}

export function AuthErrorBanner({ error, fallback = 'Something went wrong. Please try again.' }: AuthErrorBannerProps) {
  if (!error) return null;

  const message = typeof error === 'string' ? error : error.message;

  return (
    <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md" role="alert">
      {message || fallback}
    </div>
  );
}
