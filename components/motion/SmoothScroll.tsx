"use client";

import { useLenis } from "@/hooks/useLenis";
import { ThemeToggle } from "@/components/motion/ThemeToggle";
import styles from "./SmoothScroll.module.css";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useLenis();
  return (
    <>
      {children}
      <div className={styles.themeDock}>
        <ThemeToggle />
      </div>
    </>
  );
}
