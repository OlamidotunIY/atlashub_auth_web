import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { container } from '../../../app/composition/container';
import type {
  ActiveSession,
  TrustedDevice,
  UserIdentity,
} from '../../../shared/domain/models/identity.model';
import { Alert } from '../../../shared/presentation/components/Alert';
import { AuthButton } from '../../../shared/presentation/components/AuthButton';

export function SessionsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserIdentity | null>(null);
  const [sessions, setSessions] = useState<ActiveSession[]>([]);
  const [devices, setDevices] = useState<TrustedDevice[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [u, s, d] = await Promise.all([
        container.authService.getMe(),
        container.authService.getActiveSessions(),
        container.authService.getTrustedDevices(),
      ]);
      setUser(u);
      setSessions(s);
      setDevices(d);
    } catch (err: any) {
      setError(err?.message || 'Failed to load session details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = async () => {
    try {
      await container.authService.logout();
      navigate('/login');
    } catch (err: any) {
      setError(err?.message || 'Logout failed.');
    }
  };

  const handleLogoutAll = async () => {
    if (!window.confirm('Are you sure you want to log out from all devices?')) return;
    try {
      await container.authService.logoutAll();
      navigate('/login');
    } catch (err: any) {
      setError(err?.message || 'Failed to revoke sessions.');
    }
  };

  const handleRevokeDevice = async (id: number) => {
    try {
      await container.authService.revokeDevice(id);
      setDevices((prev) => prev.filter((dev) => dev.id !== id));
    } catch (err: any) {
      setError(err?.message || 'Failed to revoke device.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-sm text-muted-foreground animate-pulse">Loading identity state...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black text-xl">
              A
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">AtlasHub Central Identity</h1>
              <p className="text-xs text-muted-foreground">Manage your sessions, devices, and profile</p>
            </div>
          </div>
          <div className="flex gap-2">
            <AuthButton variant="outline" onClick={handleLogout} className="w-auto h-9 text-xs">
              Sign out
            </AuthButton>
            <AuthButton
              variant="secondary"
              onClick={handleLogoutAll}
              className="w-auto h-9 text-xs text-destructive hover:bg-destructive/10"
            >
              Sign out everywhere
            </AuthButton>
          </div>
        </div>

        {error && <Alert type="error">{error}</Alert>}

        {/* User Card */}
        {user && (
          <div className="bg-card border border-border rounded-xl p-5 shadow-xs">
            <h2 className="text-sm font-semibold text-foreground mb-3">Your Account</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-muted-foreground block">Full Name</span>
                <span className="font-medium text-foreground text-sm">
                  {user.firstName} {user.lastName}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block">Email</span>
                <span className="font-medium text-foreground text-sm">{user.email}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Country</span>
                <span className="font-medium text-foreground">{user.country}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Active Organization</span>
                <span className="font-medium text-foreground">
                  {user.activeOrganizationId ? `Org #${user.activeOrganizationId}` : 'None (No active business)'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Active Sessions */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-xs">
          <h2 className="text-sm font-semibold text-foreground mb-3">Active Sessions ({sessions.length})</h2>
          <div className="flex flex-col divide-y divide-border text-xs">
            {sessions.map((s) => (
              <div key={s.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium text-foreground">
                    {s.userAgent || 'Unknown Device / Browser'}
                  </div>
                  <div className="text-muted-foreground mt-0.5">
                    IP: {s.ipAddress} • Env: {s.environment} • Expires: {new Date(s.expiresAt).toLocaleDateString()}
                  </div>
                </div>
                <span className="text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded text-[11px] font-medium">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Trusted Devices */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-xs">
          <h2 className="text-sm font-semibold text-foreground mb-3">Trusted Devices ({devices.length})</h2>
          {devices.length === 0 ? (
            <p className="text-xs text-muted-foreground">No recognized trusted devices on record.</p>
          ) : (
            <div className="flex flex-col divide-y divide-border text-xs">
              {devices.map((dev) => (
                <div key={dev.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-foreground">{dev.deviceName || 'Trusted Client'}</div>
                    <div className="text-muted-foreground mt-0.5">
                      Last seen: {dev.lastSeenIp} • Trusted on {new Date(dev.trustedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRevokeDevice(dev.id)}
                    className="text-destructive text-xs hover:underline cursor-pointer"
                  >
                    Revoke
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
