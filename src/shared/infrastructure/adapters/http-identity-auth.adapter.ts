import type { AxiosInstance } from 'axios';
import type {
  IdentityAuthPort,
  LoginParams,
  RegisterIndividualParams,
  ResetPasswordParams,
  VerifyDeviceParams,
  VerifyEmailParams,
} from '../../application/ports/identity-auth.port';
import type { TokenStoragePort } from '../../application/ports/token-storage.port';
import type {
  ActiveSession,
  LoginResult,
  TokenPair,
  TrustedDevice,
  UserIdentity,
} from '../../domain/models/identity.model';

interface BackendApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errorCode?: string;
}

interface BackendLoginResponse {
  status: 'AUTHENTICATED' | 'EMAIL_VERIFICATION_REQUIRED' | 'DEVICE_VERIFICATION_REQUIRED';
  accessToken?: string;
  accessTokenExpiresAt?: string;
  refreshToken?: string;
  refreshTokenExpiresAt?: string;
  message?: string;
}

interface BackendRefreshResponse {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
}

export class HttpIdentityAuthAdapter implements IdentityAuthPort {
  constructor(
    private readonly http: AxiosInstance,
    private readonly storage: TokenStoragePort
  ) {}

  async registerIndividual(params: RegisterIndividualParams): Promise<void> {
    await this.http.post<BackendApiResponse<unknown>>('/api/v1/register', {
      firstName: params.firstName.trim(),
      lastName: params.lastName.trim(),
      email: params.email.trim().toLowerCase(),
      password: params.password,
      country: params.country.trim().toUpperCase(),
    });
  }

  async login(params: LoginParams): Promise<LoginResult> {
    const res = await this.http.post<BackendApiResponse<BackendLoginResponse>>('/api/v1/login', {
      email: params.email.trim().toLowerCase(),
      password: params.password,
      deviceFingerprint: params.deviceFingerprint,
    });

    const data = res.data.data;
    if (data.status === 'AUTHENTICATED' && data.accessToken && data.refreshToken) {
      const tokens: TokenPair = {
        accessToken: data.accessToken,
        accessTokenExpiresAt: data.accessTokenExpiresAt || '',
        refreshToken: data.refreshToken,
        refreshTokenExpiresAt: data.refreshTokenExpiresAt || '',
      };
      this.storage.setTokens(tokens);
      return {
        status: 'AUTHENTICATED',
        tokens,
        message: data.message,
      };
    }

    return {
      status: data.status,
      message: data.message,
    };
  }

  async verifyEmail(params: VerifyEmailParams): Promise<void> {
    await this.http.post<BackendApiResponse<void>>('/api/v1/email/verify', {
      email: params.email.trim().toLowerCase(),
      otp: params.otp.trim(),
    });
  }

  async resendVerificationEmail(email: string): Promise<void> {
    await this.http.post<BackendApiResponse<void>>('/api/v1/email/resend-verification', {
      email: email.trim().toLowerCase(),
    });
  }

  async forgotPassword(email: string): Promise<void> {
    await this.http.post<BackendApiResponse<void>>('/api/v1/password/forgot', {
      email: email.trim().toLowerCase(),
    });
  }

  async resetPassword(params: ResetPasswordParams): Promise<void> {
    await this.http.post<BackendApiResponse<void>>('/api/v1/password/reset', {
      email: params.email.trim().toLowerCase(),
      otp: params.otp.trim(),
      newPassword: params.newPassword,
    });
  }

  async verifyDevice(params: VerifyDeviceParams): Promise<void> {
    await this.http.post<BackendApiResponse<void>>('/api/v1/devices/verify', {
      email: params.email.trim().toLowerCase(),
      otp: params.otp.trim(),
      deviceFingerprint: params.deviceFingerprint,
    });
  }

  async refreshToken(refreshToken: string, deviceFingerprint: string): Promise<TokenPair> {
    const res = await this.http.post<BackendApiResponse<BackendRefreshResponse>>('/api/v1/refresh', {
      refreshToken,
      deviceFingerprint,
    });
    const tokens: TokenPair = {
      accessToken: res.data.data.accessToken,
      accessTokenExpiresAt: res.data.data.accessTokenExpiresAt,
      refreshToken: res.data.data.refreshToken,
      refreshTokenExpiresAt: res.data.data.refreshTokenExpiresAt,
    };
    this.storage.setTokens(tokens);
    return tokens;
  }

  async getMe(): Promise<UserIdentity> {
    const res = await this.http.get<BackendApiResponse<any>>('/api/v1/me');
    const u = res.data.data;
    return {
      id: String(u.id),
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      country: u.country,
      phoneNumber: u.phone,
      activeEnvironment: u.activeEnvironment,
      activeOrganizationId: u.activeOrganization?.id ?? null,
    };
  }

  async getActiveSessions(): Promise<ActiveSession[]> {
    const res = await this.http.get<BackendApiResponse<ActiveSession[]>>('/api/v1/sessions');
    return res.data.data || [];
  }

  async getTrustedDevices(): Promise<TrustedDevice[]> {
    const res = await this.http.get<BackendApiResponse<TrustedDevice[]>>('/api/v1/devices');
    return res.data.data || [];
  }

  async revokeDevice(deviceId: number): Promise<void> {
    await this.http.delete<BackendApiResponse<void>>(`/api/v1/devices?id=${deviceId}`);
  }

  async logout(): Promise<void> {
    try {
      await this.http.post<BackendApiResponse<void>>('/api/v1/logout');
    } finally {
      this.storage.clearTokens();
    }
  }

  async logoutAll(): Promise<void> {
    try {
      await this.http.post<BackendApiResponse<void>>('/api/v1/logout-all');
    } finally {
      this.storage.clearTokens();
    }
  }
}
