import { achievements, publications } from "@/lib/content";
import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Reveal";
import styles from "./ProofStrip.module.css";

const stats = [
  { value: 86000, suffix: "+", label: "teams beaten at SIH 2024" },
  { value: 2000, suffix: "+", label: "teams at MoveAI, international" },
  { value: achievements.length, suffix: "", label: "hackathon wins" },
  { value: publications.length, suffix: "", label: "papers in flight" },
];

export function ProofStrip() {
  const ticker = [...achievements, ...achievements];

  return (
    <section className={styles.strip} aria-label="Highlights">
      <div className={styles.marquee}>
        <ul className={styles.track}>
          {ticker.map((a, i) => (
            <li key={`${a.title}-${i}`} className={styles.item} aria-hidden={i >= achievements.length}>
              <span className={`display ${styles.itemTitle}`}>{a.title}</span>
              <span className={`mono ${styles.itemMeta}`}>
                Winner · {a.scale}
              </span>
              <span className={styles.sep} aria-hidden="true">
                ✦
              </span>
            </li>
          ))}
        </ul>
      </div>

      <Reveal className={styles.stats} as="ul">
        {stats.map((s) => (
          <li key={s.label} data-reveal className={styles.stat}>
            <Counter value={s.value} suffix={s.suffix} className={`display ${styles.statValue}`} />
            <span className={`mono ${styles.statLabel}`}>{s.label}</span>
          </li>
        ))}
      </Reveal>
    </section>
  );
}
