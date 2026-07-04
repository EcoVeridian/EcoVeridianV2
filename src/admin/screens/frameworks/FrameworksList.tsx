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
import { Loader2, AlertTriangle, Plus, ArrowUp, ArrowDown, Pencil, Trash2, Library } from 'lucide-react';
import { adminDb } from '../../lib/firebaseAdmin';
import { FrameworkDoc } from '../../../types';
import ConfirmDialog from '../../components/ConfirmDialog';

type LoadState = { phase: 'loading' } | { phase: 'ready' } | { phase: 'error'; message: string };

export default function FrameworksList() {
  const [frameworks, setFrameworks] = useState<FrameworkDoc[]>([]);
  const [state, setState] = useState<LoadState>({ phase: 'loading' });
  const [deleteTarget, setDeleteTarget] = useState<FrameworkDoc | null>(null);
  const [busySlug, setBusySlug] = useState<string | null>(null);

  const load = async () => {
    setState({ phase: 'loading' });
    try {
      const db = adminDb();
      const snap = await getDocs(collection(db, 'frameworks'));
      const docs = snap.docs.map((d) => d.data() as FrameworkDoc);
      docs.sort((a, b) => a.order - b.order);
      setFrameworks(docs);
      setState({ phase: 'ready' });
    } catch (err) {
      setState({ phase: 'error', message: err instanceof Error ? err.message : 'Failed to load resources' });
    }
  };

  useEffect(() => {
    load();
  }, []);

  const swap = async (index: number, otherIndex: number) => {
    if (otherIndex < 0 || otherIndex >= frameworks.length) return;
    const a = frameworks[index];
    const b = frameworks[otherIndex];
    setBusySlug(a.slug);
    try {
      const db = adminDb();
      await Promise.all([
        setDoc(doc(db, 'frameworks', a.slug), { order: b.order, updatedAt: serverTimestamp() }, { merge: true }),
        setDoc(doc(db, 'frameworks', b.slug), { order: a.order, updatedAt: serverTimestamp() }, { merge: true }),
      ]);
      const next = [...frameworks];
      next[index] = { ...a, order: b.order };
      next[otherIndex] = { ...b, order: a.order };
      next.sort((x, y) => x.order - y.order);
      setFrameworks(next);
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
      await deleteDoc(doc(db, 'frameworks', deleteTarget.slug));
      setFrameworks((prev) => prev.filter((f) => f.slug !== deleteTarget.slug));
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
            <Library className="w-8 h-8 text-secondary stroke-[1.5]" />
            Resources
          </h1>
          <p className="font-sans text-sm text-on-surface-variant mt-2 leading-relaxed max-w-xl">
            Resource Hub entries with sample tables and report sections. Drafts are hidden from the
            public site until published.
          </p>
        </div>
        <Link
          to="/admin/resources/new"
          className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary font-mono text-[11px] uppercase tracking-widest font-semibold rounded-[2px] hover:bg-primary-container transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[1.5]" />
          New Resource
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

      {state.phase === 'ready' && frameworks.length === 0 && (
        <p className="font-sans text-sm text-on-surface-variant py-8">
          No resources yet — create one or run Import Defaults.
        </p>
      )}

      {state.phase === 'ready' && frameworks.length > 0 && (
        <div className="flex flex-col gap-3">
          {frameworks.map((framework, index) => (
            <div
              key={framework.slug}
              className="border-[0.5px] border-outline-variant bg-surface-container-lowest p-4 rounded-[2px] flex items-center gap-4"
            >
              <div className="min-w-0 flex-grow">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h2 className="font-serif font-bold text-primary truncate">{framework.title || '(untitled)'}</h2>
                  <span className="font-mono text-[10px] uppercase tracking-wider border-[0.5px] border-secondary text-secondary px-1.5 py-0.5 rounded-sm flex-shrink-0">
                    {framework.slug}
                  </span>
                  <span
                    className={`font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm flex-shrink-0 ${
                      framework.publishStatus === 'published'
                        ? 'bg-primary-fixed text-on-primary-fixed'
                        : 'bg-surface-variant text-on-surface-variant'
                    }`}
                  >
                    {framework.publishStatus}
                  </span>
                </div>
                <p className="font-sans text-xs text-on-surface-variant">
                  {framework.discipline} {framework.badge && `· ${framework.badge}`}
                </p>
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
                  disabled={index === frameworks.length - 1 || busySlug !== null}
                  className="p-1.5 border-[0.5px] border-outline rounded-[2px] hover:border-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  aria-label="Move down"
                >
                  <ArrowDown className="w-3.5 h-3.5 stroke-[1.5]" />
                </button>
                <Link
                  to={`/admin/resources/${framework.slug}`}
                  className="p-1.5 border-[0.5px] border-outline rounded-[2px] hover:border-primary hover:text-primary transition-colors cursor-pointer"
                  aria-label="Edit"
                >
                  <Pencil className="w-3.5 h-3.5 stroke-[1.5]" />
                </Link>
                <button
                  onClick={() => setDeleteTarget(framework)}
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
        title="Delete resource?"
        message={`This permanently deletes "${deleteTarget?.title ?? ''}" (${deleteTarget?.slug ?? ''}). This cannot be undone.`}
        confirmLabel="Delete"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
