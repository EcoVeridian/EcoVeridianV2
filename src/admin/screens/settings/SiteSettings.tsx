/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2, AlertTriangle, Settings, ArrowUp, ArrowDown, X, Plus } from 'lucide-react';
import { adminDb } from '../../lib/firebaseAdmin';
import { SiteSettingsDoc } from '../../../types';
import { SEED_SITE_SETTINGS } from '../../../content/seeds';
import Field from '../../components/Field';
import TextArea from '../../components/TextArea';
import ToggleField from '../../components/ToggleField';
import LinkListEditor from '../../components/LinkListEditor';
import SaveToast from '../../components/SaveToast';

type NavItem = SiteSettingsDoc['nav'][number];

interface NavListEditorProps {
  values: NavItem[];
  onChange: (values: NavItem[]) => void;
}

function NavListEditor({ values, onChange }: NavListEditorProps) {
  const updateAt = (index: number, patch: Partial<NavItem>) => {
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
    onChange([...values, { route: '/path', label: '', visible: true }]);
  };

  return (
    <div className="flex flex-col gap-2">
      {values.map((item, index) => (
        <div
          key={index}
          className="flex flex-col sm:flex-row sm:items-center gap-2 border-[0.5px] border-outline-variant bg-surface-container-low p-3 rounded-[2px]"
        >
          <input
            value={item.label}
            onChange={(e) => updateAt(index, { label: e.target.value })}
            placeholder="Label"
            className="flex-grow bg-transparent border-b-[0.5px] border-outline focus:outline-none focus:border-primary focus:bg-surface-container-low transition-all py-2 text-sm font-sans"
          />
          <input
            value={item.route}
            onChange={(e) => updateAt(index, { route: e.target.value })}
            placeholder="/path"
            className="flex-grow bg-transparent border-b-[0.5px] border-outline focus:outline-none focus:border-primary focus:bg-surface-container-low transition-all py-2 text-sm font-mono"
          />
          <div className="flex items-center gap-2 flex-shrink-0">
            <ToggleField label="Visible" checked={item.visible} onChange={(v) => updateAt(index, { visible: v })} />
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
      ))}
      <button
        type="button"
        onClick={add}
        className="self-start flex items-center gap-1.5 mt-1 font-mono text-[11px] uppercase tracking-wider text-primary hover:text-secondary transition-colors cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5 stroke-[1.5]" />
        Add Nav Item
      </button>
    </div>
  );
}

type LoadState = { phase: 'loading' } | { phase: 'ready' } | { phase: 'error'; message: string };

export default function SiteSettings() {
  const [loaded, setLoaded] = useState<SiteSettingsDoc | null>(null);
  const [form, setForm] = useState<SiteSettingsDoc>(SEED_SITE_SETTINGS);
  const [state, setState] = useState<LoadState>({ phase: 'loading' });
  const [busy, setBusy] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setState({ phase: 'loading' });
      try {
        const db = adminDb();
        const snap = await getDoc(doc(db, 'settings', 'site'));
        if (cancelled) return;
        // Merge so fields added after a doc was first saved (e.g. Cloudinary
        // config) fall back to the seed default instead of showing blank.
        const data = snap.exists()
          ? { ...SEED_SITE_SETTINGS, ...(snap.data() as SiteSettingsDoc) }
          : SEED_SITE_SETTINGS;
        setLoaded(data);
        setForm(data);
        setState({ phase: 'ready' });
      } catch (err) {
        if (!cancelled) {
          setState({ phase: 'error', message: err instanceof Error ? err.message : 'Failed to load settings' });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const dirty = JSON.stringify(form) !== JSON.stringify(loaded);

  const update = <K extends keyof SiteSettingsDoc>(key: K, value: SiteSettingsDoc[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateSeo = <K extends keyof SiteSettingsDoc['seo']>(key: K, value: SiteSettingsDoc['seo'][K]) => {
    setForm((prev) => ({ ...prev, seo: { ...prev.seo, [key]: value } }));
  };

  const updateAnnouncement = <K extends keyof SiteSettingsDoc['announcement']>(
    key: K,
    value: SiteSettingsDoc['announcement'][K],
  ) => {
    setForm((prev) => ({ ...prev, announcement: { ...prev.announcement, [key]: value } }));
  };

  const handleSave = async () => {
    setBusy(true);
    try {
      const db = adminDb();
      await setDoc(doc(db, 'settings', 'site'), { ...form, updatedAt: serverTimestamp() }, { merge: true });
      setLoaded(form);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2500);
    } catch (err) {
      setState({ phase: 'error', message: err instanceof Error ? err.message : 'Failed to save settings' });
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
        <p className="font-mono text-xs uppercase tracking-widest text-secondary font-bold mb-2">Settings</p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary flex items-center gap-3">
          <Settings className="w-8 h-8 text-secondary stroke-[1.5]" />
          Site Settings
        </h1>
        <p className="font-sans text-sm text-on-surface-variant mt-2 leading-relaxed max-w-xl">
          Contact details, socials, footer, navigation, SEO, and the site-wide announcement banner.
        </p>
      </header>

      <div className="flex flex-col gap-10 max-w-3xl">
        <section className="flex flex-col gap-6">
          <h2 className="font-serif text-xl font-bold text-primary">Contact</h2>
          <Field label="Contact Email" value={form.contactEmail} onChange={(v) => update('contactEmail', v)} />
          <Field
            label="FormSubmit Email"
            value={form.formSubmitEmail}
            onChange={(v) => update('formSubmitEmail', v)}
            hint="Inquiries are emailed here via FormSubmit"
          />
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="font-serif text-xl font-bold text-primary">Resource Hub Uploads</h2>
          <Field
            label="Cloudinary Cloud Name"
            value={form.cloudinaryCloudName}
            onChange={(v) => update('cloudinaryCloudName', v)}
            hint="From your Cloudinary Dashboard. Required for the Submit Your Journal/Project form to accept file uploads."
          />
          <Field
            label="Cloudinary Unsigned Upload Preset"
            value={form.cloudinaryUploadPreset}
            onChange={(v) => update('cloudinaryUploadPreset', v)}
            hint="Settings -> Upload -> Upload presets -> Add upload preset, with Signing Mode set to Unsigned"
          />
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="font-serif text-xl font-bold text-primary">Social Links</h2>
          <LinkListEditor label="Socials" values={form.socials} onChange={(v) => update('socials', v)} addLabel="+ Add Social" />
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="font-serif text-xl font-bold text-primary">Footer</h2>
          <Field label="Footer Tagline" value={form.footerTagline} onChange={(v) => update('footerTagline', v)} />
          <Field label="Copyright" value={form.copyright} onChange={(v) => update('copyright', v)} />
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-serif text-xl font-bold text-primary">Navigation</h2>
          <NavListEditor values={form.nav} onChange={(v) => update('nav', v)} />
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="font-serif text-xl font-bold text-primary">SEO</h2>
          <Field label="Title" value={form.seo.title} onChange={(v) => updateSeo('title', v)} />
          <TextArea label="Description" value={form.seo.description} onChange={(v) => updateSeo('description', v)} rows={2} />
          <Field label="OG Image URL" value={form.seo.ogImageUrl} onChange={(v) => updateSeo('ogImageUrl', v)} />
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="font-serif text-xl font-bold text-primary">Announcement Banner</h2>
          <ToggleField
            label="Enabled"
            checked={form.announcement.enabled}
            onChange={(v) => updateAnnouncement('enabled', v)}
          />
          <Field label="Text" value={form.announcement.text} onChange={(v) => updateAnnouncement('text', v)} />
          <Field
            label="Link URL"
            value={form.announcement.linkUrl}
            onChange={(v) => updateAnnouncement('linkUrl', v)}
            hint="Internal path (/partner) or full URL"
          />
          <Field
            label="Link Label"
            value={form.announcement.linkLabel}
            onChange={(v) => updateAnnouncement('linkLabel', v)}
          />
        </section>
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
