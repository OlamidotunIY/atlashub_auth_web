import type { TokenStoragePort } from '../../application/ports/token-storage.port';
import type { TokenPair } from '../../domain/models/identity.model';

const TOKEN_KEY = 'atlashub_auth_tokens';
const FINGERPRINT_KEY = 'atlashub_device_fingerprint';

export class LocalTokenStorage implements TokenStoragePort {
  getTokens(): TokenPair | null {
    try {
      const raw = localStorage.getItem(TOKEN_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as TokenPair;
    } catch {
      return null;
    }
  }

  setTokens(tokens: TokenPair): void {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
  }

  clearTokens(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  getDeviceFingerprint(): string {
    let fp = localStorage.getItem(FINGERPRINT_KEY);
    if (!fp) {
      fp = `dev_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
      localStorage.setItem(FINGERPRINT_KEY, fp);
    }
    return fp;
  }
}
