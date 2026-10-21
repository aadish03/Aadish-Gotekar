import { publications } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";
import styles from "./Publications.module.css";

export function Publications() {
  return (
    <section className={styles.section} id="papers" aria-labelledby="papers-heading">
      <Reveal className={styles.head}>
        <p className="eyebrow" data-reveal>
          04 — Research output
        </p>
        <h2 id="papers-heading" className={`display ${styles.heading}`} data-reveal>
          Papers in <em className="serif-italic">motion</em>
        </h2>
      </Reveal>

      <Reveal as="ol" className={styles.list} stagger={0.12}>
        {publications.map((p, i) => (
          <li key={p.title} className={styles.card} data-reveal>
            <span className={`mono ${styles.index}`}>[{String(i + 1).padStart(2, "0")}]</span>
            <div className={styles.body}>
              <h3 className={styles.title}>{p.title}</h3>
              <p className={`mono ${styles.venue}`}>{p.venue}</p>
            </div>
            <span
              className={`mono ${styles.status} ${
                p.status === "Published"
                  ? styles.statusPublished
                  : p.status === "Under review"
                    ? styles.statusReview
                    : styles.statusWip
              }`}
            >
              <span className={styles.statusDot} aria-hidden="true" />
              {p.status}
            </span>
          </li>
        ))}
      </Reveal>
    </section>
  );
}
