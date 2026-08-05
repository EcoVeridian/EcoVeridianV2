/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { adminDb } from './firebaseAdmin';
import { useAuth } from '../AuthContext';

/**
 * Live unread-submission count for the sidebar badge. Only subscribes when
 * the signed-in admin's role has the submissions permission — Firestore
 * rules would reject the query otherwise.
 */
export function useUnreadSubmissions(): number {
  const { admin, can } = useAuth();
  const allowed = can('submissions');
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!admin || !allowed) {
      setCount(0);
      return;
    }
    const db = adminDb();
    const q = query(collection(db, 'submissions'), where('status', '==', 'unread'));
    const unsubscribe = onSnapshot(
      q,
      (snap) => setCount(snap.size),
      () => setCount(0),
    );
    return unsubscribe;
  }, [admin, allowed]);

  return count;
}
