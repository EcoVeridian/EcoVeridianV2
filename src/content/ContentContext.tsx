/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Public content store.
 *
 * Resolution order for every piece of content:
 *   Firestore (fresh) → localStorage cache (previous visit) → bundled seeds.
 * The site therefore renders instantly and never blanks out, even if
 * Firestore is unreachable or unseeded.
 *
 * The homepage bundle (site settings, theme, home page, articles) is fetched
 * in parallel on boot; everything else is fetched lazily the first time a
 * route needs it. One-shot reads only — no snapshot listeners on the public
 * site.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';
import {
  ArticleDoc,
  FrameworkDoc,
  TeamMemberDoc,
  InternDoc,
  TaxonomyDoc,
  PageHomeDoc,
  PageAboutDoc,
  PageInstitutionalDoc,
  PagePartnerDoc,
  PageTeamDoc,
  SiteSettingsDoc,
  ThemeSettingsDoc,
} from '../types';
import { isFirebaseConfigured } from '../lib/firebase';
import { fetchPublished, fetchAll, fetchTaxonomies, fetchSingleton } from './publicDb';
import {
  SEED_ARTICLES,
  SEED_FRAMEWORKS,
  SEED_TEAM,
  SEED_INTERNS,
  SEED_TAXONOMIES,
  SEED_PAGE_HOME,
  SEED_PAGE_ABOUT,
  SEED_PAGE_INSTITUTIONAL,
  SEED_PAGE_PARTNER,
  SEED_PAGE_TEAM,
  SEED_SITE_SETTINGS,
  SEED_THEME_SETTINGS,
} from './seeds';

interface ContentState {
  articles: ArticleDoc[] | null;
  frameworks: FrameworkDoc[] | null;
  team: TeamMemberDoc[] | null;
  interns: InternDoc[] | null;
  taxonomies: Record<string, TaxonomyDoc> | null;
  pageHome: PageHomeDoc | null;
  pageAbout: PageAboutDoc | null;
  pageInstitutional: PageInstitutionalDoc | null;
  pagePartner: PagePartnerDoc | null;
  pageTeam: PageTeamDoc | null;
  siteSettings: SiteSettingsDoc | null;
  themeSettings: ThemeSettingsDoc | null;
}

type ContentKey = keyof ContentState;

const EMPTY_STATE: ContentState = {
  articles: null,
  frameworks: null,
  team: null,
  interns: null,
  taxonomies: null,
  pageHome: null,
  pageAbout: null,
  pageInstitutional: null,
  pagePartner: null,
  pageTeam: null,
  siteSettings: null,
  themeSettings: null,
};

const CACHE_KEY = 'ev-content-v1';

function loadCache(): Partial<ContentState> {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as Partial<ContentState>) : {};
  } catch {
    return {};
  }
}

function saveCache(state: ContentState) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(state));
  } catch {
    /* storage full/unavailable — cache is best-effort */
  }
}

// Fetchers per key; each resolves null on failure so state keeps its
// cached/seed fallback.
const FETCHERS: { [K in ContentKey]: () => Promise<ContentState[K]> } = {
  articles: () => fetchPublished<ArticleDoc>('articles'),
  frameworks: () => fetchPublished<FrameworkDoc>('frameworks'),
  team: () => fetchAll<TeamMemberDoc>('team'),
  interns: () => fetchAll<InternDoc>('interns'),
  taxonomies: () => fetchTaxonomies<TaxonomyDoc>(),
  pageHome: () => fetchSingleton<PageHomeDoc>('pages', 'home'),
  pageAbout: () => fetchSingleton<PageAboutDoc>('pages', 'about'),
  pageInstitutional: () => fetchSingleton<PageInstitutionalDoc>('pages', 'institutional'),
  pagePartner: () => fetchSingleton<PagePartnerDoc>('pages', 'partner'),
  pageTeam: () => fetchSingleton<PageTeamDoc>('pages', 'team'),
  siteSettings: () => fetchSingleton<SiteSettingsDoc>('settings', 'site'),
  themeSettings: () => fetchSingleton<ThemeSettingsDoc>('settings', 'theme'),
};

// Fetched together on boot: everything the shell + homepage render needs.
const BOOT_KEYS: ContentKey[] = ['siteSettings', 'themeSettings', 'pageHome', 'articles'];

interface ContentContextValue {
  state: ContentState;
  ensure: (key: ContentKey) => void;
}

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ContentState>(() => ({
    ...EMPTY_STATE,
    ...loadCache(),
  }));
  const requested = useRef<Set<ContentKey>>(new Set());

  const ensure = useCallback((key: ContentKey) => {
    if (!isFirebaseConfigured || requested.current.has(key)) return;
    requested.current.add(key);
    FETCHERS[key]().then((value) => {
      if (value !== null) {
        setState((prev) => {
          const next = { ...prev, [key]: value };
          saveCache(next);
          return next;
        });
      }
    });
  }, []);

  useEffect(() => {
    BOOT_KEYS.forEach(ensure);
  }, [ensure]);

  // Apply theme overrides as CSS custom properties on <html>. Tailwind v4
  // utilities compile to var(--color-*) so overriding the variables reskins
  // the whole site at runtime.
  const appliedThemeKeys = useRef<string[]>([]);
  useEffect(() => {
    const overrides = state.themeSettings?.overrides ?? {};
    const root = document.documentElement;
    for (const key of appliedThemeKeys.current) {
      root.style.removeProperty(`--${key}`);
    }
    appliedThemeKeys.current = Object.keys(overrides);
    for (const [key, value] of Object.entries(overrides)) {
      root.style.setProperty(`--${key}`, value);
    }
  }, [state.themeSettings]);

  return <ContentContext.Provider value={{ state, ensure }}>{children}</ContentContext.Provider>;
}

function useContent(): ContentContextValue {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('Content hooks must be used inside ContentProvider');
  return ctx;
}

function useContentKey<K extends ContentKey>(key: K, fallback: NonNullable<ContentState[K]>) {
  const { state, ensure } = useContent();
  useEffect(() => ensure(key), [ensure, key]);
  return state[key] ?? fallback;
}

export const useArticles = () => useContentKey('articles', SEED_ARTICLES);
export const useFrameworks = () => useContentKey('frameworks', SEED_FRAMEWORKS);
export const useTeam = () => useContentKey('team', SEED_TEAM);
export const useInterns = () => useContentKey('interns', SEED_INTERNS);
export const useTaxonomies = () => useContentKey('taxonomies', SEED_TAXONOMIES);
export const usePageHome = () => useContentKey('pageHome', SEED_PAGE_HOME);
export const usePageAbout = () => useContentKey('pageAbout', SEED_PAGE_ABOUT);
export const usePageInstitutional = () => useContentKey('pageInstitutional', SEED_PAGE_INSTITUTIONAL);
export const usePagePartner = () => useContentKey('pagePartner', SEED_PAGE_PARTNER);
export const usePageTeam = () => useContentKey('pageTeam', SEED_PAGE_TEAM);
export const useSiteSettings = () => ({ ...SEED_SITE_SETTINGS, ...useContentKey('siteSettings', SEED_SITE_SETTINGS) });
export const useThemeSettings = () => useContentKey('themeSettings', SEED_THEME_SETTINGS);
