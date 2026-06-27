"use client";

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
}

export default function ImageLightbox({
  isOpen,
  image,
  onClose,
  onNext,
  onPrev,
}: ImageLightboxProps) {
  const router = useRouter();

  if (!image) return null;

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

          {/* Lightbox container */}
          <motion.div
            className={styles.lightbox}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            {/* Close button */}
            <motion.button
              className={styles.closeButton}
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Close lightbox"
            >
              ✕
            </motion.button>

            {/* Image — clickable to navigate to album */}
            <div
              className={styles.imageContainer}
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

            {/* Navigation arrows */}
            <motion.button
              className={`${styles.navButton} ${styles.prevButton}`}
              onClick={onPrev}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Previous image"
            >
              ←
            </motion.button>

            <motion.button
              className={`${styles.navButton} ${styles.nextButton}`}
              onClick={onNext}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Next image"
            >
              →
            </motion.button>

            {/* Image info */}
            <div className={styles.info}>
              <p className={styles.imageAlt}>{image.alt}</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
