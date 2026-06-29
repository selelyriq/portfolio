"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Project } from "@/types";
import { getImageUrl } from "@/utils/imageLoader";
import styles from "./albumView.module.css";

interface AlbumViewProps {
  project: Project;
}

export default function AlbumView({ project }: AlbumViewProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handlePrevious = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex === 0 ? project.images.length - 1 : selectedIndex - 1);
  };

  const handleNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex === project.images.length - 1 ? 0 : selectedIndex + 1);
  };

  return (
    <main className={styles.main}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/projects" className={styles.backButton}>
          ← Back to Albums
        </Link>
        <div className={styles.albumMeta}>
          <h1 className={styles.albumTitle}>{project.title}</h1>
          {project.description && (
            <p className={styles.albumDescription}>{project.description}</p>
          )}
          {project.year && (
            <span className={styles.albumYear}>{project.year}</span>
          )}
        </div>
      </div>

      {/* Image grid */}
      <div className={styles.container}>
        <div className={styles.grid}>
          {project.images.map((image, index) => (
            <button
              key={image.id || index}
              className={styles.item}
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-label={`View ${image.alt || `image ${index + 1}`}`}
            >
              {/* Blurred background glow */}
              <div className={styles.glowBackground}>
                <Image
                  src={getImageUrl(image.src)}
                  alt=""
                  width={600}
                  height={450}
                  className={styles.glowImage}
                  aria-hidden="true"
                />
              </div>
              {/* Main image */}
              <div className={styles.imageWrapper}>
                <Image
                  src={getImageUrl(image.src)}
                  alt={image.alt || `Album image ${index + 1}`}
                  width={600}
                  height={450}
                  className={styles.image}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Fullscreen lightbox with glow backdrop */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <>
            {/* Glow backdrop - only in fullscreen */}
            <div className={styles.lightboxGlowBackdrop}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getImageUrl(project.images[selectedIndex].src)}
                alt=""
                className={styles.glowBackdropImage}
                aria-hidden="true"
              />
            </div>

            {/* Lightbox */}
            <motion.div
              className={styles.lightbox}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedIndex(null)}
            >
              <div className={styles.lightboxContent}>
                <button
                  className={`${styles.lightboxNavButton} ${styles.prevButton}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevious();
                  }}
                  aria-label="Previous image"
                >
                  ‹
                </button>

                <div onClick={(e) => e.stopPropagation()}>
                  <Image
                    src={getImageUrl(project.images[selectedIndex].src)}
                    alt={project.images[selectedIndex].alt || ""}
                    width={1200}
                    height={800}
                    className={styles.lightboxImage}
                  />
                </div>

                <button
                  className={`${styles.lightboxNavButton} ${styles.nextButton}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  aria-label="Next image"
                >
                  ›
                </button>

                <div className={styles.counter}>
                  {selectedIndex + 1} / {project.images.length}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
