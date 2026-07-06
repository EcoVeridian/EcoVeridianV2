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
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { Loader2, AlertTriangle, Users, ShieldCheck, MailPlus, Trash2, Lock, Pencil, Check, X } from 'lucide-react';
import { adminDb } from '../../lib/firebaseAdmin';
import { useAuth } from '../../AuthContext';
import { AdminDoc, AdminInviteDoc, AdminRole, RoleDoc } from '../../../types';
import ConfirmDialog from '../../components/ConfirmDialog';
import SaveToast from '../../components/SaveToast';

type AdminRow = AdminDoc & { uid: string };
type InviteRow = AdminInviteDoc & { email: string };
type RoleOption = { id: string; name: string };

type LoadState = { phase: 'loading' } | { phase: 'ready' } | { phase: 'error'; message: string };

export default function AdminUsers() {
  const { user, admin, can } = useAuth();
  const [admins, setAdmins] = useState<AdminRow[]>([]);
  const [invites, setInvites] = useState<InviteRow[]>([]);
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [state, setState] = useState<LoadState>({ phase: 'loading' });
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<AdminRole>('editor');
  const [busy, setBusy] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<AdminRow | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState('');

  const isOwner = admin?.role === 'owner';
  const canManage = can('users');
  // Mirrors the rules: only actual owners can grant the owner role.
  const assignableRoles = roles.filter((r) => r.id !== 'owner' || isOwner);

  const toast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

  const refresh = async () => {
    try {
      const db = adminDb();
      const [adminSnap, inviteSnap, roleSnap] = await Promise.all([
        getDocs(collection(db, 'admins')),
        getDocs(collection(db, 'adminInvites')),
        getDocs(collection(db, 'roles')),
      ]);
      setAdmins(adminSnap.docs.map((d) => ({ uid: d.id, ...(d.data() as AdminDoc) })));
      setInvites(inviteSnap.docs.map((d) => ({ email: d.id, ...(d.data() as AdminInviteDoc) })));
      const roleRows = roleSnap.docs
        .map((d) => ({ id: d.id, ...(d.data() as RoleDoc) }))
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name))
        .map((r) => ({ id: r.id, name: r.name }));
      // Roles may not be seeded yet (fresh install) — fall back to built-ins.
      setRoles(roleRows.length > 0 ? roleRows : [{ id: 'owner', name: 'Owner' }, { id: 'editor', name: 'Editor' }]);
      setState({ phase: 'ready' });
    } catch (err) {
      setState({ phase: 'error', message: err instanceof Error ? err.message : 'Failed to load admins' });
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInvite = async (e: FormEvent) => {
    e.preventDefault();
    const email = inviteEmail.trim().toLowerCase();
    if (!email.includes('@')) {
      setFormError('Enter a valid email address.');
      return;
    }
    if (admins.some((a) => a.email === email)) {
      setFormError('That email is already an admin.');
      return;
    }
    setFormError(null);
    setBusy(true);
    try {
      const db = adminDb();
      await setDoc(doc(db, 'adminInvites', email), {
        role: inviteRole,
        invitedBy: admin?.email ?? '',
        createdAt: serverTimestamp(),
      });
      setInviteEmail('');
      toast('Invite created');
      await refresh();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to create invite');
    } finally {
      setBusy(false);
    }
  };

  const handleRoleChange = async (row: AdminRow, role: AdminRole) => {
    setBusy(true);
    try {
      const db = adminDb();
      await updateDoc(doc(db, 'admins', row.uid), { role, updatedAt: serverTimestamp() });
      toast('Role updated');
      await refresh();
    } catch (err) {
      setState({ phase: 'error', message: err instanceof Error ? err.message : 'Failed to update role' });
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async () => {
    if (!removeTarget) return;
    setBusy(true);
    try {
      const db = adminDb();
      await deleteDoc(doc(db, 'admins', removeTarget.uid));
      toast('Admin access removed');
      await refresh();
    } catch (err) {
      setState({ phase: 'error', message: err instanceof Error ? err.message : 'Failed to remove admin' });
    } finally {
      setBusy(false);
      setRemoveTarget(null);
    }
  };

  const handleRevokeInvite = async (email: string) => {
    setBusy(true);
    try {
      const db = adminDb();
      await deleteDoc(doc(db, 'adminInvites', email));
      toast('Invite revoked');
      await refresh();
    } catch (err) {
      setState({ phase: 'error', message: err instanceof Error ? err.message : 'Failed to revoke invite' });
    } finally {
      setBusy(false);
    }
  };

  const startEditName = (row: AdminRow) => {
    setNameDraft(row.displayName);
    setEditingName(true);
  };

  const handleSaveName = async () => {
    const name = nameDraft.trim();
    if (!user || !name) return;
    setBusy(true);
    try {
      const db = adminDb();
      await updateDoc(doc(db, 'admins', user.uid), { displayName: name });
      toast('Name updated');
      setEditingName(false);
      await refresh();
    } catch (err) {
      setState({ phase: 'error', message: err instanceof Error ? err.message : 'Failed to update name' });
    } finally {
      setBusy(false);
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

  return (
    <div className="animate-fade-in">
      <header className="mb-8 border-b-[0.5px] border-outline-variant pb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-secondary font-bold mb-2">Access</p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary flex items-center gap-3">
          <Users className="w-8 h-8 text-secondary stroke-[1.5]" />
          Admin Users
        </h1>
        <p className="font-sans text-sm text-on-surface-variant mt-2 leading-relaxed max-w-xl">
          Assign each teammate a role — what a role can do is defined on the{' '}
          <Link to="/admin/roles" className="text-primary underline hover:text-secondary transition-colors">
            Roles
          </Link>{' '}
          page. Invited teammates activate their account on the admin login page ("Activate
          Account" tab). Owner accounts can't be modified or removed by anyone, including other
          owners.
        </p>
      </header>

      {!canManage && (
        <div className="flex items-start gap-3 bg-secondary-container/20 border-[0.5px] border-secondary/40 p-4 rounded-[2px] text-sm font-sans text-on-surface-variant max-w-xl mb-8">
          <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0 text-secondary" />
          <span>You can view this list, but your role can't invite, change roles, or remove access.</span>
        </div>
      )}

      {/* Current admins */}
      <section className="max-w-2xl mb-10">
        <h2 className="font-serif text-xl font-bold text-primary mb-4">Team Access</h2>
        <div className="flex flex-col gap-3">
          {admins.map((row) => {
            const isSelf = row.uid === user?.uid;
            return (
              <div
                key={row.uid}
                className="border-[0.5px] border-outline-variant bg-surface-container-lowest p-4 rounded-[2px] flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  {isSelf && editingName ? (
                    <div className="flex items-center gap-1.5 mb-1">
                      <input
                        autoFocus
                        value={nameDraft}
                        onChange={(e) => setNameDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveName();
                          if (e.key === 'Escape') setEditingName(false);
                        }}
                        className="font-sans text-sm font-semibold text-primary bg-transparent border-[0.5px] border-primary rounded-[2px] px-1.5 py-0.5 min-w-0 focus:outline-none"
                      />
                      <button
                        onClick={handleSaveName}
                        disabled={busy || !nameDraft.trim()}
                        className="p-1 text-primary hover:text-secondary transition-colors cursor-pointer flex-shrink-0"
                        title="Save name"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingName(false)}
                        disabled={busy}
                        className="p-1 text-on-surface-variant hover:text-error transition-colors cursor-pointer flex-shrink-0"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <p className="font-sans text-sm font-semibold text-primary truncate flex items-center gap-1.5">
                      {row.displayName}
                      {isSelf && <span className="text-outline font-normal"> (you)</span>}
                      {isSelf && (
                        <button
                          onClick={() => startEditName(row)}
                          className="p-0.5 text-on-surface-variant hover:text-primary transition-colors cursor-pointer flex-shrink-0"
                          title="Edit your display name"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                      )}
                    </p>
                  )}
                  <p className="font-sans text-xs text-on-surface-variant truncate">{row.email}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {/* Owner accounts are untouchable (enforced in rules too). */}
                  {canManage && !isSelf && row.role !== 'owner' ? (
                    <>
                      <select
                        value={row.role}
                        onChange={(e) => handleRoleChange(row, e.target.value as AdminRole)}
                        disabled={busy}
                        className="bg-transparent border-[0.5px] border-outline rounded-[2px] px-2 py-1.5 font-mono text-[11px] uppercase tracking-wider cursor-pointer focus:outline-none focus:border-primary"
                      >
                        {assignableRoles.map((r) => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                        {!assignableRoles.some((r) => r.id === row.role) && (
                          <option value={row.role}>{row.role}</option>
                        )}
                      </select>
                      <button
                        onClick={() => setRemoveTarget(row)}
                        disabled={busy}
                        className="p-2 border-[0.5px] border-outline rounded-[2px] text-on-surface-variant hover:border-error hover:text-error transition-colors cursor-pointer"
                        title="Remove admin access"
                      >
                        <Trash2 className="w-4 h-4 stroke-[1.5]" />
                      </button>
                    </>
                  ) : (
                    <span
                      className="font-mono text-[10px] uppercase tracking-wider border-[0.5px] border-outline px-2 py-1 rounded-sm flex items-center gap-1.5"
                      title={row.role === 'owner' && !isSelf ? 'Owner accounts cannot be modified' : undefined}
                    >
                      {row.role === 'owner' && !isSelf && <Lock className="w-3 h-3" />}
                      {roles.find((r) => r.id === row.role)?.name ?? row.role}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Invites */}
      <section className="max-w-2xl">
        <h2 className="font-serif text-xl font-bold text-primary mb-4">Pending Invites</h2>

        {canManage && (
          <form
            onSubmit={handleInvite}
            className="border-[0.5px] border-outline-variant bg-surface-container-low p-4 rounded-[2px] mb-4 flex flex-col sm:flex-row gap-3 sm:items-end"
          >
            <div className="flex flex-col flex-grow">
              <label className="font-mono text-xs text-on-surface-variant mb-2 uppercase font-bold" htmlFor="invite-email">
                Email
              </label>
              <input
                id="invite-email"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="teammate@example.com"
                className="bg-transparent border-b-[0.5px] border-outline focus:outline-none focus:border-primary py-2 text-sm font-sans"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-mono text-xs text-on-surface-variant mb-2 uppercase font-bold" htmlFor="invite-role">
                Role
              </label>
              <select
                id="invite-role"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as AdminRole)}
                className="bg-transparent border-b-[0.5px] border-outline focus:outline-none focus:border-primary py-2 text-sm font-sans cursor-pointer"
              >
                {assignableRoles.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={busy}
              className="px-5 py-2.5 bg-primary text-on-primary font-mono text-[11px] uppercase tracking-widest font-semibold rounded-[2px] hover:bg-primary-container transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <MailPlus className="w-4 h-4" />
              Invite
            </button>
          </form>
        )}

        {formError && (
          <p className="font-sans text-xs text-error mb-4 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            {formError}
          </p>
        )}

        {invites.length === 0 ? (
          <p className="font-sans text-xs text-on-surface-variant">No pending invites.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {invites.map((invite) => (
              <div
                key={invite.email}
                className="border-[0.5px] border-outline-variant bg-surface-container-lowest p-4 rounded-[2px] flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="font-sans text-sm font-semibold text-primary truncate">{invite.email}</p>
                  <p className="font-sans text-xs text-on-surface-variant">
                    {roles.find((r) => r.id === invite.role)?.name ?? invite.role} · invited by{' '}
                    {invite.invitedBy || 'unknown'}
                  </p>
                </div>
                {canManage && (
                  <button
                    onClick={() => handleRevokeInvite(invite.email)}
                    disabled={busy}
                    className="px-4 py-2 border-[0.5px] border-outline rounded-[2px] font-mono text-[10px] uppercase tracking-wider text-on-surface-variant hover:border-error hover:text-error transition-colors cursor-pointer flex-shrink-0"
                  >
                    Revoke
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <ConfirmDialog
        open={removeTarget !== null}
        title="Remove admin access?"
        message={`${removeTarget?.email ?? ''} will immediately lose access to this panel. Their sign-in account itself is not deleted (that requires the Firebase console).`}
        confirmLabel="Remove Access"
        onCancel={() => setRemoveTarget(null)}
        onConfirm={handleRemove}
      />
      <SaveToast message={toastMessage} visible={toastVisible} />
    </div>
  );
}
