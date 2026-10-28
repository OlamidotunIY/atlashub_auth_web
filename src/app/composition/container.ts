import type { IdentityAuthPort } from '../../shared/application/ports/identity-auth.port';
import type { TokenStoragePort } from '../../shared/application/ports/token-storage.port';
import { HttpIdentityAuthAdapter } from '../../shared/infrastructure/adapters/http-identity-auth.adapter';
import { createApiClient } from '../../shared/infrastructure/http/api-client';
import { LocalTokenStorage } from '../../shared/infrastructure/storage/local-token-storage';

export interface ServiceContainer {
  tokenStorage: TokenStoragePort;
  authService: IdentityAuthPort;
}

export function createServiceContainer(): ServiceContainer {
  const tokenStorage = new LocalTokenStorage();
  const http = createApiClient(tokenStorage);
  const authService = new HttpIdentityAuthAdapter(http, tokenStorage);

  return {
    tokenStorage,
    authService,
  };
}

export const container = createServiceContainer();
