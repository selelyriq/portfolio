"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { galleryFeed } from "@/data/galleryFeed";
import { getImageUrl } from "@/utils/imageLoader";
import ThumbnailStrip from "./ThumbnailStrip";
import ImageLightbox from "./ImageLightbox";
import styles from "./layeredGallery.module.css";

const PRELOAD_AHEAD = 3;
const PRELOAD_BEHIND = 1;

export default function LayeredGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardStackRef = useRef<HTMLDivElement>(null);
  const lastScrollTimeRef = useRef(0);
  const currentIndexRef = useRef(currentIndex);
  const touchStartRef = useRef<number | null>(null);
  const firstImageIndexRef = useRef(0);
  useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);

  const [allImages] = useState(() => {
    const arr = [...galleryFeed];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });
  const totalImages = allImages.length;

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
      // Listener is on the cardStack, so this only fires when the cursor is
      // over the stacked photo cards — no viewport-engagement guard needed.
      const atCeiling = currentIndexRef.current === firstImageIndexRef.current;
      const scrollingUp = e.deltaY < 0;

      // At first image scrolling up — let page scroll up naturally, no preventDefault
      if (atCeiling && scrollingUp) return;

      // Lock the page while cursor is on the card — prevents scrolling past the gallery
      e.preventDefault();

      // Debounce: page is locked above but navigation only fires when cooldown clears
      const now = Date.now();
      if (now - lastScrollTimeRef.current < scrollDelay) return;

      if (e.deltaY > 0) {
        setCurrentIndex((prev) => (prev + 1) % totalImages);
      } else {
        setCurrentIndex((prev) => prev - 1);
      }
      lastScrollTimeRef.current = now;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;

      const atCeiling = currentIndexRef.current === firstImageIndexRef.current;
      const pressedUp = e.key === "ArrowUp";

      // At first image pressing up — let page scroll, don't intercept
      if (atCeiling && pressedUp) return;

      e.preventDefault();

      const now = Date.now();
      if (now - lastScrollTimeRef.current < scrollDelay) return;

      if (e.key === "ArrowDown") {
        setCurrentIndex((prev) => (prev + 1) % totalImages);
      } else {
        setCurrentIndex((prev) => prev - 1);
      }
      lastScrollTimeRef.current = now;
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

      const atCeiling = currentIndexRef.current === firstImageIndexRef.current;
      const swipingDown = delta < 0;

      // At first image swiping down — let page scroll, don't intercept
      if (atCeiling && swipingDown) {
        touchStartRef.current = null;
        return;
      }

      const now = Date.now();
      if (now - lastScrollTimeRef.current < scrollDelay) {
        touchStartRef.current = null;
        return;
      }

      if (delta > 0) {
        // Swipe up: next image
        setCurrentIndex((prev) => (prev + 1) % totalImages);
        lastScrollTimeRef.current = now;
      } else {
        // Swipe down: previous image
        setCurrentIndex((prev) => prev - 1);
        lastScrollTimeRef.current = now;
      }

      touchStartRef.current = null;
    };

    // wheel + touch → cardStack (cursor-targeted): navigation only fires when
    // the cursor/touch lands on the stacked cards. keyboard → window.
    const cardStack = cardStackRef.current;
    cardStack?.addEventListener("wheel", handleWheel, { passive: false });
    cardStack?.addEventListener("touchstart", handleTouchStart, { passive: true });
    cardStack?.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      cardStack?.removeEventListener("wheel", handleWheel);
      cardStack?.removeEventListener("touchstart", handleTouchStart);
      cardStack?.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [totalImages]);

  return (
    <div className={styles.container} ref={containerRef}>
      {/* Glow backdrop — rendered outside cardStack so it's not constrained by card stacking context */}
      <div className={styles.glowBackdrop}>
        <Image
          src={getImageUrl(`blur-thumbs/${displayedImages[1].src.split('/').pop()}`)}
          alt=""
          width={80}
          height={80}
          className={styles.glowBackdropImage}
          loading="eager"
          aria-hidden="true"
        />
      </div>

      {/* Preload window — hidden, slides with currentIndex */}
      <div style={{ display: 'none' }} aria-hidden="true">
        {Array.from({ length: PRELOAD_AHEAD + PRELOAD_BEHIND + 1 }, (_, i) => {
          const idx = currentIndex - PRELOAD_BEHIND + i;
          // Skip the 3 already-rendered card slots
          if (idx < 0 || idx >= totalImages) return null;
          if (idx >= currentIndex - 1 && idx <= currentIndex + 1) return null;
          const img = allImages[idx];
          return (
            <Image
              key={`preload-${img.id}`}
              src={getImageUrl(img.src)}
              alt=""
              width={img.width}
              height={img.height}
              priority={false}
            />
          );
        })}
      </div>

      {/* Main gallery cards */}
      <div className={styles.cardStack} ref={cardStackRef}>
        {displayedImages.map((image, layerIndex) => (
          <motion.div
            key={`card-slot-${layerIndex}`}
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
        currentIndex={currentIndex}
        totalImages={totalImages}
      />
    </div>
  );
}
