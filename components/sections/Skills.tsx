import { skills, leadership } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";
import styles from "./Skills.module.css";

export function Skills() {
  return (
    <section className={styles.section} id="skills" aria-labelledby="skills-heading">
      <Reveal className={styles.head}>
        <p className="eyebrow" data-reveal>
          05 — Instrument panel
        </p>
        <h2 id="skills-heading" className={`display ${styles.heading}`} data-reveal>
          Tools on the <em className="serif-italic">bench</em>
        </h2>
      </Reveal>

      <Reveal className={styles.grid} stagger={0.06}>
        {skills.map((g, i) => (
          <div key={g.group} className={styles.column} data-reveal>
            <div className={styles.columnHead}>
              <span className={`mono ${styles.columnIndex}`}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className={`mono ${styles.columnTitle}`}>{g.group}</h3>
            </div>
            <ul className={`mono ${styles.items}`}>
              {g.items.map((item) => (
                <li key={item} className={styles.item}>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Reveal>

      <Reveal className={styles.leadership}>
        <div className={styles.leadershipInner} data-reveal>
          <span className={`mono ${styles.leadershipTag}`}>Leadership</span>
          <h3 className={`display ${styles.leadershipTitle}`}>{leadership.title}</h3>
          <p className={styles.leadershipDetail}>{leadership.detail}</p>
        </div>
      </Reveal>
    </section>
  );
}
