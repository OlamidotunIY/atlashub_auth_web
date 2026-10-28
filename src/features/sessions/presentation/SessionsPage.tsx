import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { container } from '../../../app/composition/container';
import type {
  ActiveSession,
  TrustedDevice,
  UserIdentity,
} from '../../../shared/domain/models/identity.model';
import { Button, Card, CardHeader, CardTitle, CardContent } from '../../../shared/ui';
import { AuthErrorBanner } from '../../../shared/presentation/widgets';

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
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto py-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">AtlasHub Central Identity</h1>
          <p className="text-xs text-muted-foreground">Manage your sessions, devices, and profile</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Sign out
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleLogoutAll}
          >
            Sign out everywhere
          </Button>
        </div>
      </div>

      {error && <AuthErrorBanner error={error} />}

      {/* User Card */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Your Account</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      )}

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Active Sessions ({sessions.length})</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* Trusted Devices */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Trusted Devices ({devices.length})</CardTitle>
        </CardHeader>
        <CardContent>
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
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handleRevokeDevice(dev.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    Revoke
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
