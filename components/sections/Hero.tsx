"use client";

import { identity, achievements } from "@/lib/content";
import { useGsapContext, gsap } from "@/hooks/useGsapContext";
import { Transformer } from "@/components/sections/Transformer";
import styles from "./Hero.module.css";

const nav = [
  { label: "Work", href: "#work" },
  { label: "Awards", href: "#awards" },
  { label: "Papers", href: "#papers" },
  { label: "Contact", href: "#contact" },
];

export function Hero() {
  const ref = useGsapContext<HTMLElement>((_ctx, scope) => {
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

    tl.from(".reveal-line > span", {
      yPercent: 115,
      duration: 1.4,
      stagger: 0.09,
    })
      .from(
        "[data-hero-fade]",
        { opacity: 0, y: 18, duration: 1, stagger: 0.06 },
        "-=0.9",
      )
      .from(
        "[data-hero-rule]",
        { scaleX: 0, transformOrigin: "left center", duration: 1.2 },
        "-=0.8",
      )
      .from(
        "[data-net]",
        { opacity: 0, duration: 1.8, ease: "power2.out" },
        0.2,
      );

    gsap.set("[data-net]", { opacity: 1 });
    gsap.to("[data-net]", {
      yPercent: 6,
      ease: "none",
      scrollTrigger: { trigger: scope, start: "top top", end: "bottom top", scrub: true },
    });
    gsap.to("[data-hero-title]", {
      yPercent: 18,
      ease: "none",
      scrollTrigger: { trigger: scope, start: "top top", end: "bottom top", scrub: true },
    });
  });

  const wins = achievements.length;

  return (
    <header ref={ref} className={styles.hero} id="top">
      <nav className={styles.nav} aria-label="Primary">
        <a href="#top" className="mono text-xs tracking-[0.2em] uppercase" data-hero-fade>
          A.G. <span style={{ color: "var(--copper)" }}>/</span> Ledger
        </a>
        <ul className={styles.navList}>
          {nav.map((n) => (
            <li key={n.href} data-hero-fade>
              <a href={n.href} className="ulink mono text-xs tracking-[0.18em] uppercase">
                {n.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.main}>
        <div className={styles.copy}>
          <div className={styles.intro}>
            <p className="eyebrow" data-hero-fade>
              {identity.location} — Portfolio {identity.year}
            </p>

            <h1 className={`display reveal ${styles.title}`} data-hero-title>
              <span className="reveal-line">
                <span>Aadish</span>
              </span>
              <span className={`reveal-line ${styles.surname}`}>
                <span>
                  Gotekar<span className={styles.period}>.</span>
                </span>
              </span>
            </h1>
          </div>

          <div className={styles.details}>
            <div className={styles.lower}>
            <p className={`serif-italic ${styles.positioning}`} data-hero-fade>
              {identity.positioning.map((p) => (
                <span key={p} className={styles.positioningLine}>
                  {p}
                </span>
              ))}
            </p>

            <div className={styles.meta}>
              <div className="rule" data-hero-rule />
              <dl className={`mono ${styles.metaList}`} data-hero-fade>
                <div>
                  <dt>Currently</dt>
                  <dd>{identity.current.role}</dd>
                </div>
                <div>
                  <dt>Focus</dt>
                  <dd>{identity.current.focus}</dd>
                </div>
                <div>
                  <dt>Record</dt>
                  <dd>
                    {wins}× hackathon winner <span style={{ color: "var(--copper)" }}>incl. SIH 2024</span>
                  </dd>
                </div>
              </dl>
            </div>
            </div>

            <div className={styles.ctas} data-hero-fade>
            <a href="#work" className={styles.ctaPrimary}>
              <span>Selected work</span>
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <path d="M7 1v12M1 7l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </a>
            <a href={`mailto:${identity.email}`} className="ulink mono text-xs tracking-[0.18em] uppercase">
              Email
            </a>
            <a href={identity.links.github} target="_blank" rel="noreferrer" className="ulink mono text-xs tracking-[0.18em] uppercase">
              GitHub
            </a>
            <a href={identity.links.linkedin} target="_blank" rel="noreferrer" className="ulink mono text-xs tracking-[0.18em] uppercase">
              LinkedIn
            </a>
            </div>
          </div>
        </div>

        <div className={styles.viz}>
          <Transformer />
        </div>
      </div>

      <div className={`mono ${styles.scrollHint}`} data-hero-fade aria-hidden="true">
        <span className="vertical">Scroll</span>
        <span className={styles.scrollLine} />
      </div>
    </header>
  );
}
