/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode } from 'react';
import { Lock } from 'lucide-react';
import { PermissionKey } from '../types';
import { useAuth } from './AuthContext';
import { PERMISSION_INFO } from './lib/permissions';

/**
 * Screen-level permission gate. Security is enforced by the Firestore/Storage
 * rules regardless — this just gives users a clear message instead of a wall
 * of permission-denied errors.
 */
export default function RequirePermission({
  perm,
  children,
}: {
  perm: PermissionKey;
  children: ReactNode;
}) {
  const { can, admin } = useAuth();

  if (!can(perm)) {
    return (
      <div className="max-w-xl border-[0.5px] border-outline-variant bg-surface-container-low p-6 rounded-[2px] animate-fade-in">
        <h2 className="font-serif text-lg font-bold text-primary mb-2 flex items-center gap-2">
          <Lock className="w-5 h-5 text-secondary stroke-[1.5]" />
          Permission Needed
        </h2>
        <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
          Your role{admin ? ` (${admin.role})` : ''} doesn't include the{' '}
          <strong className="text-primary">{PERMISSION_INFO[perm].label}</strong> permission. Ask an
          owner to update your role if you need access.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
