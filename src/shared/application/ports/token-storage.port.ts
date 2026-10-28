import type { TokenPair } from '../../domain/models/identity.model';

export interface TokenStoragePort {
  getTokens(): TokenPair | null;
  setTokens(tokens: TokenPair): void;
  clearTokens(): void;
  getDeviceFingerprint(): string;
}
