/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import {
  collection,
  doc,
  getCountFromServer,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import { Loader2, Check, AlertTriangle, DatabaseBackup } from 'lucide-react';
import { adminDb } from '../lib/firebaseAdmin';
import {
  SEED_ARTICLES,
  SEED_FRAMEWORKS,
  SEED_TEAM,
  SEED_TAXONOMIES,
  SEED_PAGE_HOME,
  SEED_PAGE_ABOUT,
  SEED_PAGE_INSTITUTIONAL,
  SEED_PAGE_PARTNER,
  SEED_SITE_SETTINGS,
  SEED_THEME_SETTINGS,
  SEED_ROLES,
} from '../../content/seeds';

interface SeedGroup {
  key: string;
  label: string;
  collectionName: string;
  description: string;
  seedCount: number;
  // Returns [docId, data] pairs to write.
  entries: () => Array<[string, Record<string, unknown>]>;
}

const withTimestamps = (data: object) => ({
  ...data,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
});

const GROUPS: SeedGroup[] = [
  {
    key: 'articles',
    label: 'Articles',
    collectionName: 'articles',
    description: 'Research articles shown on the home page and /articles.',
    seedCount: SEED_ARTICLES.length,
    entries: () => SEED_ARTICLES.map((a) => [a.slug, withTimestamps(a)]),
  },
  {
    key: 'frameworks',
    label: 'Resource Hub',
    collectionName: 'frameworks',
    description: 'Resource Hub entries with sample tables and report sections.',
    seedCount: SEED_FRAMEWORKS.length,
    entries: () => SEED_FRAMEWORKS.map((f) => [f.slug, withTimestamps(f)]),
  },
  {
    key: 'team',
    label: 'Team Members',
    collectionName: 'team',
    description: 'Team bios and links for the /team page.',
    seedCount: SEED_TEAM.length,
    entries: () => SEED_TEAM.map((t) => [t.slug, withTimestamps(t)]),
  },
  {
    key: 'taxonomies',
    label: 'Taxonomies',
    collectionName: 'taxonomies',
    description: 'Topic tags, formats, and article categories used in filters.',
    seedCount: Object.keys(SEED_TAXONOMIES).length,
    entries: () => Object.entries(SEED_TAXONOMIES).map(([id, docData]) => [id, { ...docData }]),
  },
  {
    key: 'pages',
    label: 'Page Content',
    collectionName: 'pages',
    description: 'Copy for the home, about, collaborate, and partner pages.',
    seedCount: 4,
    entries: () => [
      ['home', { ...SEED_PAGE_HOME }],
      ['about', { ...SEED_PAGE_ABOUT }],
      ['institutional', { ...SEED_PAGE_INSTITUTIONAL }],
      ['partner', { ...SEED_PAGE_PARTNER }],
    ],
  },
  {
    key: 'settings',
    label: 'Site Settings',
    collectionName: 'settings',
    description: 'Contact email, socials, footer, nav, SEO, and theme overrides.',
    seedCount: 2,
    entries: () => [
      ['site', { ...SEED_SITE_SETTINGS }],
      ['theme', { ...SEED_THEME_SETTINGS }],
    ],
  },
  {
    key: 'roles',
    label: 'Roles',
    collectionName: 'roles',
    description: 'Built-in Owner and Editor roles for the permission system.',
    seedCount: Object.keys(SEED_ROLES).length,
    entries: () => Object.entries(SEED_ROLES).map(([id, role]) => [id, { ...role }]),
  },
];

type GroupState =
  | { phase: 'checking' }
  | { phase: 'idle'; existing: number }
  | { phase: 'importing'; existing: number }
  | { phase: 'done'; imported: number }
  | { phase: 'error'; message: string; existing: number };

export default function ImportDefaults() {
  const [states, setStates] = useState<Record<string, GroupState>>(
    Object.fromEntries(GROUPS.map((g) => [g.key, { phase: 'checking' } as GroupState])),
  );
  const [overwrite, setOverwrite] = useState(false);

  const setGroupState = (key: string, state: GroupState) =>
    setStates((prev) => ({ ...prev, [key]: state }));

  const refreshCounts = async () => {
    const db = adminDb();
    await Promise.all(
      GROUPS.map(async (group) => {
        try {
          const snap = await getCountFromServer(collection(db, group.collectionName));
          setGroupState(group.key, { phase: 'idle', existing: snap.data().count });
        } catch (err) {
          setGroupState(group.key, {
            phase: 'error',
            message: err instanceof Error ? err.message : 'Failed to read collection',
            existing: 0,
          });
        }
      }),
    );
  };

  useEffect(() => {
    refreshCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runImport = async (group: SeedGroup) => {
    const current = states[group.key];
    const existing = current && 'existing' in current ? current.existing : 0;
    if (existing > 0 && !overwrite) return;

    setGroupState(group.key, { phase: 'importing', existing });
    try {
      const db = adminDb();
      const batch = writeBatch(db);
      const entries = group.entries();
      for (const [id, data] of entries) {
        batch.set(doc(db, group.collectionName, id), data);
      }
      await batch.commit();
      setGroupState(group.key, { phase: 'done', imported: entries.length });
    } catch (err) {
      setGroupState(group.key, {
        phase: 'error',
        message: err instanceof Error ? err.message : 'Import failed',
        existing,
      });
    }
  };

  return (
    <div className="animate-fade-in">
      <header className="mb-8 border-b-[0.5px] border-outline-variant pb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-secondary font-bold mb-2">
          Seeding
        </p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary flex items-center gap-3">
          <DatabaseBackup className="w-8 h-8 text-secondary stroke-[1.5]" />
          Import Defaults
        </h1>
        <p className="font-sans text-sm text-on-surface-variant mt-2 leading-relaxed max-w-xl">
          Writes the site's built-in content into Firestore so it becomes editable here. Groups
          that already contain data are skipped unless overwrite is enabled.
        </p>
      </header>

      <label className="flex items-center gap-3 mb-6 cursor-pointer select-none max-w-xl border-[0.5px] border-outline-variant bg-surface-container-low p-4 rounded-[2px]">
        <input
          type="checkbox"
          checked={overwrite}
          onChange={(e) => setOverwrite(e.target.checked)}
          className="appearance-none w-4 h-4 border-[0.5px] border-outline rounded-sm checked:bg-error checked:border-error transition-colors cursor-pointer flex-shrink-0"
        />
        <span className="font-sans text-xs text-on-surface-variant leading-relaxed">
          <strong className="text-error">Overwrite existing documents.</strong> Replaces any edits
          made since the last import for docs with matching IDs. Leave off unless you know you want
          to reset content.
        </span>
      </label>

      <div className="flex flex-col gap-4 max-w-xl">
        {GROUPS.map((group) => {
          const state = states[group.key];
          const existing = state && 'existing' in state ? state.existing : 0;
          const blocked = state.phase === 'idle' && existing > 0 && !overwrite;

          return (
            <div
              key={group.key}
              className="border-[0.5px] border-outline-variant bg-surface-container-lowest p-5 rounded-[2px] flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <h2 className="font-serif text-lg font-bold text-primary">{group.label}</h2>
                <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                  {group.description}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-outline mt-1.5">
                  {group.seedCount} seed docs
                  {state.phase !== 'checking' && ` · ${existing} in Firestore`}
                </p>
                {state.phase === 'error' && (
                  <p className="font-sans text-xs text-error mt-1.5 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                    {state.message}
                  </p>
                )}
                {blocked && (
                  <p className="font-sans text-[11px] text-outline mt-1.5">
                    Skipped: collection already has data (enable overwrite to replace).
                  </p>
                )}
              </div>

              <div className="flex-shrink-0">
                {state.phase === 'checking' && (
                  <Loader2 className="w-5 h-5 text-outline animate-spin" />
                )}
                {state.phase === 'importing' && (
                  <Loader2 className="w-5 h-5 text-secondary animate-spin" />
                )}
                {state.phase === 'done' && (
                  <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-primary font-bold">
                    <Check className="w-4 h-4" />
                    Imported {state.imported}
                  </span>
                )}
                {(state.phase === 'idle' || state.phase === 'error') && (
                  <button
                    onClick={() => runImport(group)}
                    disabled={blocked}
                    className="px-5 py-2.5 bg-primary text-on-primary font-mono text-[11px] uppercase tracking-widest font-semibold rounded-[2px] hover:bg-primary-container transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Import
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
