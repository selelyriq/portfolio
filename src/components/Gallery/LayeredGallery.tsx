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
  const currentIndexRef = useRef(currentIndex);
  const touchStartRef = useRef<number | null>(null);
  const firstImageIndexRef = useRef(0);
  useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);

  const allImages = flattenImages(portfolioData.projects);
  const totalImages = allImages.length;

  // Derived progress (0..1) based on current position
  const scrollProgress = totalImages > 1 ? currentIndex / (totalImages - 1) : 0;

  // Calculate which images to display (previous, current, next)
  const displayedIndices = [
    Math.max(0, currentIndex - 1),        // previous (clamp at start)
    currentIndex,                          // current
    (currentIndex + 1) % totalImages,     // next (wrap at end)
  ];

  const displayedImages = displayedIndices.map((idx) => allImages[idx]);

  // Handle scroll wheel and keyboard navigation
  useEffect(() => {
    const scrollDelay = 1200; // milliseconds between scroll events

    const handleWheel = (e: WheelEvent) => {
      // Ceiling: if at first image and scrolling up, allow native scroll to landing page
      const isCeiling = e.deltaY < 0 && currentIndexRef.current === firstImageIndexRef.current;

      // Always lock window while in feed (except at ceiling scrolling up)
      if (!isCeiling) {
        e.preventDefault();
      }

      const now = Date.now();
      if (now - lastScrollTimeRef.current < scrollDelay) return;

      // If at ceiling and scrolling up, allow page scroll without changing image
      if (isCeiling) return;

      if (e.deltaY > 0) {
        // Scroll down (wrap at end)
        setCurrentIndex((prev) => (prev + 1) % totalImages);
        lastScrollTimeRef.current = now;
      } else if (e.deltaY < 0) {
        // Scroll up (clamp at start, no wrap)
        setCurrentIndex((prev) => prev - 1);
        lastScrollTimeRef.current = now;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        const isCeiling = e.key === "ArrowUp" && currentIndexRef.current === firstImageIndexRef.current;

        // Lock keys while in feed (except at ceiling with ArrowUp)
        if (!isCeiling) {
          e.preventDefault();
        }

        const now = Date.now();
        if (now - lastScrollTimeRef.current < scrollDelay) return;

        // If at ceiling and pressing ArrowUp, allow native behavior without changing image
        if (isCeiling) return;

        if (e.key === "ArrowDown") {
          setCurrentIndex((prev) => (prev + 1) % totalImages);
        } else {
          setCurrentIndex((prev) => prev - 1);
        }
        lastScrollTimeRef.current = now;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = e.touches[0]?.clientY ?? null;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartRef.current === null) return;

      const touchEndY = e.changedTouches[0]?.clientY;
      if (touchEndY === undefined) return;

      const delta = touchStartRef.current - touchEndY;
      const minSwipe = 50; // Minimum swipe distance

      if (Math.abs(delta) < minSwipe) {
        touchStartRef.current = null;
        return;
      }

      // Ceiling: if at first image and swiping down (delta < 0), allow native scroll
      const isCeiling = delta < 0 && currentIndexRef.current === firstImageIndexRef.current;

      const now = Date.now();
      if (now - lastScrollTimeRef.current < scrollDelay) {
        touchStartRef.current = null;
        return;
      }

      // If at ceiling and swiping down, allow page scroll without changing image
      if (isCeiling) {
        touchStartRef.current = null;
        return;
      }

      if (delta > 0) {
        // Swipe up: next image (downward = next)
        setCurrentIndex((prev) => (prev + 1) % totalImages);
        lastScrollTimeRef.current = now;
      } else {
        // Swipe down: previous image (ceiling clamp)
        setCurrentIndex((prev) => prev - 1);
        lastScrollTimeRef.current = now;
      }

      touchStartRef.current = null;
    };

    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      // Lock scroll while in gallery (except at ceiling scrolling up)
      const isCeiling = currentIndexRef.current === firstImageIndexRef.current;
      if (!isCeiling) {
        // Revert scroll to maintain position in feed
        window.scrollTo(0, lastScrollY);
      } else {
        // At ceiling, allow scroll and track new position
        lastScrollY = window.scrollY;
      }
    };

    const container = containerRef.current;
    container?.addEventListener("wheel", handleWheel, { passive: false });
    container?.addEventListener("touchstart", handleTouchStart, { passive: true });
    container?.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll);

    return () => {
      container?.removeEventListener("wheel", handleWheel);
      container?.removeEventListener("touchstart", handleTouchStart);
      container?.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [totalImages]);

  return (
    <div className={styles.container} ref={containerRef}>
      {/* Progress bar */}
      <motion.div
        className={styles.progressBar}
        style={{ scaleX: scrollProgress }}
      />

      {/* Glow backdrop — rendered outside cardStack so it's not constrained by card stacking context */}
      <div className={styles.glowBackdrop}>
        <Image
          src={getImageUrl(displayedImages[1].src)}
          alt=""
          fill
          className={styles.glowBackdropImage}
          sizes="(max-width: 768px) 90vw, 70vw"
          aria-hidden="true"
        />
      </div>

      {/* Main gallery cards */}
      <div className={styles.cardStack}>
        {displayedImages.map((image, layerIndex) => (
          <motion.div
            key={`card-${layerIndex}-${image.id}`}
            className={`${styles.card} ${
              layerIndex === 1 ? styles.cardActive : ""
            }`}
            onClick={() => layerIndex === 1 && setIsLightboxOpen(true)}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: layerIndex === 1 ? 1 : 0.25,
              scale: layerIndex === 1 ? 1 : 0.85,
              y: layerIndex === 0 ? -90 : layerIndex === 1 ? 0 : 90,
              zIndex: layerIndex === 1 ? 3 : layerIndex === 0 ? 1 : 2,
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className={styles.imageWrapper}>
              <Image
                src={getImageUrl(image.src)}
                alt={image.alt}
                width={image.width}
                height={image.height}
                priority={layerIndex === 1}
                className={styles.image}
                sizes="(max-width: 768px) 90vw, 70vw"
              />
              {layerIndex === 1 && <div className={styles.glow} />}
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
        <p className={styles.projectTitle}>{displayedImages[1].projectTitle}</p>
        <p className={styles.imageCount}>
          {currentIndex + 1} / {totalImages}
        </p>
      </motion.div>

      {/* Full-screen lightbox */}
      <ImageLightbox
        isOpen={isLightboxOpen}
        image={displayedImages[1] || null}
        onClose={() => setIsLightboxOpen(false)}
        onNext={() => {
          setIsLightboxOpen(false);
          setCurrentIndex((prev) => (prev + 1) % totalImages);
        }}
        onPrev={() => {
          if (currentIndex === firstImageIndexRef.current) return;
          setIsLightboxOpen(false);
          setCurrentIndex((prev) => prev - 1);
        }}
        disablePrev={currentIndex === firstImageIndexRef.current}
      />
    </div>
  );
}
