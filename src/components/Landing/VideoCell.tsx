"use client";

import { useRef, useCallback } from "react";
import styles from "./landingPage.module.css";

export default function VideoCell() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(() => {
    const el = fullscreenRef.current;
    if (!el) return;
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if ((el as any).webkitRequestFullscreen) {
      (el as any).webkitRequestFullscreen();
    }
  }, []);

  return (
    <div className={styles.cell} style={{ rotate: "45deg" }} onClick={handleClick}>
      <div className={styles.imageWrapper} style={{ cursor: "pointer" }}>
        {/* fullscreenRef wraps both video and the click-blocker overlay */}
        <div ref={fullscreenRef} className={styles.videoFullscreenContainer}>
          <video
            ref={videoRef}
            src="/videos/reel.mp4"
            autoPlay
            muted
            loop
            playsInline
            className={styles.videoElement}
          />
          {/* Transparent overlay — captures clicks so the video can't be paused */}
          <div className={styles.videoOverlay} />
        </div>
      </div>
    </div>
  );
}
