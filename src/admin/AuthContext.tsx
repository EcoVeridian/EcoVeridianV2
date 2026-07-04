/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
  AdminDoc,
  AdminInviteDoc,
  AdminRole,
  RoleDoc,
  PermissionKey,
  PermissionMap,
  ALL_PERMISSIONS,
} from '../types';
import { adminAuth, adminDb } from './lib/firebaseAdmin';

// This email may self-create its owner doc (mirrored in firestore.rules), so
// the very first admin needs no manual Firestore console work.
export const BOOTSTRAP_OWNER_EMAIL = 'risithcha@gmail.com';

interface AuthContextValue {
  user: User | null;
  admin: AdminDoc | null;
  /** Resolved capabilities for the signed-in admin's role. */
  permissions: PermissionMap;
  /** True when the admin's role grants the permission ('owner' grants all). */
  can: (perm: PermissionKey) => boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const NO_PERMISSIONS: PermissionMap = Object.fromEntries(
  ALL_PERMISSIONS.map((p) => [p, false]),
) as PermissionMap;

const ALL_GRANTED: PermissionMap = Object.fromEntries(
  ALL_PERMISSIONS.map((p) => [p, true]),
) as PermissionMap;

/**
 * Resolve a role id to its permission map. 'owner' is always all-permissions
 * (matches the rules' superuser short-circuit); unknown/missing roles fail
 * closed to no permissions.
 */
async function resolvePermissions(role: AdminRole): Promise<PermissionMap> {
  if (role === 'owner') return ALL_GRANTED;
  try {
    const snap = await getDoc(doc(adminDb(), 'roles', role));
    if (!snap.exists()) return NO_PERMISSIONS;
    const stored = (snap.data() as RoleDoc).permissions ?? {};
    return Object.fromEntries(
      ALL_PERMISSIONS.map((p) => [p, stored[p] === true]),
    ) as PermissionMap;
  } catch {
    return NO_PERMISSIONS;
  }
}

/**
 * Resolve the admin profile for a signed-in user. If the doc doesn't exist
 * yet, attempt self-claim (bootstrap owner or a pending invite); returns null
 * when the account simply isn't an admin.
 */
async function resolveAdminDoc(user: User): Promise<AdminDoc | null> {
  const db = adminDb();
  const ref = doc(db, 'admins', user.uid);

  // Reading a missing doc without admin rights throws permission-denied, so a
  // failed read means "not (yet) an admin", not a fatal error.
  try {
    const snap = await getDoc(ref);
    if (snap.exists()) return snap.data() as AdminDoc;
  } catch {
    /* fall through to self-claim */
  }

  const email = (user.email ?? '').toLowerCase();
  if (!email) return null;

  let role: AdminRole | null = null;
  if (email === BOOTSTRAP_OWNER_EMAIL) {
    role = 'owner';
  } else {
    try {
      const invite = await getDoc(doc(db, 'adminInvites', email));
      if (invite.exists()) role = (invite.data() as AdminInviteDoc).role;
    } catch {
      /* no invite readable → not invited */
    }
  }
  if (!role) return null;

  const adminDoc: AdminDoc = {
    email,
    displayName: user.displayName || email.split('@')[0],
    role,
  };
  try {
    await setDoc(ref, adminDoc);
    return adminDoc;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<AdminDoc | null>(null);
  const [permissions, setPermissions] = useState<PermissionMap>(NO_PERMISSIONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(adminAuth(), async (nextUser) => {
      setLoading(true);
      setUser(nextUser);
      const adminDoc = nextUser ? await resolveAdminDoc(nextUser) : null;
      setAdmin(adminDoc);
      setPermissions(adminDoc ? await resolvePermissions(adminDoc.role) : NO_PERMISSIONS);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value: AuthContextValue = {
    user,
    admin,
    permissions,
    can: (perm) => permissions[perm],
    loading,
    signIn: async (email, password) => {
      await signInWithEmailAndPassword(adminAuth(), email.trim(), password);
    },
    register: async (email, password) => {
      await createUserWithEmailAndPassword(adminAuth(), email.trim(), password);
    },
    resetPassword: async (email) => {
      await sendPasswordResetEmail(adminAuth(), email.trim());
    },
    signOutUser: async () => {
      await signOut(adminAuth());
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
