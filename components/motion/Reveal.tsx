"use client";

import { useGsapContext, gsap } from "@/hooks/useGsapContext";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Selector for staggered children. Defaults to `[data-reveal]`; falls back to the wrapper. */
  selector?: string;
  stagger?: number;
  y?: number;
  as?: "div" | "section" | "ul" | "ol" | "li" | "header" | "footer";
};

/**
 * Scroll-triggered reveal. Children are fully visible without JS; GSAP only
 * animates them from a lowered, transparent state when they enter the viewport.
 */
export function Reveal({
  children,
  className,
  selector = "[data-reveal]",
  stagger = 0.08,
  y = 40,
  as: Tag = "div",
}: Props) {
  const ref = useGsapContext<HTMLElement>((_ctx, scope) => {
    const targets = scope.querySelectorAll(selector);
    const nodes = targets.length ? Array.from(targets) : [scope];
    gsap.from(nodes, {
      y,
      opacity: 0,
      duration: 1.1,
      ease: "expo.out",
      stagger,
      clearProps: "transform",
      scrollTrigger: { trigger: scope, start: "top 82%", once: true },
    });
  });

  // @ts-expect-error — polymorphic ref typing across intrinsic elements
  return <Tag ref={ref} className={className}>{children}</Tag>;
}
