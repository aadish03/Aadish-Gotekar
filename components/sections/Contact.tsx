"use client";

import { useState } from "react";
import { identity } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";
import styles from "./Contact.module.css";

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — the adjacent link still works */
    }
  };

  return (
    <button type="button" onClick={copy} className={`mono ${styles.copy}`} aria-label={`Copy ${label}`}>
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function Contact() {
  const year = identity.year;

  return (
    <footer className={styles.section} id="contact" aria-labelledby="contact-heading">
      <Reveal className={styles.inner} stagger={0.1}>
        <p className="eyebrow" data-reveal>
          06 — Open to AI engineering & applied research roles
        </p>

        <h2 id="contact-heading" className={`display ${styles.heading}`} data-reveal>
          Let&apos;s build AI that
          <br />
          works in the <em className="serif-italic">real world</em>.
        </h2>

        <div className={styles.channels}>
          <div className={styles.channel} data-reveal>
            <span className={`mono ${styles.channelLabel}`}>Email</span>
            <div className={styles.channelRow}>
              <a href={`mailto:${identity.email}`} className={`${styles.channelValue} ulink`}>
                {identity.email}
              </a>
              <CopyButton value={identity.email} label="email address" />
            </div>
          </div>

          <div className={styles.channel} data-reveal>
            <span className={`mono ${styles.channelLabel}`}>Phone</span>
            <div className={styles.channelRow}>
              <a href={identity.phoneHref} className={`${styles.channelValue} ulink`}>
                {identity.phone}
              </a>
              <CopyButton value={identity.phone} label="phone number" />
            </div>
          </div>

          <div className={styles.channel} data-reveal>
            <span className={`mono ${styles.channelLabel}`}>Elsewhere</span>
            <div className={styles.social}>
              <a href={identity.links.github} target="_blank" rel="noreferrer" className={`${styles.channelValue} ulink`}>
                GitHub
              </a>
              <a href={identity.links.linkedin} target="_blank" rel="noreferrer" className={`${styles.channelValue} ulink`}>
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </Reveal>

      <div className={`mono ${styles.colophon}`}>
        <span>
          © {year} {identity.name}
        </span>
        <span className={styles.colophonMid}>{identity.location}</span>
        <a href="#top" className="ulink">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
