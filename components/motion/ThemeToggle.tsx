"use client";

import { useSyncExternalStore } from "react";
import styles from "./ThemeToggle.module.css";

type Theme = "light" | "dark";
const KEY = "theme";

// The <html data-theme> attribute is the source of truth. Subscribe to it with
// a MutationObserver so the button stays in sync even if the attribute is
// changed elsewhere (e.g. the pre-paint script in app/layout.tsx).
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const getSnapshot = (): Theme =>
  document.documentElement.dataset.theme === "dark" ? "dark" : "light";

const getServerSnapshot = (): Theme => "light";

/**
 * Light is the default. The inline script in app/layout.tsx applies a saved
 * "dark" preference before paint; this component only reflects and updates it.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    if (next === "dark") {
      document.documentElement.dataset.theme = "dark";
    } else {
      delete document.documentElement.dataset.theme;
    }
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* storage unavailable — theme still applies for this visit */
    }
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      className={`${styles.toggle} ${className ?? ""}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      <span className={styles.disc} data-dark={isDark || undefined} aria-hidden="true" />
      <span className={`mono ${styles.label}`}>{isDark ? "Dark" : "Light"}</span>
    </button>
  );
}
