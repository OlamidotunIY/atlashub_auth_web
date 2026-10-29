import type { ActiveSession, LoginResult, TokenPair, TrustedDevice, UserIdentity } from '../../domain/models/identity.model';

export interface RegisterIndividualParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  country: string;
}

export interface LoginParams {
  email: string;
  password: string;
  deviceFingerprint: string;
}

export interface VerifyEmailParams {
  email: string;
  otp: string;
}

export interface ResetPasswordParams {
  email: string;
  otp: string;
  newPassword: string;
}

export interface VerifyDeviceParams {
  email: string;
  otp: string;
  deviceFingerprint: string;
}

export interface AuthorizeOAuthParams {
  clientId: string;
  redirectUri: string;
  responseType: string;
  codeChallenge: string;
  codeChallengeMethod: string;
  state?: string;
  scope?: string;
  accessToken?: string;
}

export interface AuthorizeOAuthResult {
  code: string;
  state?: string;
  redirectUri: string;
}

export interface IdentityAuthPort {
  registerIndividual(params: RegisterIndividualParams): Promise<void>;
  login(params: LoginParams): Promise<LoginResult>;
  verifyEmail(params: VerifyEmailParams): Promise<void>;
  resendVerificationEmail(email: string): Promise<void>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(params: ResetPasswordParams): Promise<void>;
  verifyDevice(params: VerifyDeviceParams): Promise<void>;
  refreshToken(refreshToken: string, deviceFingerprint: string): Promise<TokenPair>;
  getMe(): Promise<UserIdentity>;
  getActiveSessions(): Promise<ActiveSession[]>;
  getTrustedDevices(): Promise<TrustedDevice[]>;
  revokeDevice(deviceId: number): Promise<void>;
  logout(): Promise<void>;
  logoutAll(): Promise<void>;
  authorizeOAuth(params: AuthorizeOAuthParams): Promise<AuthorizeOAuthResult>;
}
