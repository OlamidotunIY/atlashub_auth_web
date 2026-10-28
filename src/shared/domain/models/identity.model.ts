export interface UserIdentity {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  country: string;
  phoneNumber?: string;
  activeEnvironment?: 'TEST' | 'LIVE';
  activeOrganizationId?: number | null;
}

export interface TokenPair {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
}

export interface LoginResult {
  status: 'AUTHENTICATED' | 'EMAIL_VERIFICATION_REQUIRED' | 'DEVICE_VERIFICATION_REQUIRED';
  tokens?: TokenPair;
  message?: string;
}

export interface ActiveSession {
  id: number;
  organizationId: number | null;
  environment: string;
  expiresAt: string;
  ipAddress: string;
  userAgent: string;
}

export interface TrustedDevice {
  id: number;
  deviceFingerprint: string;
  deviceName: string;
  lastSeenIp: string;
  trustedAt: string;
  expiresAt: string;
}
