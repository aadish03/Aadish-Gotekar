"use client";

import { projects } from "@/lib/content";
import { useGsapContext, gsap } from "@/hooks/useGsapContext";
import styles from "./Projects.module.css";

export function Projects() {
  const ref = useGsapContext<HTMLElement>(() => {
    gsap.utils.toArray<HTMLElement>("[data-project]").forEach((panel) => {
      gsap.from(panel.querySelectorAll("[data-p-item]"), {
        y: 44,
        opacity: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.07,
        scrollTrigger: { trigger: panel, start: "top 75%", once: true },
      });

      // Ghost index drifts slower than the panel for parallax depth.
      gsap.fromTo(
        panel.querySelector("[data-p-ghost]"),
        { yPercent: 30 },
        {
          yPercent: -30,
          ease: "none",
          scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: true },
        },
      );

      // Metric card: subtle clip reveal from the copper hairline.
      gsap.from(panel.querySelector("[data-p-metric]"), {
        clipPath: "inset(0 0 100% 0)",
        duration: 1.2,
        ease: "expo.inOut",
        scrollTrigger: { trigger: panel, start: "top 70%", once: true },
      });
    });
  });

  return (
    <section ref={ref} className={styles.section} id="work" aria-labelledby="work-heading">
      <div className={styles.head}>
        <p className="eyebrow">02 — Selected work</p>
        <h2 id="work-heading" className={`display ${styles.heading}`}>
          Four builds, <em className="serif-italic">four</em> podiums
        </h2>
        <p className={styles.lede}>
          Each of these shipped under hackathon pressure, then kept going. The
          numbers are from the judged submissions.
        </p>
      </div>

      <ol className={styles.list}>
        {projects.map((p, i) => (
          <li
            key={p.name}
            className={`${styles.panel} ${i % 2 === 1 ? styles.panelFlip : ""}`}
            data-project
          >
            <span className={`display ${styles.ghost}`} data-p-ghost aria-hidden="true">
              {p.index}
            </span>

            <div className={styles.metric} data-p-metric>
              <span className={`mono ${styles.metricIndex}`}>N° {p.index}</span>
              <span className={`display ${styles.metricValue}`}>{p.metric.value}</span>
              <span className={`mono ${styles.metricLabel}`}>{p.metric.label}</span>
              <span className={`mono ${styles.award}`}>{p.award}</span>
            </div>

            <div className={styles.copy}>
              <h3 className={`display ${styles.title}`} data-p-item>
                {p.name}
              </h3>
              <p className={`serif-italic ${styles.tagline}`} data-p-item>
                {p.tagline}
              </p>
              <ul className={styles.bullets}>
                {p.bullets.map((b) => (
                  <li key={b} data-p-item>
                    {b}
                  </li>
                ))}
              </ul>
              <ul className={`mono ${styles.stack}`} data-p-item aria-label="Tech stack">
                {p.stack.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <div className={styles.links} data-p-item>
                {p.links.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel={l.href.startsWith("http") ? "noreferrer" : undefined}
                    className={styles.link}
                  >
                    <span>{l.label}</span>
                    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                      <path d="M2 10L10 2M4 2h6v6" fill="none" stroke="currentColor" strokeWidth="1.4" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
