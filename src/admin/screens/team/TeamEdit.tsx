/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2, AlertTriangle, ChevronLeft } from 'lucide-react';
import { adminDb } from '../../lib/firebaseAdmin';
import { TeamMemberDoc } from '../../../types';
import Field from '../../components/Field';
import TextArea from '../../components/TextArea';
import ToggleField from '../../components/ToggleField';
import LinkListEditor from '../../components/LinkListEditor';
import SaveToast from '../../components/SaveToast';

const blankMember = (): TeamMemberDoc => ({
  slug: '',
  name: '',
  role: '',
  blurb: '',
  photoUrl: '',
  photoPath: '',
  links: [],
  visible: true,
  order: Date.now(),
});

type LoadState = { phase: 'loading' } | { phase: 'ready' } | { phase: 'error'; message: string };

const isValidSlug = (slug: string) => slug.trim().length > 0 && !/[\s/]/.test(slug);

export default function TeamEdit() {
  const { slug: routeSlug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const createMode = routeSlug === 'new';

  const [loaded, setLoaded] = useState<TeamMemberDoc | null>(null);
  const [form, setForm] = useState<TeamMemberDoc>(blankMember());
  const [state, setState] = useState<LoadState>({ phase: createMode ? 'ready' : 'loading' });
  const [busy, setBusy] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [slugError, setSlugError] = useState<string | null>(null);

  useEffect(() => {
    if (createMode || !routeSlug) return;
    let cancelled = false;
    (async () => {
      setState({ phase: 'loading' });
      try {
        const db = adminDb();
        const snap = await getDoc(doc(db, 'team', routeSlug));
        if (cancelled) return;
        if (!snap.exists()) {
          setState({ phase: 'error', message: `No team member found with slug "${routeSlug}".` });
          return;
        }
        const data = snap.data() as TeamMemberDoc;
        setLoaded(data);
        setForm(data);
        setState({ phase: 'ready' });
      } catch (err) {
        if (!cancelled) {
          setState({ phase: 'error', message: err instanceof Error ? err.message : 'Failed to load team member' });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeSlug, createMode]);

  const dirty = createMode || JSON.stringify(form) !== JSON.stringify(loaded);

  const update = <K extends keyof TeamMemberDoc>(key: K, value: TeamMemberDoc[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
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
        photoPath: form.photoPath ?? '',
        updatedAt: serverTimestamp(),
        ...(createMode && { createdAt: serverTimestamp(), order: Date.now() }),
      };
      await setDoc(doc(db, 'team', form.slug), payload, { merge: true });
      setLoaded(form);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2500);
      if (createMode) {
        navigate(`/admin/team/${form.slug}`);
      }
    } catch (err) {
      setState({ phase: 'error', message: err instanceof Error ? err.message : 'Failed to save team member' });
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
          to="/admin/team"
          className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors mb-3"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Team
        </Link>
        <p className="font-mono text-xs uppercase tracking-widest text-secondary font-bold mb-2">
          {createMode ? 'New Member' : 'Edit Member'}
        </p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary">
          {createMode ? 'Create Team Member' : form.name || form.slug}
        </h1>
      </header>

      <div className="flex flex-col gap-6 max-w-3xl">
        <Field
          label="Slug"
          value={form.slug}
          onChange={(v) => update('slug', v)}
          mono
          disabled={!createMode}
          hint={slugError ?? 'Used as the document ID, cannot change later.'}
          className={slugError ? 'border-error' : undefined}
        />
        <Field label="Name" value={form.name} onChange={(v) => update('name', v)} />
        <Field
          label="Role / Title"
          value={form.role}
          onChange={(v) => update('role', v)}
          hint="Display job title, e.g. 'Co-Founder & Lead Full-Stack Developer'. Not an admin permission role."
        />
        <TextArea label="Blurb" value={form.blurb} onChange={(v) => update('blurb', v)} rows={4} />

        <div>
          <Field
            label="Photo URL"
            value={form.photoUrl}
            onChange={(v) => update('photoUrl', v)}
            hint="Optional. Paste an image URL; shown as a circular portrait."
          />
          {form.photoUrl && (
            <img src={form.photoUrl} alt="" className="mt-3 w-20 h-20 rounded-full object-cover" />
          )}
        </div>

        <LinkListEditor label="Links" values={form.links} onChange={(v) => update('links', v)} addLabel="+ Add Link" />

        <ToggleField label="Visible on the site" checked={form.visible} onChange={(v) => update('visible', v)} />
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
