import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom';
import { AuthLayout } from '../shell/auth.layout';
import { LoginPage } from '../../features/login';
import { RegisterPage } from '../../features/registration';
import { VerifyEmailPage } from '../../features/email-verification';
import { ForgotPasswordPage, ResetPasswordPage } from '../../features/account-recovery';
import { DeviceVerificationPage } from '../../features/mfa-passkeys';
import { SessionsPage } from '../../features/sessions';
import { ConsentPage } from '../../features/authorization-consent';

const routeDefinitions: RouteObject[] = [
  {
    element: <AuthLayout />,
    children: [
      { path: '/', element: <Navigate to="/login" replace /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/verify-email', element: <VerifyEmailPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/reset-password', element: <ResetPasswordPage /> },
      { path: '/mfa', element: <DeviceVerificationPage /> },
      { path: '/devices/verify', element: <DeviceVerificationPage /> },
      { path: '/sessions', element: <SessionsPage /> },
      { path: '/consent', element: <ConsentPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/login" replace /> },
];

export const router = createBrowserRouter(routeDefinitions);
