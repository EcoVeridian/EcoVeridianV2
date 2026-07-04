/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { adminDb } from './firebaseAdmin';
import { useAuth } from '../AuthContext';

/**
 * Live unread-inquiry count for the sidebar badge. Only subscribes when the
 * signed-in admin's role has the inquiries permission — Firestore rules would
 * reject the query otherwise.
 */
export function useUnreadInquiries(): number {
  const { admin, can } = useAuth();
  const allowed = can('inquiries');
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!admin || !allowed) {
      setCount(0);
      return;
    }
    const db = adminDb();
    const q = query(collection(db, 'inquiries'), where('status', '==', 'unread'));
    const unsubscribe = onSnapshot(
      q,
      (snap) => setCount(snap.size),
      () => setCount(0),
    );
    return unsubscribe;
  }, [admin, allowed]);

  return count;
}
