'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { submitContact } from '@/app/actions/contact';
import { ActionResponse } from '@/lib/types';
import { Reveal } from './MotionKit';
import styles from './ContactSection.module.css';

const initialState: ActionResponse | null = null;

type InquiryValue =
  | 'Join Core Team'
  | 'Sponsor an Event'
  | 'Collaborate'
  | 'General Inquiry';

const INQUIRY_OPTIONS: ReadonlyArray<{
  value: InquiryValue;
  placeholder: string;
}> = [
  {
    value: 'Join Core Team',
    placeholder:
      'Tell us about your technical skills, past projects, and why you want to join the IgniteX IoT core team...',
  },
  {
    value: 'Sponsor an Event',
    placeholder:
      'Share your sponsorship goals, target events, or how you would like to partner with IgniteX IoT Club...',
  },
  {
    value: 'Collaborate',
    placeholder:
      'Describe your event, workshop, or project collaboration idea and proposed timeline...',
  },
  {
    value: 'General Inquiry',
    placeholder: 'How can we help you?',
  },
];

export default function ContactSection() {
  const [state, formAction, isPending] = useActionState(
    submitContact,
    initialState
  );
  const [selectedInquiry, setSelectedInquiry] =
    useState<InquiryValue>('Join Core Team');
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  const activeOption =
    INQUIRY_OPTIONS.find((opt) => opt.value === selectedInquiry) ||
    INQUIRY_OPTIONS[0];

  return (
    <section id="contact" className={styles.section}>
      <div className="container">
        <Reveal>
          <div className={styles.header}>
            <p className={styles.categoryTag}>Contact</p>
            <h2 className={styles.title}>Get in Touch</h2>
            <p className={styles.subtitle}>
              Interested in joining the core team, sponsoring an event, or collaborating with us? Choose a category below.
            </p>
          </div>
        </Reveal>

        <div className={styles.wrapper}>
          {/* Contact Form */}
          <Reveal delay={80} direction="left">
            <div className={styles.formCard}>
            {state && (
              <div
                className={`${styles.alert} ${
                  state.success ? styles.alertSuccess : styles.alertError
                }`}
                role="status"
              >
                {state.message}
              </div>
            )}

            <form ref={formRef} action={formAction} className={styles.form}>
              <div className={styles.formGroup}>
                <span className={styles.label}>I would like to</span>
                <input
                  type="hidden"
                  name="inquiry_type"
                  value={selectedInquiry}
                />
                <div
                  className={styles.purposeGrid}
                  role="radiogroup"
                  aria-label="Inquiry purpose"
                >
                  {INQUIRY_OPTIONS.map((option) => {
                    const isSelected = selectedInquiry === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        disabled={isPending}
                        onClick={() => setSelectedInquiry(option.value)}
                        className={`${styles.purposeChip} ${
                          isSelected ? styles.purposeChipActive : ''
                        }`}
                      >
                        {option.value}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="contact-name" className={styles.label}>
                  Full Name *
                </label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  required
                  placeholder="e.g. Parth Patel"
                  className={styles.input}
                  disabled={isPending}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="contact-email" className={styles.label}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    required
                    placeholder="parth@example.com"
                    className={styles.input}
                    disabled={isPending}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="contact-phone" className={styles.label}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="contact-phone"
                    name="phone"
                    required
                    placeholder="+91 98765 43210"
                    className={styles.input}
                    disabled={isPending}
                  />
                </div>
              </div>

              {/* Role-specific fields: Join Core Team */}
              {selectedInquiry === 'Join Core Team' && (
                <>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="contact-branch" className={styles.label}>
                        Branch / Department *
                      </label>
                      <input
                        type="text"
                        id="contact-branch"
                        name="branch"
                        required
                        placeholder="e.g. CSE / ECE / IoT"
                        className={styles.input}
                        disabled={isPending}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="contact-srn" className={styles.label}>
                        Application No. / SRN *
                      </label>
                      <input
                        type="text"
                        id="contact-srn"
                        name="srn"
                        required
                        placeholder="e.g. PES1UG24CS001"
                        className={styles.input}
                        disabled={isPending}
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="contact-sem" className={styles.label}>
                        Semester / Year
                      </label>
                      <input
                        type="text"
                        id="contact-sem"
                        name="semester"
                        placeholder="e.g. 4th Sem / 2nd Year"
                        className={styles.input}
                        disabled={isPending}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="contact-domain" className={styles.label}>
                        Preferred Domain
                      </label>
                      <select
                        id="contact-domain"
                        name="domain"
                        defaultValue="IoT & Embedded Systems"
                        className={styles.select}
                        disabled={isPending}
                      >
                        <option value="IoT & Embedded Systems">
                          IoT &amp; Embedded Systems
                        </option>
                        <option value="AI / ML & Edge AI">
                          AI / ML &amp; Edge AI
                        </option>
                        <option value="Software & Web Development">
                          Software &amp; Web Development
                        </option>
                        <option value="Robotics & Automation">
                          Robotics &amp; Automation
                        </option>
                        <option value="Design & Media">Design &amp; Media</option>
                        <option value="Operations & Events">
                          Operations &amp; Events
                        </option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Role-specific fields: Sponsor an Event */}
              {selectedInquiry === 'Sponsor an Event' && (
                <>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="contact-company" className={styles.label}>
                        Company / Brand Name *
                      </label>
                      <input
                        type="text"
                        id="contact-company"
                        name="company_name"
                        required
                        placeholder="e.g. Acme Robotics Pvt. Ltd."
                        className={styles.input}
                        disabled={isPending}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label
                        htmlFor="contact-designation"
                        className={styles.label}
                      >
                        Your Role / Designation
                      </label>
                      <input
                        type="text"
                        id="contact-designation"
                        name="designation"
                        placeholder="e.g. Partnerships Lead"
                        className={styles.input}
                        disabled={isPending}
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label
                        htmlFor="contact-sponsor-type"
                        className={styles.label}
                      >
                        Sponsorship Type
                      </label>
                      <select
                        id="contact-sponsor-type"
                        name="sponsor_type"
                        defaultValue="Title / Financial Sponsor"
                        className={styles.select}
                        disabled={isPending}
                      >
                        <option value="Title / Financial Sponsor">
                          Title / Financial Sponsor
                        </option>
                        <option value="Hardware / Kit Partner">
                          Hardware / Kit Partner
                        </option>
                        <option value="Swag / Goodies Partner">
                          Swag / Goodies Partner
                        </option>
                        <option value="Food / Venue Partner">
                          Food / Venue Partner
                        </option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="contact-website" className={styles.label}>
                        Company Website (optional)
                      </label>
                      <input
                        type="url"
                        id="contact-website"
                        name="company_website"
                        placeholder="https://company.com"
                        className={styles.input}
                        disabled={isPending}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Role-specific fields: Collaborate */}
              {selectedInquiry === 'Collaborate' && (
                <>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="contact-org" className={styles.label}>
                        Club / Organization / College *
                      </label>
                      <input
                        type="text"
                        id="contact-org"
                        name="org_name"
                        required
                        placeholder="e.g. Robotics Society / Startup"
                        className={styles.input}
                        disabled={isPending}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="contact-org-role" className={styles.label}>
                        Your Role
                      </label>
                      <input
                        type="text"
                        id="contact-org-role"
                        name="org_role"
                        placeholder="e.g. Club Lead / Coordinator"
                        className={styles.input}
                        disabled={isPending}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label
                      htmlFor="contact-collab-type"
                      className={styles.label}
                    >
                      Collaboration Type
                    </label>
                    <select
                      id="contact-collab-type"
                      name="collab_type"
                      defaultValue="Joint Hackathon / Event"
                      className={styles.select}
                      disabled={isPending}
                    >
                      <option value="Joint Hackathon / Event">
                        Joint Hackathon / Event
                      </option>
                      <option value="Technical Workshop / Speaker">
                        Technical Workshop / Speaker
                      </option>
                      <option value="Project / Research Partnership">
                        Project / Research Partnership
                      </option>
                      <option value="Community Partner">
                        Community Partner
                      </option>
                    </select>
                  </div>
                </>
              )}

              <div className={styles.formGroup}>
                <label htmlFor="contact-message" className={styles.label}>
                  Message *
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  required
                  placeholder={activeOption.placeholder}
                  className={styles.textarea}
                  disabled={isPending}
                />
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isPending}
              >
                <span>{isPending ? 'Sending...' : 'Send Message'}</span>
                <span aria-hidden="true">&rarr;</span>
              </button>
            </form>
            </div>
          </Reveal>

          {/* Contact Information & Channels */}
          <Reveal delay={160} direction="right">
            <div className={styles.infoColumn}>
            <div className={styles.infoBlock}>
              <h3 className={styles.infoHeading}>Lab Location</h3>
              <p className={styles.infoText}>
                IoT Innovation Lab, Room 302<br />
                Department of Computer Engineering<br />
                Open Mon &ndash; Fri &middot; 10:00 AM &ndash; 5:00 PM
              </p>
            </div>

            <div className={styles.infoBlock}>
              <h3 className={styles.infoHeading}>Email Inquiries</h3>
              <p className={styles.infoText}>revaiotclub@gmail.com</p>
            </div>

            <div className={styles.infoBlock}>
              <h3 className={styles.infoHeading}>Connect with Us</h3>
              <p className={styles.infoText}>
                Follow updates or join our community on LinkedIn, Instagram, Mail, and our WhatsApp group:
              </p>
              <div className={styles.socialList}>
                {/* TODO: CLIENT — replace with real URL */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialBtn}
                  aria-label="LinkedIn"
                  title="LinkedIn"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>

                {/* TODO: CLIENT — replace with real URL */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialBtn}
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>

                {/* TODO: CLIENT — replace with real URL */}
                <a
                  href="mailto:revaiotclub@gmail.com"
                  className={styles.socialBtn}
                  aria-label="Mail IgniteX IoT Club"
                  title="Mail"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </a>

                {/* TODO: CLIENT — replace with real WhatsApp group invite link */}
                <a
                  href="https://chat.whatsapp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialBtn}
                  aria-label="WhatsApp Group"
                  title="WhatsApp Group"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </a>
              </div>
            </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
