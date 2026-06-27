"use client";

import Image from "next/image";
import styles from "./about.module.css";

export default function About() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Photo section */}
        <div className={styles.photoSection}>
          <div className={styles.photoContainer}>
            <Image
              src="/images/about.jpg"
              alt="Lyriq Sele"
              width={300}
              height={300}
              className={styles.photoImage}
            />
          </div>
        </div>

        {/* About text section */}
        <div className={styles.textSection}>
          <h1 className={styles.title}>About</h1>
          <div className={styles.content}>
            <p>Your about content goes here.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
