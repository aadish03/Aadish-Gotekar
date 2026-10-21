"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger, prefersReducedMotion } from "./useGsapContext";

function coarsePointer() {
  return typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
}

/**
 * Smooth scroll via Lenis, driven by GSAP's ticker so ScrollTrigger and the
 * scroll position are always in the same frame. Touch devices use native
 * scrolling so pinned sections (helix) stay in sync with ScrollTrigger.
 */
export function useLenis() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const touch = coarsePointer();
    let normalizer: ReturnType<typeof ScrollTrigger.normalizeScroll> | undefined;

    if (touch) {
      normalizer = ScrollTrigger.normalizeScroll(true);
    }

    if (touch) {
      const onResize = () => ScrollTrigger.refresh();
      window.addEventListener("orientationchange", onResize);
      return () => {
        window.removeEventListener("orientationchange", onResize);
        normalizer?.kill?.();
      };
    }

    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 0.9,
      autoRaf: false,
      anchors: { offset: 0 },
    });

    const onScroll = () => ScrollTrigger.update();
    const onTick = (time: number) => lenis.raf(time * 1000);

    lenis.on("scroll", onScroll);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    const onResize = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };
    window.addEventListener("orientationchange", onResize);

    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(onTick);
      window.removeEventListener("orientationchange", onResize);
      lenis.destroy();
      normalizer?.kill?.();
    };
  }, []);
}
