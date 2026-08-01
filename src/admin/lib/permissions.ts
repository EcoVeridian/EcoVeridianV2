/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PermissionKey } from '../../types';

/** Display metadata for each capability, used by the Roles editor. */
export const PERMISSION_INFO: Record<PermissionKey, { label: string; description: string }> = {
  articles: {
    label: 'Articles',
    description: 'Create, edit, publish, and delete research articles.',
  },
  resources: {
    label: 'Resources',
    description: 'Manage Resource Hub entries, sample tables, and report sections.',
  },
  team: {
    label: 'Team',
    description: 'Manage team member profiles and intern names on the Team page.',
  },
  taxonomies: {
    label: 'Taxonomies',
    description: 'Manage topic tags, formats, and article categories.',
  },
  pages: {
    label: 'Pages',
    description: 'Edit page copy: home, about, ways to work with us, partner.',
  },
  settings: {
    label: 'Site Settings & Theme',
    description: 'Contact info, socials, navigation, SEO, announcement banner, theme colors.',
  },
  inquiries: {
    label: 'Inquiries',
    description: 'Read and manage the partner inquiry inbox (contains visitor contact details).',
  },
  media: {
    label: 'Media',
    description: 'Upload and delete files in the media library.',
  },
  users: {
    label: 'Admin Users & Roles',
    description:
      'Invite admins, assign roles, and define roles. Effectively grants full control — assign carefully.',
  },
};
