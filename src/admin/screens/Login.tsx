/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2, LogIn, UserPlus } from 'lucide-react';
import { FirebaseError } from 'firebase/app';
import { useAuth } from '../AuthContext';

type Mode = 'signin' | 'activate';

function friendlyAuthError(err: unknown): string {
  if (err instanceof FirebaseError) {
    switch (err.code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Incorrect email or password.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists — use Sign In instead.';
      case 'auth/weak-password':
        return 'Password must be at least 6 characters.';
      case 'auth/invalid-email':
        return 'That email address looks invalid.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Wait a moment and try again.';
      default:
        return `Something went wrong (${err.code}).`;
    }
  }
  return 'Something went wrong. Please try again.';
}

export default function Login() {
  const { user, admin, loading, signIn, register, resetPassword } = useAuth();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Already signed in with admin access → straight to the dashboard.
  // (Signed in without access is handled by RequireAdmin's screen.)
  if (!loading && user && admin) {
    return <Navigate to="/admin" replace />;
  }
  if (!loading && user && !admin) {
    return <Navigate to="/admin" replace />; // RequireAdmin renders the no-access screen
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      if (mode === 'signin') {
        await signIn(email, password);
      } else {
        await register(email, password);
      }
      // Redirect happens via the auth state change above.
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setBusy(false);
    }
  };

  const handleReset = async () => {
    if (!email.trim()) {
      setError('Enter your email first, then click "Forgot password".');
      return;
    }
    setError(null);
    try {
      await resetPassword(email);
      setNotice(`Password reset email sent to ${email.trim()}.`);
    } catch (err) {
      setError(friendlyAuthError(err));
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-5">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <img src="/favicon.svg" alt="" className="w-9 h-9" />
          <span className="font-serif italic text-3xl text-primary font-bold">EcoVeridian</span>
          <span className="font-mono text-[10px] uppercase tracking-widest bg-secondary-container/40 text-on-secondary-container border-[0.5px] border-secondary/30 px-2 py-0.5 rounded-sm font-bold">
            Admin
          </span>
        </div>

        <div className="border-[0.5px] border-outline-variant bg-surface-container-lowest rounded-[2px] p-6 md:p-8 shadow-sm">
          {/* Mode tabs */}
          <div className="flex border-b-[0.5px] border-outline-variant mb-6">
            <button
              onClick={() => { setMode('signin'); setError(null); setNotice(null); }}
              className={`flex-1 pb-3 font-mono text-xs uppercase tracking-widest font-bold transition-colors cursor-pointer ${
                mode === 'signin' ? 'text-primary border-b-2 border-primary' : 'text-outline hover:text-primary'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('activate'); setError(null); setNotice(null); }}
              className={`flex-1 pb-3 font-mono text-xs uppercase tracking-widest font-bold transition-colors cursor-pointer ${
                mode === 'activate' ? 'text-primary border-b-2 border-primary' : 'text-outline hover:text-primary'
              }`}
            >
              Activate Account
            </button>
          </div>

          {mode === 'activate' && (
            <p className="font-sans text-xs text-on-surface-variant leading-relaxed mb-5">
              First time here? If an owner invited your email (or you are the site owner), pick a
              password to activate your admin account.
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col">
              <label className="font-mono text-xs text-on-surface-variant mb-2 uppercase font-bold" htmlFor="admin-email">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="bg-transparent border-b-[0.5px] border-outline focus:outline-none focus:border-primary focus:bg-surface-container-low transition-all py-2 text-sm font-sans"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-mono text-xs text-on-surface-variant mb-2 uppercase font-bold" htmlFor="admin-password">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                className="bg-transparent border-b-[0.5px] border-outline focus:outline-none focus:border-primary focus:bg-surface-container-low transition-all py-2 text-sm font-sans"
              />
            </div>

            {error && (
              <div className="bg-error-container/20 border-[0.5px] border-error/40 text-error p-3 rounded-[2px] text-xs font-sans">
                {error}
              </div>
            )}
            {notice && (
              <div className="bg-primary-fixed text-on-primary-fixed border border-primary/10 p-3 rounded-[2px] text-xs font-sans">
                {notice}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full py-3 bg-primary text-on-primary font-mono text-xs uppercase tracking-widest font-semibold rounded-[2px] hover:bg-primary-container transition-colors flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
            >
              {busy ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : mode === 'signin' ? (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Activate Account
                </>
              )}
            </button>
          </form>

          {mode === 'signin' && (
            <button
              onClick={handleReset}
              className="mt-4 w-full text-center text-[11px] font-sans text-outline hover:text-primary hover:underline cursor-pointer"
            >
              Forgot password?
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
