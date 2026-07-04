/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, FormEvent } from 'react';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { Loader2, AlertTriangle, ShieldCheck, Lock, Plus, Trash2 } from 'lucide-react';
import { adminDb } from '../../lib/firebaseAdmin';
import { useAuth } from '../../AuthContext';
import { RoleDoc, PermissionKey, PermissionMap, ALL_PERMISSIONS, AdminDoc, AdminInviteDoc } from '../../../types';
import { PERMISSION_INFO } from '../../lib/permissions';
import ConfirmDialog from '../../components/ConfirmDialog';
import SaveToast from '../../components/SaveToast';

type RoleRow = RoleDoc & { id: string };

type LoadState = { phase: 'loading' } | { phase: 'ready' } | { phase: 'error'; message: string };

const emptyPermissions = (): PermissionMap =>
  Object.fromEntries(ALL_PERMISSIONS.map((p) => [p, false])) as PermissionMap;

const kebab = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export default function Roles() {
  const { admin } = useAuth();
  const [roles, setRoles] = useState<RoleRow[]>([]);
  // Role ids currently assigned to an admin or a pending invite (blocks delete).
  const [rolesInUse, setRolesInUse] = useState<Set<string>>(new Set());
  const [state, setState] = useState<LoadState>({ phase: 'loading' });
  const [dirtyIds, setDirtyIds] = useState<Set<string>>(new Set());
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<RoleRow | null>(null);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [createError, setCreateError] = useState<string | null>(null);

  const refresh = async () => {
    try {
      const db = adminDb();
      const [roleSnap, adminSnap, inviteSnap] = await Promise.all([
        getDocs(collection(db, 'roles')),
        getDocs(collection(db, 'admins')),
        getDocs(collection(db, 'adminInvites')),
      ]);
      setRoles(
        roleSnap.docs
          .map((d) => ({ id: d.id, ...(d.data() as RoleDoc) }))
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name)),
      );
      setRolesInUse(
        new Set([
          ...adminSnap.docs.map((d) => (d.data() as AdminDoc).role),
          ...inviteSnap.docs.map((d) => (d.data() as AdminInviteDoc).role),
        ]),
      );
      setDirtyIds(new Set());
      setState({ phase: 'ready' });
    } catch (err) {
      setState({ phase: 'error', message: err instanceof Error ? err.message : 'Failed to load roles' });
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toast = () => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

  const updateRole = (id: string, patch: Partial<RoleDoc>) => {
    setRoles((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    setDirtyIds((prev) => new Set(prev).add(id));
  };

  const togglePermission = (role: RoleRow, perm: PermissionKey) => {
    updateRole(role.id, {
      permissions: { ...role.permissions, [perm]: !role.permissions[perm] },
    });
  };

  const handleSave = async (role: RoleRow) => {
    setBusyId(role.id);
    try {
      const db = adminDb();
      const { id, ...data } = role;
      // No merge: permissions is a map — merge would keep removed keys around.
      await setDoc(doc(db, 'roles', id), { ...data, updatedAt: serverTimestamp() });
      setDirtyIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      toast();
    } catch (err) {
      setState({ phase: 'error', message: err instanceof Error ? err.message : 'Failed to save role' });
    } finally {
      setBusyId(null);
    }
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    const id = kebab(newName);
    if (!id) {
      setCreateError('Enter a role name.');
      return;
    }
    if (roles.some((r) => r.id === id)) {
      setCreateError(`A role with the id "${id}" already exists.`);
      return;
    }
    setCreateError(null);
    setBusyId('new');
    try {
      const db = adminDb();
      const role: RoleDoc = {
        name: newName.trim(),
        description: newDescription.trim(),
        permissions: emptyPermissions(),
        builtIn: false,
        order: roles.length,
      };
      await setDoc(doc(db, 'roles', id), { ...role, updatedAt: serverTimestamp() });
      setNewName('');
      setNewDescription('');
      toast();
      await refresh();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create role');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setBusyId(deleteTarget.id);
    try {
      const db = adminDb();
      await deleteDoc(doc(db, 'roles', deleteTarget.id));
      toast();
      await refresh();
    } catch (err) {
      setState({ phase: 'error', message: err instanceof Error ? err.message : 'Failed to delete role' });
    } finally {
      setBusyId(null);
      setDeleteTarget(null);
    }
  };

  if (state.phase === 'loading') {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 text-outline animate-spin" />
      </div>
    );
  }

  if (state.phase === 'error') {
    return (
      <p className="font-sans text-sm text-error flex items-center gap-2 py-8">
        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
        {state.message}
      </p>
    );
  }

  const isOwnerRole = (role: RoleRow) => role.id === 'owner';

  return (
    <div className="animate-fade-in">
      <header className="mb-8 border-b-[0.5px] border-outline-variant pb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-secondary font-bold mb-2">Access</p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-secondary stroke-[1.5]" />
          Roles
        </h1>
        <p className="font-sans text-sm text-on-surface-variant mt-2 leading-relaxed max-w-xl">
          Define what each role can do, then assign roles in Admin Users. Changes take effect the
          next time a person loads the admin panel. The Owner role is fixed at full access, and
          only owners can assign it.
        </p>
      </header>

      <div className="flex flex-col gap-6 max-w-3xl">
        {roles.map((role) => {
          const locked = isOwnerRole(role);
          const inUse = rolesInUse.has(role.id);
          const dirty = dirtyIds.has(role.id);
          return (
            <div
              key={role.id}
              className="border-[0.5px] border-outline-variant bg-surface-container-lowest p-5 rounded-[2px]"
            >
              <div className="flex items-start justify-between gap-4 mb-1">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-serif text-xl font-bold text-primary">{role.name}</h2>
                    <span className="font-mono text-[10px] uppercase tracking-wider border-[0.5px] border-secondary text-secondary px-1.5 py-0.5 rounded-sm">
                      {role.id}
                    </span>
                    {role.builtIn && (
                      <span className="font-mono text-[10px] uppercase tracking-wider border-[0.5px] border-outline text-on-surface-variant px-1.5 py-0.5 rounded-sm">
                        Built-in
                      </span>
                    )}
                    {locked && <Lock className="w-3.5 h-3.5 text-outline" />}
                  </div>
                </div>
                {!locked && !role.builtIn && (
                  <button
                    onClick={() => setDeleteTarget(role)}
                    disabled={busyId !== null || inUse}
                    title={inUse ? 'In use by an admin or invite — reassign them first' : 'Delete role'}
                    className="p-2 border-[0.5px] border-outline rounded-[2px] text-on-surface-variant hover:border-error hover:text-error transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4 stroke-[1.5]" />
                  </button>
                )}
              </div>

              {locked ? (
                <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                  {role.description || 'Full control, including admin users, roles, and settings.'}{' '}
                  This role always has every permission and cannot be changed.
                </p>
              ) : (
                <>
                  <input
                    value={role.description}
                    onChange={(e) => updateRole(role.id, { description: e.target.value })}
                    placeholder="Short description of who this role is for..."
                    className="w-full bg-transparent border-b-[0.5px] border-outline focus:outline-none focus:border-primary py-1.5 text-xs font-sans text-on-surface-variant mb-4"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mb-4">
                    {ALL_PERMISSIONS.map((perm) => (
                      <label key={perm} className="flex items-start gap-3 cursor-pointer group select-none">
                        <input
                          type="checkbox"
                          checked={role.permissions[perm] === true}
                          onChange={() => togglePermission(role, perm)}
                          className="mt-0.5 appearance-none w-4 h-4 border-[0.5px] border-outline rounded-sm checked:bg-primary checked:border-primary transition-colors cursor-pointer flex-shrink-0"
                        />
                        <span className="min-w-0">
                          <span
                            className={`block font-sans text-sm transition-colors ${
                              role.permissions[perm]
                                ? 'text-primary font-semibold'
                                : 'text-on-surface group-hover:text-primary'
                            }`}
                          >
                            {PERMISSION_INFO[perm].label}
                          </span>
                          <span className="block font-sans text-[11px] text-on-surface-variant leading-snug">
                            {PERMISSION_INFO[perm].description}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                  <div className="flex items-center justify-between border-t-[0.5px] border-outline-variant pt-3">
                    <span className="font-sans text-xs text-secondary">
                      {dirty ? 'Unsaved changes' : ''}
                    </span>
                    <button
                      onClick={() => handleSave(role)}
                      disabled={!dirty || busyId !== null}
                      className="px-5 py-2 bg-primary text-on-primary font-mono text-[11px] uppercase tracking-widest font-semibold rounded-[2px] hover:bg-primary-container transition-colors cursor-pointer disabled:opacity-40"
                    >
                      {busyId === role.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}

        {/* Create new role */}
        <form
          onSubmit={handleCreate}
          className="border-[0.5px] border-outline-variant bg-surface-container-low p-5 rounded-[2px]"
        >
          <h2 className="font-serif text-lg font-bold text-primary mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-secondary stroke-[1.5]" />
            New Role
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
            <div className="flex flex-col flex-grow">
              <label className="font-mono text-xs text-on-surface-variant mb-2 uppercase font-bold" htmlFor="role-name">
                Name
              </label>
              <input
                id="role-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Inbox Manager"
                className="bg-transparent border-b-[0.5px] border-outline focus:outline-none focus:border-primary py-2 text-sm font-sans"
              />
            </div>
            <div className="flex flex-col flex-grow">
              <label className="font-mono text-xs text-on-surface-variant mb-2 uppercase font-bold" htmlFor="role-desc">
                Description
              </label>
              <input
                id="role-desc"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="What is this role for?"
                className="bg-transparent border-b-[0.5px] border-outline focus:outline-none focus:border-primary py-2 text-sm font-sans"
              />
            </div>
            <button
              type="submit"
              disabled={busyId !== null}
              className="px-5 py-2.5 bg-primary text-on-primary font-mono text-[11px] uppercase tracking-widest font-semibold rounded-[2px] hover:bg-primary-container transition-colors cursor-pointer disabled:opacity-60 flex-shrink-0"
            >
              Create
            </button>
          </div>
          <p className="font-sans text-[11px] text-outline mt-3">
            New roles start with no permissions — tick what they should be able to do, then Save.
          </p>
          {createError && (
            <p className="font-sans text-xs text-error mt-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              {createError}
            </p>
          )}
        </form>
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete role?"
        message={`The "${deleteTarget?.name ?? ''}" role will be permanently deleted. Anyone still assigned to it would lose all permissions, but deletion is blocked while it's in use.`}
        confirmLabel="Delete Role"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
      <SaveToast message="Saved" visible={toastVisible} />
    </div>
  );
}
