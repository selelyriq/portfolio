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
        <picture>
          <source srcSet="/images/about-me-mobile.jpg" media="(max-width: 768px)" />
          <img src="/images/about-me-desktop.jpg" alt="About Lyriq Sele" className={styles.graphic} />
        </picture>
      </div>
    </section>
  );
}
