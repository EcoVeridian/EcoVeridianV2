/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';

export const DEFAULT_TITLE = 'EcoVeridian';
export const DEFAULT_DESCRIPTION =
  'EcoVeridian is a student-led environmental research team offering free forecasting and data analysis support to organizations.';

function setMetaContent(selector: string, content: string) {
  const el = document.head.querySelector<HTMLMetaElement>(selector);
  if (el) el.setAttribute('content', content);
}

/**
 * Per-route document metadata. This is a client-rendered SPA: search engines
 * that execute JS see these values; link-preview crawlers only see the static
 * defaults in index.html.
 */
export function useMeta(title?: string, description?: string) {
  useEffect(() => {
    const resolvedTitle = title ?? DEFAULT_TITLE;
    const resolvedDescription = description ?? DEFAULT_DESCRIPTION;
    document.title = resolvedTitle;
    setMetaContent('meta[name="description"]', resolvedDescription);
    setMetaContent('meta[property="og:title"]', resolvedTitle);
    setMetaContent('meta[property="og:description"]', resolvedDescription);
  }, [title, description]);
}
