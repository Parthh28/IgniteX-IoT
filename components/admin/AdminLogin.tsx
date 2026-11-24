'use client';

import { useActionState } from 'react';
import { adminLogin } from '@/app/actions/admin';
import styles from './Admin.module.css';

interface AdminLoginProps {
  isConfigured: boolean;
  showDummyAdminHint?: boolean;
  dummyAdminEmail?: string;
}

export default function AdminLogin({
  isConfigured,
  showDummyAdminHint = false,
  dummyAdminEmail = 'revaiotclub@gmail.com',
}: AdminLoginProps) {
  const [state, formAction, isPending] = useActionState(adminLogin, null);

  return (
    <div className={styles.loginWrap}>
      <div className={styles.loginCard}>
        <p className={styles.eyebrow}>IgniteX Control Center</p>
        <h1 className={styles.loginTitle}>Admin Sign In</h1>
        <p className={styles.loginSub}>
          Sign in with your administrator credentials to manage events, team members, registrations, and inquiries.
        </p>

        {!isConfigured ? (
          <div className={styles.banner}>
            <strong>Setup required:</strong> Add <code>ADMIN_PASSWORD</code> to your{' '}
            <code>.env.local</code> (or Vercel Environment Variables) to unlock the admin console.
          </div>
        ) : (
          <form action={formAction} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="admin-email" className={styles.label}>
                Admin Email
              </label>
              <input
                id="admin-email"
                name="email"
                type="email"
                required
                defaultValue={showDummyAdminHint ? dummyAdminEmail : ''}
                placeholder="revaiotclub@gmail.com"
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="admin-password" className={styles.label}>
                Password
              </label>
              <input
                id="admin-password"
                name="password"
                type="password"
                required
                autoFocus
                placeholder="Enter admin password"
                className={styles.input}
              />
            </div>

            {state && !state.success && (
              <p className={styles.feedbackError}>{state.message}</p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className={styles.primaryBtn}
            >
              {isPending ? 'Verifying...' : 'Sign In to Console'}
            </button>
          </form>
        )}

        {showDummyAdminHint && (
          <div className={styles.banner} style={{ marginTop: '16px', marginBottom: 0 }}>
            <strong>Local Dev Dummy Admin:</strong>
            <br />
            Email: <code>{dummyAdminEmail}</code>
            <br />
            Password: <code>IgniteX@2026</code>
          </div>
        )}
      </div>
    </div>
  );
}
