/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, setDoc, serverTimestamp, collection, getDocs } from 'firebase/firestore';
import { Loader2, AlertTriangle, ChevronLeft } from 'lucide-react';
import { adminDb } from '../../lib/firebaseAdmin';
import { ArticleDoc, FrameworkDoc, PublishStatus } from '../../../types';
import Field from '../../components/Field';
import TextArea from '../../components/TextArea';
import SelectField from '../../components/SelectField';
import StringListEditor from '../../components/StringListEditor';
import PublishBar from '../../components/PublishBar';
import SaveToast from '../../components/SaveToast';

const blankArticle = (): ArticleDoc => ({
  slug: '',
  title: '',
  category: '',
  author: '',
  readTime: '',
  publishedDate: '',
  excerpt: '',
  imageUrl: '',
  imagePath: '',
  figureCaption: '',
  abstract: '',
  introduction: '',
  methodologyText: '',
  analysisText: '',
  references: [],
  linkedResourceSlug: '',
  publishStatus: 'draft',
  order: Date.now(),
});

type LoadState = { phase: 'loading' } | { phase: 'ready' } | { phase: 'error'; message: string };

const isValidSlug = (slug: string) => slug.trim().length > 0 && !/[\s/]/.test(slug);

export default function ArticleEdit() {
  const { slug: routeSlug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const createMode = routeSlug === 'new';

  const [loaded, setLoaded] = useState<ArticleDoc | null>(null);
  const [form, setForm] = useState<ArticleDoc>(blankArticle());
  const [state, setState] = useState<LoadState>({ phase: createMode ? 'ready' : 'loading' });
  const [busy, setBusy] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [slugError, setSlugError] = useState<string | null>(null);
  const [resourceOptions, setResourceOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const db = adminDb();
        const snap = await getDocs(collection(db, 'frameworks'));
        if (cancelled) return;
        setResourceOptions(
          snap.docs
            .map((d) => d.data() as FrameworkDoc)
            .map((f) => ({ value: f.slug, label: `${f.slug} — ${f.title}` })),
        );
      } catch {
        /* resource picker is optional; leave options empty on failure */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (createMode || !routeSlug) return;
    let cancelled = false;
    (async () => {
      setState({ phase: 'loading' });
      try {
        const db = adminDb();
        const snap = await getDoc(doc(db, 'articles', routeSlug));
        if (cancelled) return;
        if (!snap.exists()) {
          setState({ phase: 'error', message: `No article found with slug "${routeSlug}".` });
          return;
        }
        const data = snap.data() as ArticleDoc;
        setLoaded(data);
        setForm(data);
        setState({ phase: 'ready' });
      } catch (err) {
        if (!cancelled) {
          setState({ phase: 'error', message: err instanceof Error ? err.message : 'Failed to load article' });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeSlug, createMode]);

  const dirty = createMode || JSON.stringify(form) !== JSON.stringify(loaded);

  const update = <K extends keyof ArticleDoc>(key: K, value: ArticleDoc[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (status: PublishStatus) => {
    if (createMode && !isValidSlug(form.slug)) {
      setSlugError('Enter a slug with no spaces or slashes.');
      return;
    }
    setSlugError(null);
    setBusy(true);
    try {
      const db = adminDb();
      const payload = {
        ...form,
        publishStatus: status,
        imagePath: form.imagePath ?? '',
        updatedAt: serverTimestamp(),
        ...(createMode && { createdAt: serverTimestamp(), order: Date.now() }),
      };
      await setDoc(doc(db, 'articles', form.slug), payload, { merge: true });
      setForm((prev) => ({ ...prev, publishStatus: status }));
      setLoaded({ ...form, publishStatus: status });
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2500);
      if (createMode) {
        navigate(`/admin/articles/${form.slug}`);
      }
    } catch (err) {
      setState({ phase: 'error', message: err instanceof Error ? err.message : 'Failed to save article' });
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
          to="/admin/articles"
          className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors mb-3"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Articles
        </Link>
        <p className="font-mono text-xs uppercase tracking-widest text-secondary font-bold mb-2">
          {createMode ? 'New Article' : 'Edit Article'}
        </p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary">
          {createMode ? 'Create Article' : form.title || form.slug}
        </h1>
      </header>

      <div className="flex flex-col gap-6 max-w-3xl">
        <Field
          label="Slug"
          value={form.slug}
          onChange={(v) => update('slug', v)}
          mono
          disabled={!createMode}
          hint={slugError ?? 'Used in the URL, cannot change later.'}
          className={slugError ? 'border-error' : undefined}
        />
        <Field label="Title" value={form.title} onChange={(v) => update('title', v)} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Category" value={form.category} onChange={(v) => update('category', v)} />
          <Field label="Author" value={form.author} onChange={(v) => update('author', v)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Read Time" value={form.readTime} onChange={(v) => update('readTime', v)} />
          <Field
            label="Published Date"
            value={form.publishedDate}
            onChange={(v) => update('publishedDate', v)}
            hint="Free text shown on the article page, e.g. 'June 2026'."
          />
        </div>
        <TextArea label="Excerpt" value={form.excerpt} onChange={(v) => update('excerpt', v)} rows={2} />

        <div>
          <Field
            label="Image URL"
            value={form.imageUrl}
            onChange={(v) => update('imageUrl', v)}
            hint="Paste an image URL. Direct uploads arrive with the media library."
          />
          {form.imageUrl && (
            <img
              src={form.imageUrl}
              alt=""
              className="mt-3 h-40 object-cover rounded-[2px] border-[0.5px] border-outline-variant"
            />
          )}
        </div>

        <Field label="Figure Caption" value={form.figureCaption} onChange={(v) => update('figureCaption', v)} />
        <TextArea label="Abstract" value={form.abstract} onChange={(v) => update('abstract', v)} rows={4} />
        <TextArea
          label="Introduction"
          value={form.introduction}
          onChange={(v) => update('introduction', v)}
          rows={6}
          hint="Separate paragraphs with a blank line"
        />
        <TextArea
          label="Methodology"
          value={form.methodologyText}
          onChange={(v) => update('methodologyText', v)}
          rows={6}
        />
        <TextArea label="Analysis" value={form.analysisText} onChange={(v) => update('analysisText', v)} rows={6} />
        <StringListEditor
          label="References"
          values={form.references}
          onChange={(v) => update('references', v)}
          addLabel="+ Add Reference"
        />
        <SelectField
          label="Linked Resource"
          value={form.linkedResourceSlug}
          onChange={(v) => update('linkedResourceSlug', v)}
          options={resourceOptions}
          allowEmpty
          emptyLabel="None — no linked resource"
          hint="Points the article's Scholarly Instruments panel at a Resource Hub entry."
        />
      </div>

      <PublishBar dirty={dirty} publishStatus={form.publishStatus} busy={busy} onSave={handleSave} />
      <SaveToast message="Saved" visible={toastVisible} />
    </div>
  );
}
