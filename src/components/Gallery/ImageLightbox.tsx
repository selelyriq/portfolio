"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getImageUrl } from "@/utils/imageLoader";
import styles from "./imageLightbox.module.css";

interface ImageLightboxProps {
  isOpen: boolean;
  image: {
    id: string;
    src: string;
    alt: string;
    width: number;
    height: number;
    projectId?: string;
  } | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  disablePrev?: boolean;
  currentIndex?: number;
  totalImages?: number;
}

export default function ImageLightbox({
  isOpen,
  image,
  onClose,
  onNext,
  onPrev,
  disablePrev = false,
  currentIndex = 0,
  totalImages = 0,
}: ImageLightboxProps) {
  const router = useRouter();
  const touchStartX = useRef<number | null>(null);

  if (!image) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - (e.changedTouches[0]?.clientX ?? 0);
    if (Math.abs(delta) > 50) {
      delta > 0 ? onNext() : (!disablePrev && onPrev());
    }
    touchStartX.current = null;
  };

  const handleImageClick = () => {
    if (image.projectId) {
      onClose();
      router.push(`/album/${image.projectId}`);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with frosted glass */}
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Lightbox container — click outside image to close */}
          <motion.div
            className={styles.lightbox}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          >
            {/* Image container — stops propagation so clicking image doesn't close */}
            <div
              className={styles.imageContainer}
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Prev arrow — inside imageContainer, positioned left of it */}
              <motion.button
                className={`${styles.navButton} ${styles.prevButton}`}
                onClick={(e) => { e.stopPropagation(); onPrev(); }}
                disabled={disablePrev}
                whileHover={!disablePrev ? { scale: 1.1 } : undefined}
                whileTap={!disablePrev ? { scale: 0.95 } : undefined}
                style={disablePrev ? { opacity: 0.3, cursor: "default" } : undefined}
                aria-label="Previous image"
              >
                ‹
              </motion.button>

              <div
                onClick={handleImageClick}
                style={image.projectId ? { cursor: "pointer" } : undefined}
                title={image.projectId ? "Click to view album" : undefined}
              >
                <Image
                  src={getImageUrl(image.src)}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  priority
                  className={styles.image}
                  sizes="90vw"
                />
              </div>

              {/* Next arrow — inside imageContainer, positioned right of it */}
              <motion.button
                className={`${styles.navButton} ${styles.nextButton}`}
                onClick={(e) => { e.stopPropagation(); onNext(); }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Next image"
              >
                ›
              </motion.button>
            </div>

            {/* Image counter */}
            {totalImages > 0 && (
              <div className={styles.counter}>
                {currentIndex + 1} / {totalImages}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
