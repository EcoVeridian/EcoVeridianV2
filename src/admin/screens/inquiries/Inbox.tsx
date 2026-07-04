/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useState } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { Loader2, AlertTriangle, Inbox as InboxIcon, Mail, Archive, ArchiveRestore, Trash2, Circle } from 'lucide-react';
import { adminDb } from '../../lib/firebaseAdmin';
import { InquiryDoc, InquiryStatus } from '../../../types';
import ConfirmDialog from '../../components/ConfirmDialog';

type InquiryRow = InquiryDoc & { id: string };

type LoadState = { phase: 'loading' } | { phase: 'ready' } | { phase: 'error'; message: string };

type Tab = 'inbox' | 'archived' | 'all';

const TABS: { id: Tab; label: string }[] = [
  { id: 'inbox', label: 'Inbox' },
  { id: 'archived', label: 'Archived' },
  { id: 'all', label: 'All' },
];

function formatDate(value: unknown): string {
  if (value instanceof Timestamp) {
    return value.toDate().toLocaleString();
  }
  return '—';
}

export default function Inbox() {
  const [inquiries, setInquiries] = useState<InquiryRow[]>([]);
  const [state, setState] = useState<LoadState>({ phase: 'loading' });
  const [tab, setTab] = useState<Tab>('inbox');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<InquiryRow | null>(null);

  useEffect(() => {
    const db = adminDb();
    const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setInquiries(snap.docs.map((d) => ({ id: d.id, ...(d.data() as InquiryDoc) })));
        setState({ phase: 'ready' });
      },
      (err) => {
        setState({ phase: 'error', message: err instanceof Error ? err.message : 'Failed to load inquiries' });
      },
    );
    return unsubscribe;
  }, []);

  const filtered = useMemo(() => {
    switch (tab) {
      case 'inbox':
        return inquiries.filter((i) => i.status === 'unread' || i.status === 'read');
      case 'archived':
        return inquiries.filter((i) => i.status === 'archived');
      case 'all':
      default:
        return inquiries;
    }
  }, [inquiries, tab]);

  const selected = inquiries.find((i) => i.id === selectedId) ?? null;

  const setStatus = async (id: string, status: InquiryStatus) => {
    setBusyId(id);
    try {
      const db = adminDb();
      await updateDoc(doc(db, 'inquiries', id), { status, updatedAt: serverTimestamp() });
    } catch (err) {
      setState({ phase: 'error', message: err instanceof Error ? err.message : 'Failed to update inquiry' });
    } finally {
      setBusyId(null);
    }
  };

  const selectInquiry = (row: InquiryRow) => {
    setSelectedId(row.id);
    if (row.status === 'unread') {
      setStatus(row.id, 'read');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setBusyId(deleteTarget.id);
    try {
      const db = adminDb();
      await deleteDoc(doc(db, 'inquiries', deleteTarget.id));
      if (selectedId === deleteTarget.id) setSelectedId(null);
    } catch (err) {
      setState({ phase: 'error', message: err instanceof Error ? err.message : 'Failed to delete inquiry' });
    } finally {
      setBusyId(null);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="animate-fade-in">
      <header className="mb-8 border-b-[0.5px] border-outline-variant pb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-secondary font-bold mb-2">Content</p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary flex items-center gap-3">
          <InboxIcon className="w-8 h-8 text-secondary stroke-[1.5]" />
          Inquiries
        </h1>
        <p className="font-sans text-sm text-on-surface-variant mt-2 leading-relaxed max-w-xl">
          Messages submitted through the Partner With Us form.
        </p>
      </header>

      <div className="flex items-center gap-1 mb-5 border-b-[0.5px] border-outline-variant">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 font-mono text-[11px] uppercase tracking-widest font-semibold transition-colors cursor-pointer border-b-2 -mb-[0.5px] ${
              tab === t.id
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

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

      {state.phase === 'ready' && (
        <div className="flex flex-col md:flex-row gap-6">
          {/* List */}
          <div className="w-full md:w-80 flex-shrink-0 flex flex-col gap-2">
            {filtered.length === 0 && (
              <p className="font-sans text-sm text-on-surface-variant py-4">No inquiries here.</p>
            )}
            {filtered.map((row) => {
              const unread = row.status === 'unread';
              const isSelected = row.id === selectedId;
              return (
                <button
                  key={row.id}
                  type="button"
                  onClick={() => selectInquiry(row)}
                  className={`text-left border-[0.5px] rounded-[2px] p-3 transition-colors cursor-pointer ${
                    isSelected
                      ? 'border-primary bg-surface-container-low'
                      : 'border-outline-variant bg-surface-container-lowest hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {unread && <Circle className="w-2 h-2 fill-secondary text-secondary flex-shrink-0" />}
                    <span className={`font-sans text-sm truncate ${unread ? 'font-bold text-on-surface' : 'text-on-surface-variant'}`}>
                      {row.name || '(no name)'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider border-[0.5px] border-secondary text-secondary px-1.5 py-0.5 rounded-sm">
                      {row.inquiryType || 'General'}
                    </span>
                    {row.organization && (
                      <span className="font-sans text-xs text-on-surface-variant truncate">{row.organization}</span>
                    )}
                  </div>
                  <p className="font-mono text-[10px] text-outline">{formatDate(row.createdAt)}</p>
                </button>
              );
            })}
          </div>

          {/* Detail */}
          <div className="flex-grow min-w-0">
            {!selected && (
              <div className="border-[0.5px] border-outline-variant bg-surface-container-low rounded-[2px] p-8 text-center">
                <p className="font-sans text-sm text-on-surface-variant">Select an inquiry to view details.</p>
              </div>
            )}

            {selected && (
              <div className="border-[0.5px] border-outline-variant bg-surface-container-lowest rounded-[2px] p-6 flex flex-col gap-5">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-primary mb-1">{selected.name || '(no name)'}</h2>
                  <p className="font-sans text-xs text-on-surface-variant">{formatDate(selected.createdAt)}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="font-mono text-xs text-on-surface-variant uppercase font-bold mb-1">Organization</p>
                    <p className="font-sans text-sm">{selected.organization || '—'}</p>
                  </div>
                  <div>
                    <p className="font-mono text-xs text-on-surface-variant uppercase font-bold mb-1">Email</p>
                    <p className="font-sans text-sm break-all">{selected.email || '—'}</p>
                  </div>
                  <div>
                    <p className="font-mono text-xs text-on-surface-variant uppercase font-bold mb-1">Inquiry Type</p>
                    <p className="font-sans text-sm">{selected.inquiryType || '—'}</p>
                  </div>
                  <div>
                    <p className="font-mono text-xs text-on-surface-variant uppercase font-bold mb-1">Status</p>
                    <p className="font-sans text-sm capitalize">{selected.status}</p>
                  </div>
                </div>

                <div>
                  <p className="font-mono text-xs text-on-surface-variant uppercase font-bold mb-1">Details</p>
                  <p className="font-sans text-sm whitespace-pre-wrap leading-relaxed">{selected.details || '—'}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-4 border-t-[0.5px] border-outline-variant">
                  <a
                    href={`mailto:${selected.email}?subject=${encodeURIComponent('Re: your EcoVeridian inquiry')}`}
                    className="flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary font-mono text-[11px] uppercase tracking-widest font-semibold rounded-[2px] hover:bg-primary-container transition-colors cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5 stroke-[1.5]" />
                    Reply
                  </a>

                  <button
                    type="button"
                    onClick={() => setStatus(selected.id, selected.status === 'unread' ? 'read' : 'unread')}
                    disabled={busyId === selected.id}
                    className="flex items-center gap-2 px-4 py-2.5 border-[0.5px] border-outline text-on-surface-variant font-mono text-[11px] uppercase tracking-widest font-semibold rounded-[2px] hover:border-primary hover:text-primary transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {busyId === selected.id && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Mark {selected.status === 'unread' ? 'Read' : 'Unread'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatus(selected.id, selected.status === 'archived' ? 'read' : 'archived')}
                    disabled={busyId === selected.id}
                    className="flex items-center gap-2 px-4 py-2.5 border-[0.5px] border-outline text-on-surface-variant font-mono text-[11px] uppercase tracking-widest font-semibold rounded-[2px] hover:border-primary hover:text-primary transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {selected.status === 'archived' ? (
                      <ArchiveRestore className="w-3.5 h-3.5 stroke-[1.5]" />
                    ) : (
                      <Archive className="w-3.5 h-3.5 stroke-[1.5]" />
                    )}
                    {selected.status === 'archived' ? 'Restore' : 'Archive'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget(selected)}
                    disabled={busyId === selected.id}
                    className="flex items-center gap-2 px-4 py-2.5 border-[0.5px] border-outline text-on-surface-variant font-mono text-[11px] uppercase tracking-widest font-semibold rounded-[2px] hover:border-error hover:text-error transition-colors cursor-pointer disabled:opacity-50 ml-auto"
                  >
                    <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete inquiry?"
        message={`This permanently deletes the inquiry from "${deleteTarget?.name ?? ''}". This cannot be undone.`}
        confirmLabel="Delete"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
