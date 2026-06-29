"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./aboutSection.module.css";

export default function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={`${styles.about} ${visible ? styles.visible : ""}`} id="about" ref={ref}>
      <div className={styles.content}>
        {/* Replace with your graphic — e.g. <img src="/images/about-graphic.webp" className={styles.graphic} alt="" /> */}
        <p className={styles.placeholder}>About coming soon.</p>
      </div>
    </section>
  );
}
