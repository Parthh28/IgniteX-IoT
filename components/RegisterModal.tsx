'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Event, ActionResponse } from '@/lib/types';
import { submitRegistration } from '@/app/actions/register';
import styles from './RegisterModal.module.css';

interface RegisterModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function RegisterModal({
  event,
  isOpen,
  onClose,
}: RegisterModalProps) {
  const [response, setResponse] = useState<ActionResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.setAttribute('data-modal-open', 'true');
    } else {
      document.body.removeAttribute('data-modal-open');
    }
    return () => {
      document.body.removeAttribute('data-modal-open');
    };
  }, [isOpen]);

  useEffect(() => {
    // Reset state on open/close
    if (isOpen) {
      setResponse(null);
      setIsSubmitting(false);
    }
  }, [isOpen, event]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!mounted || !isOpen || !event) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setIsSubmitting(true);
    setResponse(null);

    const formData = new FormData(form);
    try {
      const res = await submitRegistration(null, formData);
      setResponse(res);
      if (res.success) {
        form.reset();
      }
    } catch {
      setResponse({
        success: false,
        message: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Register for ${event.title}`}
    >
      <div className={styles.modal} ref={modalRef}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close dialog"
        >
          &times;
        </button>

        <div className={styles.modalHeader}>
          <h3 className={styles.title}>Event Registration</h3>
          <p className={styles.eventSubtitle}>
            {event.title} &middot; {event.date}
          </p>
        </div>

        {response && (
          <div
            className={`${styles.alert} ${
              response.success ? styles.alertSuccess : styles.alertError
            }`}
            role="status"
          >
            {response.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <input type="hidden" name="event_id" value={event.id} />

          <div className={styles.formGroup}>
            <label htmlFor="reg-full-name" className={styles.label}>
              Full Name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="reg-full-name"
              name="full_name"
              required
              placeholder="e.g. Alex Rivera"
              className={styles.input}
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="reg-email" className={styles.label}>
              Email Address <span className={styles.required}>*</span>
            </label>
            <input
              type="email"
              id="reg-email"
              name="email"
              required
              placeholder="alex@university.edu"
              className={styles.input}
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="reg-roll" className={styles.label}>
                Roll Number / ID <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="reg-roll"
                name="roll_number"
                required
                placeholder="e.g. 21BCSE042"
                className={styles.input}
                disabled={isSubmitting}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="reg-phone" className={styles.label}>
                Phone Number
              </label>
              <input
                type="tel"
                id="reg-phone"
                name="phone"
                placeholder="+91 98765 43210"
                className={styles.input}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="reg-branch" className={styles.label}>
                Department / Branch
              </label>
              <input
                type="text"
                id="reg-branch"
                name="branch"
                placeholder="e.g. CSE / ECE"
                className={styles.input}
                disabled={isSubmitting}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="reg-semester" className={styles.label}>
                Semester / Year
              </label>
              <input
                type="text"
                id="reg-semester"
                name="semester"
                placeholder="e.g. 5th Sem / 3rd Year"
                className={styles.input}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
