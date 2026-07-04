/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2, AlertTriangle, Palette, RotateCcw } from 'lucide-react';
import { adminDb } from '../../lib/firebaseAdmin';
import { ThemeSettingsDoc } from '../../../types';
import { SEED_THEME_SETTINGS } from '../../../content/seeds';
import SaveToast from '../../components/SaveToast';

interface TokenConfig {
  token: string;
  label: string;
  defaultValue: string;
}

const TOKENS: TokenConfig[] = [
  { token: 'color-primary', label: 'Primary', defaultValue: '#002d1d' },
  { token: 'color-on-primary', label: 'On Primary', defaultValue: '#fcf9f8' },
  { token: 'color-primary-container', label: 'Primary Container', defaultValue: '#1a4332' },
  { token: 'color-secondary', label: 'Secondary', defaultValue: '#775a19' },
  { token: 'color-secondary-container', label: 'Secondary Container', defaultValue: '#fed488' },
  { token: 'color-background', label: 'Background', defaultValue: '#fcf9f8' },
  { token: 'color-surface', label: 'Surface', defaultValue: '#fcf9f8' },
  { token: 'color-surface-container-low', label: 'Surface Container Low', defaultValue: '#f6f3f2' },
  { token: 'color-on-surface', label: 'On Surface', defaultValue: '#1b1c1c' },
  { token: 'color-on-surface-variant', label: 'On Surface Variant', defaultValue: '#414944' },
  { token: 'color-outline', label: 'Outline', defaultValue: '#717973' },
  { token: 'color-outline-variant', label: 'Outline Variant', defaultValue: '#c1c8c2' },
];

type LoadState = { phase: 'loading' } | { phase: 'ready' } | { phase: 'error'; message: string };

const applyOverride = (token: string, value: string) => {
  document.documentElement.style.setProperty(`--${token}`, value);
};

const clearOverride = (token: string) => {
  document.documentElement.style.removeProperty(`--${token}`);
};

export default function ThemeSettings() {
  const [loaded, setLoaded] = useState<Record<string, string>>({});
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [state, setState] = useState<LoadState>({ phase: 'loading' });
  const [busy, setBusy] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setState({ phase: 'loading' });
      try {
        const db = adminDb();
        const snap = await getDoc(doc(db, 'settings', 'theme'));
        if (cancelled) return;
        const data = snap.exists() ? (snap.data() as ThemeSettingsDoc) : SEED_THEME_SETTINGS;
        setLoaded(data.overrides);
        setOverrides(data.overrides);
        Object.entries(data.overrides).forEach(([token, value]) => applyOverride(token, value));
        setState({ phase: 'ready' });
      } catch (err) {
        if (!cancelled) {
          setState({ phase: 'error', message: err instanceof Error ? err.message : 'Failed to load theme' });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const dirty = JSON.stringify(overrides) !== JSON.stringify(loaded);

  const setToken = (token: string, value: string) => {
    setOverrides((prev) => ({ ...prev, [token]: value }));
    applyOverride(token, value);
  };

  const resetToken = (token: string) => {
    setOverrides((prev) => {
      const next = { ...prev };
      delete next[token];
      return next;
    });
    clearOverride(token);
  };

  const resetAll = () => {
    TOKENS.forEach((t) => clearOverride(t.token));
    setOverrides({});
  };

  const handleSave = async () => {
    setBusy(true);
    try {
      const db = adminDb();
      // Only persist tokens that actually differ from their default.
      const cleaned: Record<string, string> = {};
      for (const t of TOKENS) {
        const value = overrides[t.token];
        if (value && value.toLowerCase() !== t.defaultValue.toLowerCase()) {
          cleaned[t.token] = value;
        }
      }
      // No merge: overrides is a map, and merge would deep-merge it — removed
      // tokens would never be deleted from the stored doc.
      await setDoc(doc(db, 'settings', 'theme'), { overrides: cleaned, updatedAt: serverTimestamp() });
      setLoaded(cleaned);
      setOverrides(cleaned);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2500);
    } catch (err) {
      setState({ phase: 'error', message: err instanceof Error ? err.message : 'Failed to save theme' });
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
      <header className="mb-8 border-b-[0.5px] border-outline-variant pb-6 flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-secondary font-bold mb-2">Settings</p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary flex items-center gap-3">
            <Palette className="w-8 h-8 text-secondary stroke-[1.5]" />
            Theme
          </h1>
          <p className="font-sans text-sm text-on-surface-variant mt-2 leading-relaxed max-w-xl">
            Override the site's color tokens. Changes apply to the live site once saved.
          </p>
        </div>
        <button
          type="button"
          onClick={resetAll}
          className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 border-[0.5px] border-outline text-on-surface-variant font-mono text-[11px] uppercase tracking-widest font-semibold rounded-[2px] hover:border-error hover:text-error transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 stroke-[1.5]" />
          Reset All
        </button>
      </header>

      <div className="flex flex-col gap-2 max-w-2xl">
        {TOKENS.map((t) => {
          const current = overrides[t.token] ?? t.defaultValue;
          const modified = current.toLowerCase() !== t.defaultValue.toLowerCase();
          return (
            <div
              key={t.token}
              className="flex items-center gap-3 border-[0.5px] border-outline-variant bg-surface-container-low p-3 rounded-[2px]"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${modified ? 'bg-secondary' : 'bg-transparent'}`}
                aria-hidden="true"
              />
              <div className="min-w-0 flex-grow">
                <p className="font-mono text-xs uppercase font-bold text-on-surface-variant">{t.label}</p>
                <p className="font-mono text-[10px] text-outline">--{t.token}</p>
              </div>
              <input
                type="color"
                value={current}
                onChange={(e) => setToken(t.token, e.target.value)}
                className="w-9 h-9 flex-shrink-0 border-[0.5px] border-outline rounded-[2px] cursor-pointer bg-transparent"
                aria-label={`${t.label} color picker`}
              />
              <input
                value={current}
                onChange={(e) => setToken(t.token, e.target.value)}
                className="w-24 flex-shrink-0 bg-transparent border-b-[0.5px] border-outline focus:outline-none focus:border-primary py-2 text-sm font-mono"
                aria-label={`${t.label} hex value`}
              />
              <button
                type="button"
                onClick={() => resetToken(t.token)}
                disabled={!modified}
                className="flex-shrink-0 px-3 py-1.5 border-[0.5px] border-outline text-on-surface-variant font-mono text-[10px] uppercase tracking-wider font-semibold rounded-[2px] hover:border-error hover:text-error transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Reset
              </button>
            </div>
          );
        })}
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
