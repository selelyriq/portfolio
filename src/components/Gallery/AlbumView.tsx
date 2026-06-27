"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Project } from "@/types";
import { getImageUrl } from "@/utils/imageLoader";
import ImageLightbox from "./ImageLightbox";
import styles from "./albumView.module.css";

interface AlbumViewProps {
  project: Project;
}

export default function AlbumView({ project }: AlbumViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const images = project.images;
  const totalImages = images.length;

  const scrollProgress = totalImages > 0 ? currentIndex / totalImages : 0;

  const displayedIndices = [
    currentIndex,
    (currentIndex + 1) % totalImages,
    (currentIndex + 2) % totalImages,
  ];

  const displayedImages = displayedIndices.map((idx) => images[idx]);

  useEffect(() => {
    let lastScrollTime = 0;
    const scrollDelay = 800;

    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastScrollTime < scrollDelay) return;

      if (e.deltaY > 0) {
        setCurrentIndex((prev) => (prev + 1) % totalImages);
        lastScrollTime = now;
      } else if (e.deltaY < 0) {
        setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
        lastScrollTime = now;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLightboxOpen) return;
      const now = Date.now();
      if (now - lastScrollTime < scrollDelay) return;

      if (e.key === "ArrowDown") {
        setCurrentIndex((prev) => (prev + 1) % totalImages);
        lastScrollTime = now;
      } else if (e.key === "ArrowUp") {
        setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
        lastScrollTime = now;
      }
    };

    const container = containerRef.current;
    container?.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      container?.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [totalImages, isLightboxOpen]);

  return (
    <div className={styles.container} ref={containerRef}>
      {/* Progress bar */}
      <motion.div
        className={styles.progressBar}
        style={{ scaleX: scrollProgress }}
      />

      {/* Header */}
      <div className={styles.header}>
        <Link href="/" className={styles.backButton}>
          ← Back
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

      {/* Main gallery cards */}
      <div className={styles.cardStack}>
        {displayedImages.map((image, layerIndex) => (
          <motion.div
            key={`${image.id}-${layerIndex}`}
            className={[styles.card, layerIndex === 0 ? styles.cardActive : ""].filter(Boolean).join(" ")}
            onClick={() => layerIndex === 0 && setIsLightboxOpen(true)}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: layerIndex === 0 ? 1 : 0.4 - layerIndex * 0.15,
              y: layerIndex * 40,
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className={styles.imageWrapper}>
              <Image
                src={getImageUrl(image.src)}
                alt={image.alt}
                width={image.width}
                height={image.height}
                priority={layerIndex === 0}
                className={styles.image}
                sizes="(max-width: 768px) 90vw, 70vw"
              />
              {layerIndex === 0 && <div className={styles.glow} />}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Image count info */}
      <motion.div
        className={styles.info}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className={styles.imageCount}>
          {currentIndex + 1} / {totalImages}
        </p>
      </motion.div>

      {/* Lightbox */}
      <ImageLightbox
        isOpen={isLightboxOpen}
        image={displayedImages[0] || null}
        onClose={() => setIsLightboxOpen(false)}
        onNext={() => {
          setCurrentIndex((prev) => (prev + 1) % totalImages);
        }}
        onPrev={() => {
          setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
        }}
      />
    </div>
  );
}
