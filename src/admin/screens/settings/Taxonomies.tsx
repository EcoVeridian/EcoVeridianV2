/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2, AlertTriangle, ArrowUp, ArrowDown, X, Plus, Tags, Check } from 'lucide-react';
import { adminDb } from '../../lib/firebaseAdmin';
import { TaxonomyDoc, TaxonomyValue } from '../../../types';

interface TaxonomyCardConfig {
  id: string;
  heading: string;
  description: string;
}

const CARDS: TaxonomyCardConfig[] = [
  { id: 'disciplines', heading: 'Disciplines', description: 'Used to tag Resource Hub entries by field.' },
  { id: 'domains', heading: 'Domains', description: 'Resource output type, e.g. Written Report, Dataset.' },
  { id: 'categories', heading: 'Categories', description: 'Article category tags, e.g. Case Study, Methodology.' },
];

const kebabCase = (label: string) =>
  label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || `value-${Date.now()}`;

type LoadState = { phase: 'loading' } | { phase: 'ready' } | { phase: 'error'; message: string };

function TaxonomyCard({ config }: { config: TaxonomyCardConfig }) {
  const [values, setValues] = useState<TaxonomyValue[]>([]);
  const [loaded, setLoaded] = useState<TaxonomyValue[]>([]);
  const [state, setState] = useState<LoadState>({ phase: 'loading' });
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setState({ phase: 'loading' });
      try {
        const db = adminDb();
        const snap = await getDoc(doc(db, 'taxonomies', config.id));
        const data = snap.exists() ? (snap.data() as TaxonomyDoc) : { values: [] };
        const sorted = [...data.values].sort((a, b) => a.order - b.order);
        setValues(sorted);
        setLoaded(sorted);
        setState({ phase: 'ready' });
      } catch (err) {
        setState({ phase: 'error', message: err instanceof Error ? err.message : 'Failed to load' });
      }
    })();
  }, [config.id]);

  const dirty = JSON.stringify(values) !== JSON.stringify(loaded);

  const relabel = (id: string, label: string) => {
    setValues((prev) => prev.map((v) => (v.id === id ? { ...v, label } : v)));
  };

  const swap = (index: number, otherIndex: number) => {
    if (otherIndex < 0 || otherIndex >= values.length) return;
    const next = [...values];
    [next[index], next[otherIndex]] = [next[otherIndex], next[index]];
    setValues(next.map((v, i) => ({ ...v, order: i })));
  };

  const removeValue = (id: string) => {
    setValues((prev) => prev.filter((v) => v.id !== id).map((v, i) => ({ ...v, order: i })));
    setConfirmRemoveId(null);
  };

  const addValue = () => {
    const label = 'New Value';
    setValues((prev) => [...prev, { id: kebabCase(`${label}-${prev.length}`), label, order: prev.length }]);
  };

  const save = async () => {
    setBusy(true);
    try {
      const db = adminDb();
      await setDoc(doc(db, 'taxonomies', config.id), { values, updatedAt: serverTimestamp() }, { merge: true });
      setLoaded(values);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setState({ phase: 'error', message: err instanceof Error ? err.message : 'Failed to save' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="border-[0.5px] border-outline-variant bg-surface-container-lowest p-5 rounded-[2px]">
      <div className="mb-4">
        <h2 className="font-serif text-lg font-bold text-primary">{config.heading}</h2>
        <p className="font-sans text-xs text-on-surface-variant leading-relaxed">{config.description}</p>
      </div>

      {state.phase === 'loading' && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 text-outline animate-spin" />
        </div>
      )}

      {state.phase === 'error' && (
        <p className="font-sans text-sm text-error flex items-center gap-2 py-4">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          {state.message}
        </p>
      )}

      {state.phase === 'ready' && (
        <>
          <div className="flex flex-col gap-2 mb-3">
            {values.map((v, index) => (
              <div key={v.id} className="flex items-center gap-2">
                <input
                  value={v.label}
                  onChange={(e) => relabel(v.id, e.target.value)}
                  className="flex-grow bg-transparent border-b-[0.5px] border-outline focus:outline-none focus:border-primary focus:bg-surface-container-low transition-all py-2 text-sm font-sans"
                />
                <span className="font-mono text-[10px] text-outline flex-shrink-0 hidden sm:inline">{v.id}</span>
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
                  disabled={index === values.length - 1}
                  className="p-1.5 border-[0.5px] border-outline rounded-[2px] hover:border-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  aria-label="Move down"
                >
                  <ArrowDown className="w-3.5 h-3.5 stroke-[1.5]" />
                </button>
                {confirmRemoveId === v.id ? (
                  <span className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="font-sans text-[11px] text-error">Remove?</span>
                    <button
                      type="button"
                      onClick={() => removeValue(v.id)}
                      className="px-2 py-1 bg-error text-white font-mono text-[10px] uppercase rounded-[2px] cursor-pointer"
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmRemoveId(null)}
                      className="px-2 py-1 border-[0.5px] border-outline font-mono text-[10px] uppercase rounded-[2px] cursor-pointer"
                    >
                      No
                    </button>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmRemoveId(v.id)}
                    className="p-1.5 border-[0.5px] border-outline rounded-[2px] hover:border-error hover:text-error transition-colors cursor-pointer"
                    aria-label="Remove"
                  >
                    <X className="w-3.5 h-3.5 stroke-[1.5]" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={addValue}
              className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-primary hover:text-secondary transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[1.5]" />
              Add Value
            </button>

            <button
              type="button"
              onClick={save}
              disabled={!dirty || busy}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary font-mono text-[11px] uppercase tracking-widest font-semibold rounded-[2px] hover:bg-primary-container transition-colors cursor-pointer disabled:opacity-50"
            >
              {busy ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : saved ? (
                <Check className="w-3.5 h-3.5" />
              ) : null}
              {saved ? 'Saved' : 'Save'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function Taxonomies() {
  return (
    <div className="animate-fade-in">
      <header className="mb-8 border-b-[0.5px] border-outline-variant pb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-secondary font-bold mb-2">Settings</p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary flex items-center gap-3">
          <Tags className="w-8 h-8 text-secondary stroke-[1.5]" />
          Taxonomies
        </h1>
        <p className="font-sans text-sm text-on-surface-variant mt-2 leading-relaxed max-w-xl">
          Manage the discipline, domain, and category values used across articles and resources.
        </p>
        <p className="font-sans text-xs text-error mt-3 leading-relaxed max-w-xl">
          Renaming or deleting a value does not update existing articles/resources that use it.
        </p>
      </header>

      <div className="flex flex-col gap-6 max-w-2xl">
        {CARDS.map((card) => (
          <TaxonomyCard key={card.id} config={card} />
        ))}
      </div>
    </div>
  );
}
