"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
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
      <div className={styles.inner}>
        <p className={styles.bio}>
          For over five years I&apos;ve been doing photography. Started as a progression
          from graphic design, turned it into my fulltime job for a few years. But ultimately
          I find it way more fun purely as a hobby. So now I shoot for fun and work as a
          Cloud Platform Engineer. This portfolio is what I&apos;ve considered some of my
          greatest hits over the years.
        </p>
        <div className={styles.photoWrap}>
          <Image
            src="/images/about.jpg"
            alt="Lyriq Sele"
            width={1170}
            height={1010}
            className={styles.photo}
            priority
          />
        </div>
      </div>
    </section>
  );
}
