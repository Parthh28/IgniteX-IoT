'use client';

import { useActionState, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  requestPasswordResetAction,
  signInAction,
} from '@/app/actions/auth';
import styles from './Auth.module.css';

interface AuthFormProps {
  showDummyAdminHint: boolean;
  dummyAdminEmail: string;
  showDummyMemberHint: boolean;
  dummyMemberEmail: string;
}

export default function AuthForm({
  showDummyAdminHint,
  dummyAdminEmail,
  showDummyMemberHint,
  dummyMemberEmail,
}: AuthFormProps) {
  const [view, setView] = useState<'signin' | 'reset'>('signin');
  const [showPassword, setShowPassword] = useState(false);

  const [signInState, signInFormAction, isSigningIn] = useActionState(
    signInAction,
    null
  );
  const [resetState, resetFormAction, isResetting] = useActionState(
    requestPasswordResetAction,
    null
  );

  return (
    <section className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Link href="/" className={styles.brandLink} aria-label="IgniteX IoT Home">
            <Image
              src="/logo.png"
              alt="IgniteX IoT Club logo"
              width={34}
              height={34}
              className={styles.brandLogo}
            />
            <span className={styles.brandName}>
              Ignite<span className={styles.brandX}>X</span>{' '}
              <span className={styles.brandIot}>IoT</span>
            </span>
          </Link>

          <h1 className={styles.heading}>
            {view === 'signin' ? 'Sign in' : 'Reset password'}
          </h1>
          <p className={styles.subtext}>
            {view === 'signin'
              ? 'Member & Admin Portal'
              : 'Enter your club email to receive a reset link'}
          </p>
        </div>

        {view === 'signin' ? (
          <form action={signInFormAction} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="signin-email" className={styles.label}>
                Email
              </label>
              <input
                id="signin-email"
                name="email"
                type="email"
                required
                autoFocus
                autoComplete="email"
                placeholder="you@ignitexiot.edu"
                className={styles.input}
                disabled={isSigningIn}
              />
            </div>

            <div className={styles.field}>
              <div className={styles.labelRow}>
                <label htmlFor="signin-password" className={styles.label}>
                  Password
                </label>
                <button
                  type="button"
                  className={styles.forgotBtn}
                  onClick={() => setView('reset')}
                >
                  Forgot password?
                </button>
              </div>

              <div className={styles.inputWrap}>
                <input
                  id="signin-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={`${styles.input} ${styles.inputWithBtn}`}
                  disabled={isSigningIn}
                />
                <button
                  type="button"
                  className={styles.togglePw}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {signInState && !signInState.success && (
              <p className={styles.alertError} role="alert">
                {signInState.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isSigningIn}
              className={styles.submitBtn}
            >
              {isSigningIn && <span className={styles.spinner} aria-hidden="true" />}
              <span>{isSigningIn ? 'Signing in...' : 'Sign in'}</span>
            </button>
          </form>
        ) : (
          <form action={resetFormAction} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="reset-email" className={styles.label}>
                Email
              </label>
              <input
                id="reset-email"
                name="email"
                type="email"
                required
                autoFocus
                autoComplete="email"
                placeholder="you@ignitexiot.edu"
                className={styles.input}
                disabled={isResetting}
              />
            </div>

            {resetState && (
              <p
                className={
                  resetState.success ? styles.alertSuccess : styles.alertError
                }
                role="status"
              >
                {resetState.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isResetting}
              className={styles.submitBtn}
            >
              {isResetting && <span className={styles.spinner} aria-hidden="true" />}
              <span>{isResetting ? 'Sending...' : 'Send reset link'}</span>
            </button>

            <button
              type="button"
              onClick={() => setView('signin')}
              className={styles.backBtn}
            >
              &larr; Back to sign in
            </button>
          </form>
        )}

        <div className={styles.footer}>
          <Link href="/" className={styles.homeLink}>
            &larr; Return to website
          </Link>

          {(showDummyAdminHint || showDummyMemberHint) && (
            <details className={styles.devDetails}>
              <summary className={styles.devSummary}>
                Dev demo credentials
              </summary>
              <div className={styles.devContent}>
                {showDummyAdminHint && (
                  <span>
                    Admin: {dummyAdminEmail} / IgniteX@2026
                  </span>
                )}
                {showDummyMemberHint && (
                  <span>
                    Member: {dummyMemberEmail} / Member@2026
                  </span>
                )}
              </div>
            </details>
          )}
        </div>
      </div>
    </section>
  );
}
