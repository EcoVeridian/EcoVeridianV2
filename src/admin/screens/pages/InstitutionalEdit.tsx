/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2, AlertTriangle, ChevronLeft, ArrowUp, ArrowDown, X, Plus } from 'lucide-react';
import { adminDb } from '../../lib/firebaseAdmin';
import { CollabTier, PageInstitutionalDoc } from '../../../types';
import { SEED_PAGE_INSTITUTIONAL } from '../../../content/seeds';
import { ICON_MAP, iconFor } from '../../../lib/icons';
import Field from '../../components/Field';
import TextArea from '../../components/TextArea';
import SelectField from '../../components/SelectField';
import ToggleField from '../../components/ToggleField';
import StringListEditor from '../../components/StringListEditor';
import SaveToast from '../../components/SaveToast';

const ICON_OPTIONS = Object.keys(ICON_MAP).map((name) => ({ value: name, label: name }));

interface TierListEditorProps {
  label: string;
  values: CollabTier[];
  onChange: (values: CollabTier[]) => void;
}

function TierListEditor({ label, values, onChange }: TierListEditorProps) {
  const updateAt = (index: number, patch: Partial<CollabTier>) => {
    const next = [...values];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  const removeAt = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const swap = (i: number, j: number) => {
    if (j < 0 || j >= values.length) return;
    const next = [...values];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  const add = () => {
    onChange([...values, { icon: 'target', title: '', body: '', bullets: [], badge: '', highlighted: false }]);
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="font-mono text-xs text-on-surface-variant uppercase font-bold">{label}</label>
      {values.map((item, index) => {
        const Icon = iconFor(item.icon);
        return (
          <div
            key={index}
            className="border-[0.5px] border-outline-variant bg-surface-container-low p-4 rounded-[2px] flex flex-col gap-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-end gap-3 flex-grow">
                <Icon className="w-8 h-8 text-secondary stroke-[1.5] mb-2 flex-shrink-0" />
                <div className="w-40 flex-shrink-0">
                  <SelectField
                    label="Icon"
                    value={item.icon}
                    onChange={(v) => updateAt(index, { icon: v })}
                    options={ICON_OPTIONS}
                  />
                </div>
                <div className="flex-grow">
                  <Field label="Title" value={item.title} onChange={(v) => updateAt(index, { title: v })} />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-6 flex-shrink-0">
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
                <button
                  type="button"
                  onClick={() => removeAt(index)}
                  className="p-1.5 border-[0.5px] border-outline rounded-[2px] hover:border-error hover:text-error transition-colors cursor-pointer"
                  aria-label="Remove"
                >
                  <X className="w-3.5 h-3.5 stroke-[1.5]" />
                </button>
              </div>
            </div>
            <TextArea label="Body" value={item.body} onChange={(v) => updateAt(index, { body: v })} rows={3} />
            <StringListEditor
              label="Bullets"
              values={item.bullets}
              onChange={(v) => updateAt(index, { bullets: v })}
              addLabel="+ Add Bullet"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <Field
                label="Badge"
                value={item.badge}
                onChange={(v) => updateAt(index, { badge: v })}
                hint="Shown as a corner ribbon; leave empty for none"
              />
              <ToggleField
                label="Highlighted"
                checked={item.highlighted}
                onChange={(v) => updateAt(index, { highlighted: v })}
              />
            </div>
          </div>
        );
      })}
      <button
        type="button"
        onClick={add}
        className="self-start flex items-center gap-1.5 mt-1 font-mono text-[11px] uppercase tracking-wider text-primary hover:text-secondary transition-colors cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5 stroke-[1.5]" />
        Add Tier
      </button>
    </div>
  );
}

interface ThresholdListEditorProps {
  values: Array<{ maxScore: number; label: string }>;
  onChange: (values: Array<{ maxScore: number; label: string }>) => void;
}

function ThresholdListEditor({ values, onChange }: ThresholdListEditorProps) {
  const updateAt = (index: number, patch: Partial<{ maxScore: number; label: string }>) => {
    const next = [...values];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  const removeAt = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const swap = (i: number, j: number) => {
    if (j < 0 || j >= values.length) return;
    const next = [...values];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  const add = () => {
    onChange([...values, { maxScore: 0, label: '' }]);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="font-mono text-xs text-on-surface-variant uppercase font-bold">Thresholds</label>
      {values.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="number"
            value={item.maxScore}
            onChange={(e) => updateAt(index, { maxScore: Number(e.target.value) })}
            className="w-24 flex-shrink-0 bg-transparent border-b-[0.5px] border-outline focus:outline-none focus:border-primary focus:bg-surface-container-low transition-all py-2 text-sm font-mono"
          />
          <input
            value={item.label}
            onChange={(e) => updateAt(index, { label: e.target.value })}
            placeholder="Label"
            className="flex-grow bg-transparent border-b-[0.5px] border-outline focus:outline-none focus:border-primary focus:bg-surface-container-low transition-all py-2 text-sm font-sans"
          />
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
      <p className="font-sans text-[11px] text-outline leading-relaxed">
        First row whose Max Score ≥ sliders total wins
      </p>
      <button
        type="button"
        onClick={add}
        className="self-start flex items-center gap-1.5 mt-1 font-mono text-[11px] uppercase tracking-wider text-primary hover:text-secondary transition-colors cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5 stroke-[1.5]" />
        Add Threshold
      </button>
    </div>
  );
}

type LoadState = { phase: 'loading' } | { phase: 'ready' } | { phase: 'error'; message: string };

export default function InstitutionalEdit() {
  const [loaded, setLoaded] = useState<PageInstitutionalDoc | null>(null);
  const [form, setForm] = useState<PageInstitutionalDoc>(SEED_PAGE_INSTITUTIONAL);
  const [state, setState] = useState<LoadState>({ phase: 'loading' });
  const [busy, setBusy] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setState({ phase: 'loading' });
      try {
        const db = adminDb();
        const snap = await getDoc(doc(db, 'pages', 'institutional'));
        if (cancelled) return;
        const data = snap.exists() ? (snap.data() as PageInstitutionalDoc) : SEED_PAGE_INSTITUTIONAL;
        setLoaded(data);
        setForm(data);
        setState({ phase: 'ready' });
      } catch (err) {
        if (!cancelled) {
          setState({ phase: 'error', message: err instanceof Error ? err.message : 'Failed to load page' });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const dirty = JSON.stringify(form) !== JSON.stringify(loaded);

  const update = <K extends keyof PageInstitutionalDoc>(key: K, value: PageInstitutionalDoc[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateEstimator = <K extends keyof PageInstitutionalDoc['estimator']>(
    key: K,
    value: PageInstitutionalDoc['estimator'][K],
  ) => {
    setForm((prev) => ({ ...prev, estimator: { ...prev.estimator, [key]: value } }));
  };

  const handleSave = async () => {
    setBusy(true);
    try {
      const db = adminDb();
      await setDoc(doc(db, 'pages', 'institutional'), { ...form, updatedAt: serverTimestamp() }, { merge: true });
      setLoaded(form);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2500);
    } catch (err) {
      setState({ phase: 'error', message: err instanceof Error ? err.message : 'Failed to save page' });
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
        <Link
          to="/admin/pages"
          className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors mb-3"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Pages
        </Link>
        <p className="font-mono text-xs uppercase tracking-widest text-secondary font-bold mb-2">Edit Page</p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary">Ways to Work With Us</h1>
      </header>

      <div className="flex flex-col gap-6 max-w-3xl">
        <Field label="Kicker" value={form.kicker} onChange={(v) => update('kicker', v)} />
        <Field label="Heading" value={form.heading} onChange={(v) => update('heading', v)} />
        <TextArea label="Intro" value={form.intro} onChange={(v) => update('intro', v)} rows={4} />

        <Field label="Tiers Heading" value={form.tiersHeading} onChange={(v) => update('tiersHeading', v)} />
        <TierListEditor label="Collaboration Tiers" values={form.tiers} onChange={(v) => update('tiers', v)} />

        <div className="border-t-[0.5px] border-outline-variant pt-6 mt-2">
          <h2 className="font-serif text-xl font-bold text-primary mb-4">Project Scope Estimator</h2>
          <div className="flex flex-col gap-6">
            <Field
              label="Heading"
              value={form.estimator.heading}
              onChange={(v) => updateEstimator('heading', v)}
            />
            <ThresholdListEditor
              values={form.estimator.thresholds}
              onChange={(v) => updateEstimator('thresholds', v)}
            />
            <TextArea label="Note" value={form.estimator.note} onChange={(v) => updateEstimator('note', v)} rows={2} />
            <Field label="CTA Label" value={form.estimator.ctaLabel} onChange={(v) => updateEstimator('ctaLabel', v)} />
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 bg-surface border-t-[0.5px] border-outline-variant py-3 flex items-center justify-between gap-4 mt-8">
        <span className="font-mono text-xs uppercase tracking-wider text-secondary">
          {dirty ? 'Unsaved changes' : ' '}
        </span>
        <button
          type="button"
          onClick={handleSave}
          disabled={!dirty || busy}
          className="px-5 py-2.5 bg-primary text-on-primary font-mono text-[11px] uppercase tracking-widest font-semibold rounded-[2px] hover:bg-primary-container transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
        >
          {busy && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          Save
        </button>
      </div>
      <SaveToast message="Saved" visible={toastVisible} />
    </div>
  );
}
