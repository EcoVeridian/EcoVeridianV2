/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Navigate, Outlet } from 'react-router-dom';
import { Loader2, ShieldX } from 'lucide-react';
import { useAuth } from './AuthContext';

export default function RequireAdmin() {
  const { user, admin, loading, signOutUser } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!admin) {
    // Signed in, but the account has no admin doc and no claimable invite.
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface px-5">
        <div className="max-w-md w-full border-[0.5px] border-outline-variant bg-surface-container-low p-8 rounded-[2px] text-center">
          <ShieldX className="w-10 h-10 text-error mx-auto mb-4 stroke-[1.5]" />
          <h1 className="font-serif text-2xl font-bold text-primary mb-2">No Admin Access</h1>
          <p className="font-sans text-sm text-on-surface-variant leading-relaxed mb-6">
            The account <span className="font-semibold text-primary">{user.email}</span> is signed in
            but has no admin access. Ask an owner to invite this email, then sign in again.
          </p>
          <button
            onClick={() => signOutUser()}
            className="px-6 py-2.5 bg-primary text-on-primary font-mono text-xs uppercase tracking-widest font-semibold rounded-[2px] hover:bg-primary-container transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
