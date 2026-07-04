/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2, AlertTriangle, ChevronLeft } from 'lucide-react';
import { adminDb } from '../../lib/firebaseAdmin';
import { FrameworkDoc, PublishStatus, TaxonomyDoc } from '../../../types';
import Field from '../../components/Field';
import TextArea from '../../components/TextArea';
import SelectField from '../../components/SelectField';
import TableEditor from '../../components/TableEditor';
import SectionListEditor from '../../components/SectionListEditor';
import PublishBar from '../../components/PublishBar';
import SaveToast from '../../components/SaveToast';

const blankFramework = (): FrameworkDoc => ({
  slug: '',
  title: '',
  discipline: '',
  domain: '',
  format: '',
  size: '',
  lastUpdated: '',
  badge: 'Standard',
  description: '',
  coverage: '',
  frequency: '',
  sampleTable: null,
  reportContent: [],
  fileUrl: '',
  filePath: '',
  publishStatus: 'draft',
  order: Date.now(),
});

const BADGE_OPTIONS = [
  { value: 'Verified', label: 'Verified' },
  { value: 'Standard', label: 'Standard' },
  { value: 'Archived', label: 'Archived' },
];

type LoadState = { phase: 'loading' } | { phase: 'ready' } | { phase: 'error'; message: string };

const isValidSlug = (slug: string) => slug.trim().length > 0 && !/[\s/]/.test(slug);

export default function FrameworkEdit() {
  const { slug: routeSlug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const createMode = routeSlug === 'new';

  const [loaded, setLoaded] = useState<FrameworkDoc | null>(null);
  const [form, setForm] = useState<FrameworkDoc>(blankFramework());
  const [state, setState] = useState<LoadState>({ phase: createMode ? 'ready' : 'loading' });
  const [busy, setBusy] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [slugError, setSlugError] = useState<string | null>(null);
  const [disciplineOptions, setDisciplineOptions] = useState<{ value: string; label: string }[]>([]);
  const [domainOptions, setDomainOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const db = adminDb();
        const [disciplinesSnap, domainsSnap] = await Promise.all([
          getDoc(doc(db, 'taxonomies', 'disciplines')),
          getDoc(doc(db, 'taxonomies', 'domains')),
        ]);
        if (disciplinesSnap.exists()) {
          const data = disciplinesSnap.data() as TaxonomyDoc;
          setDisciplineOptions(
            [...data.values].sort((a, b) => a.order - b.order).map((v) => ({ value: v.label, label: v.label })),
          );
        }
        if (domainsSnap.exists()) {
          const data = domainsSnap.data() as TaxonomyDoc;
          setDomainOptions(
            [...data.values].sort((a, b) => a.order - b.order).map((v) => ({ value: v.label, label: v.label })),
          );
        }
      } catch {
        // Non-fatal: selects fall back to an empty option list; taxonomies may not be seeded yet.
      }
    })();
  }, []);

  useEffect(() => {
    if (createMode || !routeSlug) return;
    let cancelled = false;
    (async () => {
      setState({ phase: 'loading' });
      try {
        const db = adminDb();
        const snap = await getDoc(doc(db, 'frameworks', routeSlug));
        if (cancelled) return;
        if (!snap.exists()) {
          setState({ phase: 'error', message: `No resource found with slug "${routeSlug}".` });
          return;
        }
        const data = snap.data() as FrameworkDoc;
        setLoaded(data);
        setForm(data);
        setState({ phase: 'ready' });
      } catch (err) {
        if (!cancelled) {
          setState({ phase: 'error', message: err instanceof Error ? err.message : 'Failed to load resource' });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeSlug, createMode]);

  const dirty = createMode || JSON.stringify(form) !== JSON.stringify(loaded);

  const update = <K extends keyof FrameworkDoc>(key: K, value: FrameworkDoc[K]) => {
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
        filePath: form.filePath ?? '',
        updatedAt: serverTimestamp(),
        ...(createMode && { createdAt: serverTimestamp(), order: Date.now() }),
      };
      await setDoc(doc(db, 'frameworks', form.slug), payload, { merge: true });
      setForm((prev) => ({ ...prev, publishStatus: status }));
      setLoaded({ ...form, publishStatus: status });
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2500);
      if (createMode) {
        navigate(`/admin/resources/${form.slug}`);
      }
    } catch (err) {
      setState({ phase: 'error', message: err instanceof Error ? err.message : 'Failed to save resource' });
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
          to="/admin/resources"
          className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors mb-3"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Resources
        </Link>
        <p className="font-mono text-xs uppercase tracking-widest text-secondary font-bold mb-2">
          {createMode ? 'New Resource' : 'Edit Resource'}
        </p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary">
          {createMode ? 'Create Resource' : form.title || form.slug}
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
          <SelectField
            label="Discipline"
            value={form.discipline}
            onChange={(v) => update('discipline', v)}
            options={disciplineOptions}
          />
          <SelectField
            label="Domain"
            value={form.domain}
            onChange={(v) => update('domain', v)}
            options={domainOptions}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SelectField label="Badge" value={form.badge} onChange={(v) => update('badge', v)} options={BADGE_OPTIONS} />
          <Field label="Format" value={form.format} onChange={(v) => update('format', v)} />
          <Field label="Size" value={form.size} onChange={(v) => update('size', v)} />
        </div>

        <Field
          label="Last Updated"
          value={form.lastUpdated}
          onChange={(v) => update('lastUpdated', v)}
          hint="YYYY-MM-DD"
        />
        <TextArea label="Description" value={form.description} onChange={(v) => update('description', v)} rows={4} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Coverage" value={form.coverage} onChange={(v) => update('coverage', v)} />
          <Field label="Frequency" value={form.frequency} onChange={(v) => update('frequency', v)} />
        </div>
        <Field
          label="File URL"
          value={form.fileUrl}
          onChange={(v) => update('fileUrl', v)}
          hint="Optional: URL or /documents/... path of the source file"
        />

        <TableEditor label="Sample Table" value={form.sampleTable} onChange={(v) => update('sampleTable', v)} />
        <SectionListEditor
          label="Report Content"
          values={form.reportContent}
          onChange={(v) => update('reportContent', v)}
        />
      </div>

      <PublishBar dirty={dirty} publishStatus={form.publishStatus} busy={busy} onSave={handleSave} />
      <SaveToast message="Saved" visible={toastVisible} />
    </div>
  );
}
