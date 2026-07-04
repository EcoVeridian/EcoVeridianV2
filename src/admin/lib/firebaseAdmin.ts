/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getFirebaseApp } from '../../lib/firebase';

// The admin section requires Firebase; unlike the public site it cannot fall
// back to bundled seeds, so a missing config is a hard error.
export function requireFirebaseApp(): FirebaseApp {
  const app = getFirebaseApp();
  if (!app) {
    throw new Error(
      'Firebase is not configured. Copy .env.example to .env.local and fill in the VITE_FIREBASE_* values.',
    );
  }
  return app;
}

export function adminAuth(): Auth {
  return getAuth(requireFirebaseApp());
}

// Full (non-lite) Firestore, loaded only inside the lazy /admin chunk.
export function adminDb(): Firestore {
  return getFirestore(requireFirebaseApp());
}
