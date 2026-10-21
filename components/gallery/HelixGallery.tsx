"use client";

import { useLayoutEffect, useState } from "react";
import Image from "next/image";
import { gallery } from "@/lib/content";
import { useGsapContext, gsap, ScrollTrigger, prefersReducedMotion } from "@/hooks/useGsapContext";
import styles from "./HelixGallery.module.css";

const n = gallery.length;
// Degrees between consecutive frames around the spindle. Less than 360/n so
// three or four frames trail in view at once instead of one per hemisphere.
const STEP_DESKTOP = 64;
const STEP_TABLET = 60;

function frameWidth(vw: number) {
  if (vw < 760) return Math.min(vw * 0.46, 196);
  if (vw < 1100) return Math.min(vw * 0.22, 300);
  return Math.min(vw * 0.22, 300);
}

function dims() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const mobile = vw < 760;
  const tablet = vw >= 760 && vw < 1100;
  const laptop = vw >= 1100;
  const fw = frameWidth(vw);
  const frameH = fw * 1.25;
  return {
    radius: mobile ? fw * 0.88 : tablet ? Math.min(fw * 0.95, 360) : Math.min(fw * 1.05, 440),
    // Vertical gap along the spindle — closer to one card height on mobile avoids stack overlap
    pitch: mobile
      ? Math.max(frameH * 0.84, Math.min(frameH * 0.98, vh * 0.28))
      : laptop
        ? Math.min(frameH * 0.82, vh * 0.38)
        : Math.min(frameH * 0.7, vh * 0.34),
    step: mobile ? 66 : laptop ? STEP_DESKTOP : STEP_TABLET,
    scaleMin: mobile ? 0.6 : 0.74,
    opacityPow: mobile ? 0.85 : 0.6,
  };
}

export function HelixGallery() {
  // `enhanced` flips the markup from a static grid into the 3D stage. It stays
  // false when JS is unavailable or the user prefers reduced motion.
  const [enhanced, setEnhanced] = useState(false);

  useLayoutEffect(() => {
    if (!prefersReducedMotion()) setEnhanced(true);
  }, []);

  const ref = useGsapContext<HTMLElement>(
    (ctx, scope) => {
      if (!enhanced) return;

      const frames = gsap.utils.toArray<HTMLElement>("[data-frame]", scope);
      const inners = frames.map((f) => f.firstElementChild as HTMLElement);
      const captions = gsap.utils.toArray<HTMLElement>("[data-caption]", scope);
      const counter = scope.querySelector<HTMLElement>("[data-counter]");
      const ring = scope.querySelector<SVGCircleElement>("[data-ring]");
      const stage = scope.querySelector<HTMLElement>("[data-stage]");
      let { radius, pitch, step, scaleMin, opacityPow } = dims();
      let active = -1;
      let progress = 0;

      // Cylinder placement needs rotate-then-translate, but GSAP always applies
      // translate first. So the outer frame carries rotateY + vertical drift and
      // the inner element is pushed out along the rotated Z axis by the radius.
      // Opacity must live on the inner: opacity < 1 on the outer would flatten
      // its 3D children and kill the depth offset.
      const render = (t: number) => {
        const travel = t * (n - 1);
        for (let i = 0; i < n; i++) {
          const angle = (i - travel) * step;
          const facing = Math.cos((angle * Math.PI) / 180); // 1 = toward camera
          gsap.set(frames[i], { y: (i - travel) * pitch, rotateY: angle });
          gsap.set(inners[i], {
            z: radius,
            scale: gsap.utils.mapRange(-1, 1, scaleMin, 1, facing),
            opacity: gsap.utils.mapRange(-1, 1, 0, 1, facing) ** opacityPow,
          });
        }
        if (stage) gsap.set(stage, { rotateX: gsap.utils.interpolate(-10, -4, t) });

        const next = Math.round(gsap.utils.clamp(0, n - 1, travel));
        if (next !== active) {
          active = next;
          captions.forEach((c, i) => c.toggleAttribute("data-active", i === active));
          if (counter) counter.textContent = String(active + 1).padStart(2, "0");
        }
        if (ring) gsap.set(ring, { strokeDashoffset: 1 - t });
      };

      const vw = window.innerWidth;
      const scrollMul = vw < 760 ? 74 : vw < 1100 ? 86 : 94;
      ScrollTrigger.create({
        trigger: scope,
        start: "top top",
        end: `+=${n * scrollMul}%`,
        pin: true,
        pinSpacing: true,
        scrub: vw < 760 ? 0.65 : 0.9,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefreshInit: () => {
          ({ radius, pitch, step, scaleMin, opacityPow } = dims());
        },
        onRefresh: () => render(progress),
        onUpdate: (self) => {
          progress = self.progress;
          render(progress);
        },
      });

      const onLayout = () => {
        ({ radius, pitch, step, scaleMin, opacityPow } = dims());
        render(progress);
        ScrollTrigger.refresh();
      };
      window.addEventListener("orientationchange", onLayout);
      ctx.add(() => window.removeEventListener("orientationchange", onLayout));

      render(0);

      // Entrance: images slide up inside their (overflow-hidden) frames, which
      // keeps the reveal independent of the scrubbed frame/inner transforms.
      gsap.from(
        inners.map((el) => el.querySelector("img")),
        {
          yPercent: 30,
          opacity: 0,
          duration: 1.4,
          ease: "expo.out",
          stagger: 0.06,
          scrollTrigger: { trigger: scope, start: "top 70%", once: true },
        },
      );
    },
    [enhanced],
  );

  return (
    <section
      ref={ref}
      id="awards"
      className={`${styles.section} ${enhanced ? styles.enhanced : ""}`}
      aria-labelledby="awards-heading"
    >
      <div className={styles.header}>
        <p className="eyebrow">03 — The trophy room</p>
        <h2 id="awards-heading" className={`display ${styles.heading}`}>
          Scroll the <em className="serif-italic">helix</em>
        </h2>
      </div>

      <div className={styles.stageWrap}>
        <span className={styles.spindle} aria-hidden="true" />

        <div className={styles.stage} data-stage>
          {gallery.map((g, i) => (
            <figure key={g.src} className={styles.frame} data-frame>
              <div className={styles.frameInner}>
                <Image
                  src={g.src}
                  alt={g.alt}
                  width={800}
                  height={1000}
                  sizes="(max-width: 760px) 62vw, 24vw"
                  className={styles.img}
                  priority={i === 0}
                />
                <span className={`mono ${styles.frameTag}`} aria-hidden="true">
                  N° {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              {/* Visible only in the static (grid) layout */}
              <figcaption className={styles.gridCaption}>
                <span className={`display ${styles.gridEvent}`}>{g.event}</span>
                <span className={`mono ${styles.gridMeta}`}>
                  {g.year} · {g.caption}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* Live caption panel for the 3D stage */}
      <div className={styles.captionPanel} aria-live="polite">
        <div className={styles.captions}>
          {gallery.map((g, i) => (
            <div key={g.src} className={styles.caption} data-caption data-active={i === 0 || undefined}>
              <span className={`mono ${styles.captionYear}`}>{g.year}</span>
              <span className={`display ${styles.captionEvent}`}>{g.event}</span>
              <span className={styles.captionText}>{g.caption}</span>
            </div>
          ))}
        </div>

        <div className={`mono ${styles.progress}`} aria-hidden="true">
          <svg viewBox="0 0 48 48" className={styles.ringSvg}>
            <circle cx="24" cy="24" r="22" fill="none" stroke="var(--line)" strokeWidth="1" />
            <circle
              cx="24"
              cy="24"
              r="22"
              fill="none"
              stroke="var(--copper)"
              strokeWidth="1.5"
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset="1"
              strokeLinecap="round"
              data-ring
            />
          </svg>
          <span>
            <span data-counter>01</span>
            <span className={styles.progressSep}>/</span>
            {String(n).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}
