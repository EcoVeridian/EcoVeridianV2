/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc, setDoc, serverTimestamp, collection, getDocs } from 'firebase/firestore';
import { Loader2, AlertTriangle, ChevronLeft } from 'lucide-react';
import { adminDb } from '../../lib/firebaseAdmin';
import { ArticleDoc, PageHomeDoc } from '../../../types';
import { SEED_PAGE_HOME } from '../../../content/seeds';
import Field from '../../components/Field';
import TextArea from '../../components/TextArea';
import SelectField from '../../components/SelectField';
import StringListEditor from '../../components/StringListEditor';
import SaveToast from '../../components/SaveToast';

type LoadState = { phase: 'loading' } | { phase: 'ready' } | { phase: 'error'; message: string };

export default function HomeEdit() {
  const [loaded, setLoaded] = useState<PageHomeDoc | null>(null);
  const [form, setForm] = useState<PageHomeDoc>(SEED_PAGE_HOME);
  const [state, setState] = useState<LoadState>({ phase: 'loading' });
  const [busy, setBusy] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [articleOptions, setArticleOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setState({ phase: 'loading' });
      try {
        const db = adminDb();
        const [snap, articlesSnap] = await Promise.all([
          getDoc(doc(db, 'pages', 'home')),
          getDocs(collection(db, 'articles')),
        ]);
        if (cancelled) return;
        const data = snap.exists() ? (snap.data() as PageHomeDoc) : SEED_PAGE_HOME;
        setLoaded(data);
        setForm(data);
        setArticleOptions(
          articlesSnap.docs
            .map((d) => d.data() as ArticleDoc)
            .map((a) => ({ value: a.slug, label: `${a.slug} — ${a.title}` })),
        );
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

  const update = <K extends keyof PageHomeDoc>(key: K, value: PageHomeDoc[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setBusy(true);
    try {
      const db = adminDb();
      await setDoc(doc(db, 'pages', 'home'), { ...form, updatedAt: serverTimestamp() }, { merge: true });
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
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary">Home</h1>
      </header>

      <div className="flex flex-col gap-6 max-w-3xl">
        <StringListEditor label="Badges" values={form.badges} onChange={(v) => update('badges', v)} addLabel="+ Add Badge" />
        <TextArea
          label="Heading"
          value={form.heading}
          onChange={(v) => update('heading', v)}
          rows={2}
          hint="Line breaks mark the desktop line split"
        />
        <TextArea label="Tagline" value={form.tagline} onChange={(v) => update('tagline', v)} rows={3} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="CTA Label" value={form.ctaLabel} onChange={(v) => update('ctaLabel', v)} />
          <Field
            label="Hero Figure Caption"
            value={form.heroFigureCaption}
            onChange={(v) => update('heroFigureCaption', v)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Archive Heading" value={form.archiveHeading} onChange={(v) => update('archiveHeading', v)} />
          <Field label="Archive Kicker" value={form.archiveKicker} onChange={(v) => update('archiveKicker', v)} />
        </div>

        <div className="border-t-[0.5px] border-outline-variant pt-6 mt-2">
          <h2 className="font-serif text-xl font-bold text-primary mb-4">Featured Articles</h2>
          <div className="flex flex-col gap-6">
            <SelectField
              label="Hero Article"
              value={form.heroArticleSlug}
              onChange={(v) => update('heroArticleSlug', v)}
              options={articleOptions}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField
                label="Flagship Article"
                value={form.flagshipArticleSlug}
                onChange={(v) => update('flagshipArticleSlug', v)}
                options={articleOptions}
              />
              <Field label="Flagship Kicker" value={form.flagshipKicker} onChange={(v) => update('flagshipKicker', v)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField
                label="Card 1 Article"
                value={form.card1ArticleSlug}
                onChange={(v) => update('card1ArticleSlug', v)}
                options={articleOptions}
              />
              <Field label="Card 1 Kicker" value={form.card1Kicker} onChange={(v) => update('card1Kicker', v)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField
                label="Card 2 Article"
                value={form.card2ArticleSlug}
                onChange={(v) => update('card2ArticleSlug', v)}
                options={articleOptions}
              />
              <Field label="Card 2 Kicker" value={form.card2Kicker} onChange={(v) => update('card2Kicker', v)} />
            </div>
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
