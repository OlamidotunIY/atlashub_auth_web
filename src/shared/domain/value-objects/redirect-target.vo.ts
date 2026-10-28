/**
 * Value object ensuring return_to URLs strictly match allowlisted client web portals.
 * Protects against open-redirect phishing attacks.
 */
export class SafeRedirectTarget {
  private static readonly ALLOWED_ORIGINS = [
    'http://localhost:5173', // atlashub_web local dev
    'http://localhost:5175', // atlashub_storefront_portal local dev
    'https://app.atlashub.name.ng',
    'https://connect.atlashub.name.ng',
    'https://storefront.atlashub.name.ng',
  ];

  private readonly validUrl: string;

  constructor(targetUrl?: string | null, fallback = 'http://localhost:5173') {
    if (!targetUrl || !targetUrl.trim()) {
      this.validUrl = fallback;
      return;
    }

    try {
      // If it's a relative path on same host
      if (targetUrl.startsWith('/') && !targetUrl.startsWith('//')) {
        this.validUrl = targetUrl;
        return;
      }

      const parsed = new URL(targetUrl);
      const isAllowed = SafeRedirectTarget.ALLOWED_ORIGINS.some(
        (origin) => parsed.origin.toLowerCase() === origin.toLowerCase()
      );

      this.validUrl = isAllowed ? parsed.toString() : fallback;
    } catch {
      this.validUrl = fallback;
    }
  }

  public get url(): string {
    return this.validUrl;
  }
}
