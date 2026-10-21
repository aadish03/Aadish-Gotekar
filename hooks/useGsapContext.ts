"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Runs `setup` inside a gsap.context scoped to the returned ref and reverts
 * every tween/ScrollTrigger created within it on unmount. Skips entirely when
 * the user prefers reduced motion so content stays static and visible.
 */
export function useGsapContext<T extends HTMLElement>(
  setup: (ctx: gsap.Context, scope: T) => void,
  deps: unknown[] = [],
): RefObject<T | null> {
  const scope = useRef<T>(null);

  useLayoutEffect(() => {
    if (!scope.current || prefersReducedMotion()) return;
    const el = scope.current;
    const ctx = gsap.context((self) => setup(self, el), el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return scope;
}
