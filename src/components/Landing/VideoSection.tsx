"use client";

import { useRef, useCallback } from "react";
import styles from "./videoSection.module.css";

export default function VideoSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if ((el as any).webkitRequestFullscreen) {
      (el as any).webkitRequestFullscreen();
    }
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.videoWrap} onClick={handleClick}>
        <div ref={containerRef} className={styles.fsContainer}>
          <video
            src="/videos/reel.mp4"
            autoPlay
            muted
            loop
            playsInline
            className={styles.video}
          />
          <div className={styles.overlay} />
        </div>
      </div>
    </section>
  );
}
