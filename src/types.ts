/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface EnvironmentalFramework {
  id: string;
  title: string;
  // Taxonomy values (e.g. 'Tourism Forecasting', 'Written Report') — kept as
  // string so they can be admin-managed in Firestore rather than hardcoded.
  discipline: string;
  domain: string;
  format: string;
  size: string;
  lastUpdated: string;
  status: string; // 'Verified' | 'Archived' | 'Standard'
  description: string;
  coverage: string;
  frequency: string;
  sampleData?: Array<Record<string, string | number>>;
  reportContent?: Array<{ heading: string; body: string }>;
  fileUrl?: string;
}

export interface ScholarlyArticle {
  id: string;
  title: string;
  category: string; // taxonomy value, e.g. 'Flagship Project' | 'Case Study' | 'Methodology' | 'Team Update'
  author: string;
  readTime: string;
  excerpt: string;
  image: string;
  figureCaption?: string;
  abstract: string;
  introduction: string;
  methodologyText: string;
  analysisText: string;
  references: string[];
}

export interface InquiryFormState {
  investigatorName: string;
  institution: string;
  returnRelay: string;
  classification: string;
  dossier: string;
}

/* ------------------------------------------------------------------------
 * Firestore document shapes (CMS)
 *
 * Content lives in Firestore and is edited from /admin. The bundled seeds in
 * src/content/seeds.ts use these same shapes, so the public site can fall
 * back to them when Firestore is unreachable or not yet seeded.
 * ---------------------------------------------------------------------- */

export type PublishStatus = 'draft' | 'published';

// Firestore forbids nested arrays and does not preserve map key order, so
// tabular sample data is stored as an explicit column list + cell rows.
export interface SampleTable {
  columns: string[];
  rows: Array<{ cells: string[] }>;
}

export interface ArticleDoc {
  slug: string; // doc id, e.g. 'ART-001'; also the /articles/:slug URL segment
  title: string;
  category: string;
  author: string;
  readTime: string;
  publishedDate: string; // Display string shown on the article page, e.g. 'June 2026'
  excerpt: string;
  imageUrl: string;
  imagePath: string; // Storage path when uploaded via admin; '' for external URLs
  figureCaption: string;
  abstract: string;
  introduction: string;
  methodologyText: string;
  analysisText: string;
  references: string[];
  linkedResourceSlug: string; // frameworks/{slug} doc id to link to in the Resource Hub; '' for none
  publishStatus: PublishStatus;
  order: number;
}

export interface FrameworkDoc {
  slug: string; // doc id + display code, e.g. 'EV-TOUR-2026-01'
  title: string;
  discipline: string;
  domain: string;
  format: string;
  size: string;
  lastUpdated: string;
  badge: string; // 'Verified' | 'Archived' | 'Standard'
  description: string;
  coverage: string;
  frequency: string;
  sampleTable: SampleTable | null;
  reportContent: Array<{ heading: string; body: string }>;
  fileUrl: string;
  filePath: string;
  // "Download Verified Sample" button overrides. sampleUrl empty → the button
  // generates a CSV from sampleTable as before; sampleLabel empty → it shows
  // the default "Download Verified Sample (.CSV)" text.
  sampleUrl: string;
  sampleLabel: string;
  publishStatus: PublishStatus;
  order: number;
}

export interface TeamMemberDoc {
  slug: string;
  name: string;
  role: string;
  blurb: string;
  photoUrl: string;
  photoPath: string;
  links: Array<{ label: string; url: string }>;
  visible: boolean;
  order: number;
}

export interface TaxonomyValue {
  id: string;
  label: string;
  order: number;
}

// One doc per taxonomy: taxonomies/disciplines, /domains, /categories.
export interface TaxonomyDoc {
  values: TaxonomyValue[];
}

export interface PageHomeDoc {
  badges: string[];
  heading: string; // '\n' marks the desktop line break
  tagline: string;
  ctaLabel: string;
  heroFigureCaption: string;
  archiveHeading: string;
  archiveKicker: string;
  heroArticleSlug: string;
  flagshipArticleSlug: string;
  flagshipKicker: string;
  card1ArticleSlug: string;
  card1Kicker: string;
  card2ArticleSlug: string;
  card2Kicker: string;
}

export interface PillarItem {
  icon: string; // lucide icon name from the admin allowlist
  title: string;
  body: string;
}

export interface PageAboutDoc {
  kicker: string;
  heading: string;
  intro: string;
  whyHeading: string;
  whyParagraphs: string[];
  sidebarHeading: string;
  sidebarItems: string[];
  approachHeading: string;
  pillars: PillarItem[];
  closingNote: string;
}

export interface CollabTier {
  icon: string;
  title: string;
  body: string;
  bullets: string[];
  badge: string; // '' for none
  highlighted: boolean;
}

export interface PageInstitutionalDoc {
  kicker: string;
  heading: string;
  intro: string;
  tiersHeading: string;
  tiers: CollabTier[];
  estimator: {
    heading: string;
    // Matched in order: first threshold with score <= maxScore wins.
    thresholds: Array<{ maxScore: number; label: string }>;
    note: string;
    ctaLabel: string;
  };
}

export interface PagePartnerDoc {
  heading: string;
  intro: string;
  noticeHeading: string;
  noticeBody: string;
  inquiryTypes: string[];
  responseNote: string;
}

export interface SiteSettingsDoc {
  contactEmail: string;
  formSubmitEmail: string;
  socials: Array<{ label: string; url: string }>;
  footerTagline: string;
  copyright: string;
  nav: Array<{ route: string; label: string; visible: boolean }>;
  seo: { title: string; description: string; ogImageUrl: string };
  announcement: { enabled: boolean; text: string; linkUrl: string; linkLabel: string };
}

export interface ThemeSettingsDoc {
  // CSS custom property overrides, keyed without the '--' prefix,
  // e.g. { 'color-primary': '#002d1d' }. Empty = site defaults.
  overrides: Record<string, string>;
}

export type InquiryStatus = 'unread' | 'read' | 'archived';

export interface InquiryDoc {
  name: string;
  organization: string;
  email: string;
  inquiryType: string;
  details: string;
  status: InquiryStatus;
  createdAt: unknown; // Firestore Timestamp
}

/**
 * Granular admin capabilities. Enforced in three layers: firestore.rules,
 * storage.rules (media), and the admin UI. Adding a key here requires adding
 * it in the rules files too.
 */
export type PermissionKey =
  | 'articles' // create/edit/delete articles
  | 'resources' // create/edit/delete resource hub entries
  | 'team' // manage team members
  | 'taxonomies' // manage topic tags / formats / categories
  | 'pages' // edit page copy (home, about, collaborate, partner)
  | 'settings' // site settings + theme
  | 'inquiries' // read and manage the inquiry inbox
  | 'media' // upload/delete files in the media library
  | 'users'; // manage admins, invites, and roles (effectively full control)

export const ALL_PERMISSIONS: PermissionKey[] = [
  'articles',
  'resources',
  'team',
  'taxonomies',
  'pages',
  'settings',
  'inquiries',
  'media',
  'users',
];

export type PermissionMap = Record<PermissionKey, boolean>;

/**
 * roles/{roleId}. The 'owner' role is a hardcoded superuser: immutable,
 * undeletable, and treated as all-permissions in rules and UI regardless of
 * its stored permissions map — so owners can never lock themselves out.
 */
export interface RoleDoc {
  name: string;
  description: string;
  permissions: PermissionMap;
  builtIn: boolean;
  order: number;
}

// Role id referencing roles/{roleId} ('owner' and 'editor' are seeded).
export type AdminRole = string;

export interface AdminDoc {
  email: string;
  displayName: string;
  role: AdminRole;
}

export interface AdminInviteDoc {
  role: AdminRole;
  invitedBy: string;
}
