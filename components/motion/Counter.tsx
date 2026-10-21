"use client";

import { useGsapContext, gsap } from "@/hooks/useGsapContext";

type Props = {
  value: number;
  suffix?: string;
  className?: string;
};

/** Counts from 0 to `value` when scrolled into view. Renders the final value without JS. */
export function Counter({ value, suffix = "", className }: Props) {
  const ref = useGsapContext<HTMLSpanElement>((_ctx, el) => {
    const state = { n: 0 };
    gsap.to(state, {
      n: value,
      duration: 1.8,
      ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
      onUpdate: () => {
        el.textContent = Math.round(state.n).toLocaleString("en-IN") + suffix;
      },
    });
  });

  return (
    <span ref={ref} className={className}>
      {value.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}
