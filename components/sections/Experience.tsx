"use client";

import { experience, identity } from "@/lib/content";
import { useGsapContext, gsap } from "@/hooks/useGsapContext";
import styles from "./Experience.module.css";

export function Experience() {
  const ref = useGsapContext<HTMLElement>((_ctx, scope) => {
    // Copper spine draws down as the section scrolls through the viewport.
    gsap.fromTo(
      "[data-spine]",
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        transformOrigin: "top center",
        scrollTrigger: { trigger: scope, start: "top 60%", end: "bottom 70%", scrub: 0.6 },
      },
    );

    gsap.utils.toArray<HTMLElement>("[data-entry]").forEach((entry) => {
      gsap.from(entry.querySelectorAll("[data-entry-item]"), {
        y: 36,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.07,
        scrollTrigger: { trigger: entry, start: "top 78%", once: true },
      });
      gsap.from(entry.querySelector("[data-node]"), {
        scale: 0,
        duration: 0.6,
        ease: "back.out(2.5)",
        scrollTrigger: { trigger: entry, start: "top 78%", once: true },
      });
    });

    gsap.from("[data-edu]", {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: "expo.out",
      stagger: 0.1,
      scrollTrigger: { trigger: "[data-edu-wrap]", start: "top 85%", once: true },
    });
  });

  return (
    <section ref={ref} className={styles.section} id="experience" aria-labelledby="exp-heading">
      <div className={styles.head}>
        <p className="eyebrow">01 — Trajectory</p>
        <h2 id="exp-heading" className={`display ${styles.heading}`}>
          Where the <em className="serif-italic">work</em> has happened
        </h2>
      </div>

      <ol className={styles.timeline}>
        <span className={styles.spineTrack} aria-hidden="true">
          <span className={styles.spine} data-spine />
        </span>

        {experience.map((e) => (
          <li
            key={e.org}
            className={`${styles.entry} ${e.current ? styles.entryFeatured : ""}`}
            data-entry
          >
            <span className={styles.node} data-node aria-hidden="true" />

            <div className={styles.left}>
              <span className={`mono ${styles.period}`} data-entry-item>
                {e.period}
              </span>
              <span className={`mono ${styles.location}`} data-entry-item>
                {e.location}
              </span>
              {(e.current || e.kind !== "industry") && (
                <span
                  className={`mono ${styles.tag} ${e.kind === "volunteer" ? styles.tagVolunteer : styles.tagResearch}`}
                  data-entry-item
                >
                  {e.current ? "Now" : e.kind}
                </span>
              )}
            </div>

            <div className={styles.right}>
              <h3 className={`display ${styles.org}`} data-entry-item>
                {e.org}
              </h3>
              <p className={`serif-italic ${styles.role}`} data-entry-item>
                {e.role}
              </p>
              <ul className={styles.bullets}>
                {e.bullets.map((b) => (
                  <li key={b} data-entry-item>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>

      <div className={styles.education} data-edu-wrap>
        <p className="eyebrow" data-edu>
          Education
        </p>
        <div className={styles.eduGrid}>
          {identity.education.map((ed) => (
            <div key={ed.degree} className={styles.edu} data-edu>
              <span className={`mono ${styles.eduPeriod}`}>{ed.period}</span>
              <span className={`display ${styles.eduDegree}`}>{ed.degree}</span>
              <span className={styles.eduSchool}>{ed.school}</span>
              <span className={`mono ${styles.eduDetail}`}>{ed.detail}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
