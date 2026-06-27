"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { portfolioData } from "@/data/projects";
import { getImageUrl } from "@/utils/imageLoader";
import { Project } from "@/types";
import ThumbnailStrip from "./ThumbnailStrip";
import ImageLightbox from "./ImageLightbox";
import styles from "./layeredGallery.module.css";

interface FlatImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  projectId: string;
  projectTitle: string;
}

function flattenImages(projects: Project[]): FlatImage[] {
  return projects.flatMap((project) =>
    project.images.map((image) => ({
      ...image,
      projectId: project.id,
      projectTitle: project.title,
    }))
  );
}

export default function LayeredGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollTimeRef = useRef(0);

  const allImages = flattenImages(portfolioData.projects);
  const totalImages = allImages.length;

  // Derived progress (0..1) based on current position
  const scrollProgress = totalImages > 0 ? currentIndex / totalImages : 0;

  // Calculate which images to display (current + next 2)
  const displayedIndices = [
    currentIndex,
    (currentIndex + 1) % totalImages,
    (currentIndex + 2) % totalImages,
  ];

  const displayedImages = displayedIndices.map((idx) => allImages[idx]);

  // Handle scroll wheel and keyboard navigation
  useEffect(() => {
    const scrollDelay = 1200; // milliseconds between scroll events

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastScrollTimeRef.current < scrollDelay) return;

      if (e.deltaY > 0) {
        // Scroll down
        setCurrentIndex((prev) => (prev + 1) % totalImages);
        lastScrollTimeRef.current = now;
      } else if (e.deltaY < 0) {
        // Scroll up
        setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
        lastScrollTimeRef.current = now;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        const now = Date.now();
        if (now - lastScrollTimeRef.current < scrollDelay) return;
        if (e.key === "ArrowDown") {
          setCurrentIndex((prev) => (prev + 1) % totalImages);
        } else {
          setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
        }
        lastScrollTimeRef.current = now;
      }
    };

    const container = containerRef.current;
    container?.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      container?.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [totalImages]);

  return (
    <div className={styles.container} ref={containerRef}>
      {/* Progress bar */}
      <motion.div
        className={styles.progressBar}
        style={{ scaleX: scrollProgress }}
      />

      {/* Main gallery cards */}
      <div className={styles.cardStack}>
        {displayedImages.map((image, layerIndex) => (
          <motion.div
            key={image.id}
            className={`${styles.card} ${
              layerIndex === 0 ? styles.cardActive : ""
            }`}
            onClick={() => layerIndex === 0 && setIsLightboxOpen(true)}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: layerIndex === 0 ? 1 : layerIndex === 1 ? 0.4 : 0.2,
              scale: layerIndex === 0 ? 1 : 0.7,
              y: layerIndex === 0 ? 0 : layerIndex === 1 ? 60 : 120,
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {layerIndex === 0 && (
              <div className={styles.glowBackdrop}>
                <Image
                  src={getImageUrl(image.src)}
                  alt=""
                  fill
                  className={styles.glowBackdropImage}
                  sizes="(max-width: 768px) 90vw, 70vw"
                  aria-hidden="true"
                />
              </div>
            )}
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

      {/* Thumbnail strip navigation */}
      <ThumbnailStrip
        images={allImages}
        currentIndex={currentIndex}
        onThumbnailClick={(index) => setCurrentIndex(index)}
        totalImages={totalImages}
      />

      {/* Image info */}
      <motion.div
        className={styles.info}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className={styles.projectTitle}>{displayedImages[0].projectTitle}</p>
        <p className={styles.imageCount}>
          {currentIndex + 1} / {totalImages}
        </p>
      </motion.div>

      {/* Full-screen lightbox */}
      <ImageLightbox
        isOpen={isLightboxOpen}
        image={displayedImages[0] || null}
        onClose={() => setIsLightboxOpen(false)}
        onNext={() => {
          setIsLightboxOpen(false);
          setCurrentIndex((prev) => (prev + 1) % totalImages);
        }}
        onPrev={() => {
          setIsLightboxOpen(false);
          setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
        }}
      />
    </div>
  );
}
