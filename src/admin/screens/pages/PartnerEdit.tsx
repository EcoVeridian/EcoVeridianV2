/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2, AlertTriangle, ChevronLeft } from 'lucide-react';
import { adminDb } from '../../lib/firebaseAdmin';
import { PagePartnerDoc } from '../../../types';
import { SEED_PAGE_PARTNER } from '../../../content/seeds';
import Field from '../../components/Field';
import TextArea from '../../components/TextArea';
import StringListEditor from '../../components/StringListEditor';
import SaveToast from '../../components/SaveToast';

type LoadState = { phase: 'loading' } | { phase: 'ready' } | { phase: 'error'; message: string };

export default function PartnerEdit() {
  const [loaded, setLoaded] = useState<PagePartnerDoc | null>(null);
  const [form, setForm] = useState<PagePartnerDoc>(SEED_PAGE_PARTNER);
  const [state, setState] = useState<LoadState>({ phase: 'loading' });
  const [busy, setBusy] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setState({ phase: 'loading' });
      try {
        const db = adminDb();
        const snap = await getDoc(doc(db, 'pages', 'partner'));
        if (cancelled) return;
        const data = snap.exists() ? (snap.data() as PagePartnerDoc) : SEED_PAGE_PARTNER;
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

  const update = <K extends keyof PagePartnerDoc>(key: K, value: PagePartnerDoc[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setBusy(true);
    try {
      const db = adminDb();
      await setDoc(doc(db, 'pages', 'partner'), { ...form, updatedAt: serverTimestamp() }, { merge: true });
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
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary">Partner</h1>
      </header>

      <div className="flex flex-col gap-6 max-w-3xl">
        <Field label="Heading" value={form.heading} onChange={(v) => update('heading', v)} />
        <TextArea label="Intro" value={form.intro} onChange={(v) => update('intro', v)} rows={4} />
        <Field label="Notice Heading" value={form.noticeHeading} onChange={(v) => update('noticeHeading', v)} />
        <TextArea label="Notice Body" value={form.noticeBody} onChange={(v) => update('noticeBody', v)} rows={2} />
        <StringListEditor
          label="Inquiry Types"
          values={form.inquiryTypes}
          onChange={(v) => update('inquiryTypes', v)}
          addLabel="+ Add Inquiry Type"
        />
        <Field label="Response Note" value={form.responseNote} onChange={(v) => update('responseNote', v)} />
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
