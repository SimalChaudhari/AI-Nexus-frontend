import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

// User Profile & Account (for regular users - User role)
const UserProfilePage = lazy(() => import('src/pages/user/profile'));

// Dashboard User Pages (legacy routes)
const UserProfileOwnPage = lazy(() => import('src/pages/dashboard/user/profile-own'));
const UserCardsPage = lazy(() => import('src/pages/dashboard/user/cards'));
const UserAccountPage = lazy(() => import('src/pages/dashboard/user/account'));

// ----------------------------------------------------------------------`

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

// ----------------------------------------------------------------------

/**
 * User Routes - Accessible to all authenticated users (not just Admin)
 * These routes use AuthGuard only, not RoleBasedGuard, so any authenticated user can access them
 */
export const userRoutes = [
  // Root level user profile route: /user/profile (for regular users)
  {
    path: 'user',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      { path: 'profile', element: <UserProfilePage /> },
    ],
  },
  // Dashboard user routes: /dashboard/user/*
  {
    path: 'dashboard',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      {
        path: 'user',
        children: [
          { element: <UserProfileOwnPage />, index: true },
          { path: 'profile', element: <UserProfileOwnPage /> },
          { path: 'cards', element: <UserCardsPage /> },
          { path: 'account', element: <UserAccountPage /> },
        ],
      },
    ],
  },
];

