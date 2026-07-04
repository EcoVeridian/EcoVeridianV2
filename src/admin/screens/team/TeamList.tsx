/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { Loader2, AlertTriangle, Plus, ArrowUp, ArrowDown, Pencil, Trash2, UsersRound } from 'lucide-react';
import { adminDb } from '../../lib/firebaseAdmin';
import { TeamMemberDoc } from '../../../types';
import ConfirmDialog from '../../components/ConfirmDialog';

type LoadState = { phase: 'loading' } | { phase: 'ready' } | { phase: 'error'; message: string };

export default function TeamList() {
  const [members, setMembers] = useState<TeamMemberDoc[]>([]);
  const [state, setState] = useState<LoadState>({ phase: 'loading' });
  const [deleteTarget, setDeleteTarget] = useState<TeamMemberDoc | null>(null);
  const [busySlug, setBusySlug] = useState<string | null>(null);

  const load = async () => {
    setState({ phase: 'loading' });
    try {
      const db = adminDb();
      const snap = await getDocs(collection(db, 'team'));
      const docs = snap.docs.map((d) => d.data() as TeamMemberDoc);
      docs.sort((a, b) => a.order - b.order);
      setMembers(docs);
      setState({ phase: 'ready' });
    } catch (err) {
      setState({ phase: 'error', message: err instanceof Error ? err.message : 'Failed to load team members' });
    }
  };

  useEffect(() => {
    load();
  }, []);

  const swap = async (index: number, otherIndex: number) => {
    if (otherIndex < 0 || otherIndex >= members.length) return;
    const a = members[index];
    const b = members[otherIndex];
    setBusySlug(a.slug);
    try {
      const db = adminDb();
      await Promise.all([
        setDoc(doc(db, 'team', a.slug), { order: b.order, updatedAt: serverTimestamp() }, { merge: true }),
        setDoc(doc(db, 'team', b.slug), { order: a.order, updatedAt: serverTimestamp() }, { merge: true }),
      ]);
      const next = [...members];
      next[index] = { ...a, order: b.order };
      next[otherIndex] = { ...b, order: a.order };
      next.sort((x, y) => x.order - y.order);
      setMembers(next);
    } catch (err) {
      setState({ phase: 'error', message: err instanceof Error ? err.message : 'Failed to reorder' });
    } finally {
      setBusySlug(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setBusySlug(deleteTarget.slug);
    try {
      const db = adminDb();
      await deleteDoc(doc(db, 'team', deleteTarget.slug));
      setMembers((prev) => prev.filter((m) => m.slug !== deleteTarget.slug));
    } catch (err) {
      setState({ phase: 'error', message: err instanceof Error ? err.message : 'Failed to delete' });
    } finally {
      setBusySlug(null);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="animate-fade-in">
      <header className="mb-8 border-b-[0.5px] border-outline-variant pb-6 flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-secondary font-bold mb-2">Content</p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary flex items-center gap-3">
            <UsersRound className="w-8 h-8 text-secondary stroke-[1.5]" />
            Team
          </h1>
          <p className="font-sans text-sm text-on-surface-variant mt-2 leading-relaxed max-w-xl">
            The people shown on the About page. Hidden members are kept in the CMS but not shown on
            the public site.
          </p>
        </div>
        <Link
          to="/admin/team/new"
          className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary font-mono text-[11px] uppercase tracking-widest font-semibold rounded-[2px] hover:bg-primary-container transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[1.5]" />
          New Member
        </Link>
      </header>

      {state.phase === 'loading' && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-outline animate-spin" />
        </div>
      )}

      {state.phase === 'error' && (
        <p className="font-sans text-sm text-error flex items-center gap-2 py-8">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          {state.message}
        </p>
      )}

      {state.phase === 'ready' && members.length === 0 && (
        <p className="font-sans text-sm text-on-surface-variant py-8">
          No team members yet — create one or run Import Defaults.
        </p>
      )}

      {state.phase === 'ready' && members.length > 0 && (
        <div className="flex flex-col gap-3">
          {members.map((member, index) => (
            <div
              key={member.slug}
              className="border-[0.5px] border-outline-variant bg-surface-container-lowest p-4 rounded-[2px] flex items-center gap-4"
            >
              <div className="min-w-0 flex-grow">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h2 className="font-serif font-bold text-primary truncate">{member.name || '(untitled)'}</h2>
                  <span className="font-mono text-[10px] uppercase tracking-wider border-[0.5px] border-secondary text-secondary px-1.5 py-0.5 rounded-sm flex-shrink-0">
                    {member.slug}
                  </span>
                  <span
                    className={`font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm flex-shrink-0 ${
                      member.visible
                        ? 'bg-primary-fixed text-on-primary-fixed'
                        : 'bg-surface-variant text-on-surface-variant'
                    }`}
                  >
                    {member.visible ? 'Visible' : 'Hidden'}
                  </span>
                </div>
                <p className="font-sans text-xs text-on-surface-variant">{member.role}</p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => swap(index, index - 1)}
                  disabled={index === 0 || busySlug !== null}
                  className="p-1.5 border-[0.5px] border-outline rounded-[2px] hover:border-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  aria-label="Move up"
                >
                  <ArrowUp className="w-3.5 h-3.5 stroke-[1.5]" />
                </button>
                <button
                  onClick={() => swap(index, index + 1)}
                  disabled={index === members.length - 1 || busySlug !== null}
                  className="p-1.5 border-[0.5px] border-outline rounded-[2px] hover:border-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  aria-label="Move down"
                >
                  <ArrowDown className="w-3.5 h-3.5 stroke-[1.5]" />
                </button>
                <Link
                  to={`/admin/team/${member.slug}`}
                  className="p-1.5 border-[0.5px] border-outline rounded-[2px] hover:border-primary hover:text-primary transition-colors cursor-pointer"
                  aria-label="Edit"
                >
                  <Pencil className="w-3.5 h-3.5 stroke-[1.5]" />
                </Link>
                <button
                  onClick={() => setDeleteTarget(member)}
                  className="p-1.5 border-[0.5px] border-outline rounded-[2px] hover:border-error hover:text-error transition-colors cursor-pointer"
                  aria-label="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete team member?"
        message={`This permanently deletes "${deleteTarget?.name ?? ''}" (${deleteTarget?.slug ?? ''}). This cannot be undone.`}
        confirmLabel="Delete"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
