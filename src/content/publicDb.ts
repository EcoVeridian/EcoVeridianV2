/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Read-only Firestore access for the public site, using firestore/lite
 * (REST-based, a fraction of the full SDK's size — the public site only ever
 * does one-shot reads).
 *
 * Every function resolves to null on failure so callers can fall back to the
 * bundled seeds. IMPORTANT: rules are not filters — published-only queries
 * MUST keep the where('publishStatus'...) clause or the whole query is
 * rejected for anonymous visitors.
 */

import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  addDoc,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore/lite';
import { getFirebaseApp } from '../lib/firebase';

function liteDb(): Firestore | null {
  const app = getFirebaseApp();
  return app ? getFirestore(app) : null;
}

function warn(what: string, err: unknown) {
  console.warn(`[content] Failed to fetch ${what}; using bundled fallback.`, err);
}

const byOrder = (a: { order?: number }, b: { order?: number }) =>
  (a.order ?? 0) - (b.order ?? 0);

/** Published docs from articles/frameworks, sorted by `order`. */
export async function fetchPublished<T extends { order?: number }>(
  collectionName: 'articles' | 'frameworks',
): Promise<T[] | null> {
  const db = liteDb();
  if (!db) return null;
  try {
    const snap = await getDocs(
      query(collection(db, collectionName), where('publishStatus', '==', 'published')),
    );
    // Sorted client-side to avoid needing a composite index.
    return snap.docs.map((d) => d.data() as T).sort(byOrder);
  } catch (err) {
    warn(collectionName, err);
    return null;
  }
}

/** All docs of a fully-public collection (team), sorted by `order`. */
export async function fetchAll<T extends { order?: number }>(
  collectionName: 'team',
): Promise<T[] | null> {
  const db = liteDb();
  if (!db) return null;
  try {
    const snap = await getDocs(collection(db, collectionName));
    return snap.docs.map((d) => d.data() as T).sort(byOrder);
  } catch (err) {
    warn(collectionName, err);
    return null;
  }
}

/** All taxonomy docs keyed by id (disciplines/domains/categories). */
export async function fetchTaxonomies<T>(): Promise<Record<string, T> | null> {
  const db = liteDb();
  if (!db) return null;
  try {
    const snap = await getDocs(collection(db, 'taxonomies'));
    return Object.fromEntries(snap.docs.map((d) => [d.id, d.data() as T]));
  } catch (err) {
    warn('taxonomies', err);
    return null;
  }
}

/**
 * File a visitor inquiry. The doc shape must match the strict create rule in
 * firestore.rules exactly ('website' is the spam honeypot — must stay '').
 * Returns false when Firestore is unavailable so the caller can decide
 * whether the email relay alone counts as success.
 */
export async function submitInquiry(data: {
  name: string;
  organization: string;
  email: string;
  inquiryType: string;
  details: string;
  website: string;
}): Promise<boolean> {
  const db = liteDb();
  if (!db) return false;
  try {
    await addDoc(collection(db, 'inquiries'), {
      ...data,
      status: 'unread',
      createdAt: serverTimestamp(),
    });
    return true;
  } catch (err) {
    warn('inquiries (create)', err);
    return false;
  }
}

/** A single doc (pages/*, settings/*). Missing docs resolve to null. */
export async function fetchSingleton<T>(
  collectionName: 'pages' | 'settings',
  docId: string,
): Promise<T | null> {
  const db = liteDb();
  if (!db) return null;
  try {
    const snap = await getDoc(doc(db, collectionName, docId));
    return snap.exists() ? (snap.data() as T) : null;
  } catch (err) {
    warn(`${collectionName}/${docId}`, err);
    return null;
  }
}
