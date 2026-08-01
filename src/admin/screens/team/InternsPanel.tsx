/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Interns editor, shown beneath the team member list on /admin/team.
 *
 * Interns are name-only entries in the `interns` collection (doc id = slug
 * generated from the name at add time, so renaming never moves the doc). Edits
 * are batched locally and committed on Save: every remaining row is rewritten
 * with its array index as `order`, and rows removed since load are deleted.
 */

import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  doc,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import { Loader2, AlertTriangle, Plus, ArrowUp, ArrowDown, X, GraduationCap } from 'lucide-react';
import { adminDb } from '../../lib/firebaseAdmin';
import { InternDoc } from '../../../types';
import SaveToast from '../../components/SaveToast';

type InternRow = Pick<InternDoc, 'slug' | 'name' | 'visible'>;

type LoadState = { phase: 'loading' } | { phase: 'ready' } | { phase: 'error'; message: string };

const slugify = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** Doc id derived from the name, suffixed until it doesn't collide. */
const uniqueSlug = (name: string, taken: Set<string>) => {
  const base = slugify(name) || `intern-${Date.now()}`;
  let slug = base;
  let n = 2;
  while (taken.has(slug)) {
    slug = `${base}-${n}`;
    n += 1;
  }
  return slug;
};

export default function InternsPanel() {
  const [loaded, setLoaded] = useState<InternRow[]>([]);
  const [rows, setRows] = useState<InternRow[]>([]);
  const [draftName, setDraftName] = useState('');
  const [state, setState] = useState<LoadState>({ phase: 'loading' });
  // Gates the editor: without a successful load, a save would write against an
  // unknown collection state.
  const [everLoaded, setEverLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setState({ phase: 'loading' });
      try {
        const db = adminDb();
        const snap = await getDocs(collection(db, 'interns'));
        if (cancelled) return;
        const docs = snap.docs
          .map((d) => d.data() as InternDoc)
          .sort((a, b) => a.order - b.order)
          .map(({ slug, name, visible }) => ({ slug, name, visible }));
        setLoaded(docs);
        setRows(docs);
        setEverLoaded(true);
        setState({ phase: 'ready' });
      } catch (err) {
        if (!cancelled) {
          setState({ phase: 'error', message: err instanceof Error ? err.message : 'Failed to load interns' });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const dirty = JSON.stringify(rows) !== JSON.stringify(loaded);
  const hasBlankName = rows.some((row) => row.name.trim().length === 0);

  const add = () => {
    const name = draftName.trim();
    if (!name) return;
    const slug = uniqueSlug(name, new Set(rows.map((r) => r.slug)));
    setRows((prev) => [...prev, { slug, name, visible: true }]);
    setDraftName('');
  };

  const updateAt = (index: number, patch: Partial<InternRow>) => {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  const removeAt = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const swap = (i: number, j: number) => {
    if (j < 0 || j >= rows.length) return;
    setRows((prev) => {
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const handleSave = async () => {
    if (hasBlankName) return;
    setBusy(true);
    try {
      const db = adminDb();
      const batch = writeBatch(db);
      const keptSlugs = new Set(rows.map((row) => row.slug));

      rows.forEach((row, index) => {
        batch.set(
          doc(db, 'interns', row.slug),
          {
            slug: row.slug,
            name: row.name.trim(),
            visible: row.visible,
            order: index,
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );
      });

      for (const previous of loaded) {
        if (!keptSlugs.has(previous.slug)) {
          batch.delete(doc(db, 'interns', previous.slug));
        }
      }

      await batch.commit();
      const saved = rows.map((row) => ({ ...row, name: row.name.trim() }));
      setRows(saved);
      setLoaded(saved);
      setState({ phase: 'ready' });
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2500);
    } catch (err) {
      setState({ phase: 'error', message: err instanceof Error ? err.message : 'Failed to save interns' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mt-12 border-t-[0.5px] border-outline-variant pt-8">
      <header className="mb-6">
        <h2 className="font-serif text-2xl font-bold text-primary flex items-center gap-3">
          <GraduationCap className="w-6 h-6 text-secondary stroke-[1.5]" />
          Interns
        </h2>
        <p className="font-sans text-sm text-on-surface-variant mt-2 leading-relaxed max-w-xl">
          Listed by name underneath the team members on the public Team page. Hidden interns are
          kept here but not shown on the site.
        </p>
      </header>

      {state.phase === 'loading' && (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-6 h-6 text-outline animate-spin" />
        </div>
      )}

      {state.phase === 'error' && (
        <p className="font-sans text-sm text-error flex items-center gap-2 pb-4">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          {state.message}
        </p>
      )}

      {everLoaded && (
        <>
          <div className="flex flex-col gap-2 max-w-2xl">
            {rows.length === 0 && (
              <p className="font-sans text-sm text-on-surface-variant pb-2">
                No interns yet — add the first name below.
              </p>
            )}

            {rows.map((row, index) => (
              <div key={row.slug} className="flex items-center gap-2">
                <input
                  value={row.name}
                  onChange={(e) => updateAt(index, { name: e.target.value })}
                  aria-label={`Intern ${index + 1} name`}
                  className="flex-grow bg-transparent border-b-[0.5px] border-outline focus:outline-none focus:border-primary focus:bg-surface-container-low transition-all py-2 text-sm font-sans"
                />
                <label className="flex items-center gap-2 cursor-pointer select-none flex-shrink-0 px-1">
                  <input
                    type="checkbox"
                    checked={row.visible}
                    onChange={(e) => updateAt(index, { visible: e.target.checked })}
                    className="appearance-none w-4 h-4 border-[0.5px] border-outline rounded-sm checked:bg-primary checked:border-primary transition-colors cursor-pointer"
                  />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
                    Visible
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => swap(index, index - 1)}
                  disabled={index === 0}
                  className="p-1.5 border-[0.5px] border-outline rounded-[2px] hover:border-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  aria-label="Move up"
                >
                  <ArrowUp className="w-3.5 h-3.5 stroke-[1.5]" />
                </button>
                <button
                  type="button"
                  onClick={() => swap(index, index + 1)}
                  disabled={index === rows.length - 1}
                  className="p-1.5 border-[0.5px] border-outline rounded-[2px] hover:border-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  aria-label="Move down"
                >
                  <ArrowDown className="w-3.5 h-3.5 stroke-[1.5]" />
                </button>
                <button
                  type="button"
                  onClick={() => removeAt(index)}
                  className="p-1.5 border-[0.5px] border-outline rounded-[2px] hover:border-error hover:text-error transition-colors cursor-pointer"
                  aria-label="Remove"
                >
                  <X className="w-3.5 h-3.5 stroke-[1.5]" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-5 max-w-2xl">
            <input
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  add();
                }
              }}
              placeholder="Intern name"
              aria-label="New intern name"
              className="flex-grow bg-transparent border-b-[0.5px] border-outline focus:outline-none focus:border-primary focus:bg-surface-container-low transition-all py-2 text-sm font-sans placeholder:text-outline"
            />
            <button
              type="button"
              onClick={add}
              disabled={draftName.trim().length === 0}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 border-[0.5px] border-outline rounded-[2px] font-mono text-[11px] uppercase tracking-wider text-primary hover:border-primary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus className="w-3.5 h-3.5 stroke-[1.5]" />
              Add Intern
            </button>
          </div>

          <div className="flex items-center justify-between gap-4 mt-6 max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-wider text-secondary">
              {hasBlankName ? (
                <span className="text-error">Every intern needs a name</span>
              ) : (
                dirty && 'Unsaved changes'
              )}
            </span>
            <button
              type="button"
              onClick={handleSave}
              disabled={!dirty || busy || hasBlankName}
              className="px-5 py-2.5 bg-primary text-on-primary font-mono text-[11px] uppercase tracking-widest font-semibold rounded-[2px] hover:bg-primary-container transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {busy && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Save Interns
            </button>
          </div>
        </>
      )}

      <SaveToast message="Interns saved" visible={toastVisible} />
    </section>
  );
}
