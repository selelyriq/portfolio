"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { highlightImages } from "@/data/highlights";
import { getImageUrl } from "@/utils/imageLoader";
import styles from "./gallery.module.css";

export default function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handlePrevious = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex === 0 ? highlightImages.length - 1 : selectedIndex - 1);
  };

  const handleNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex === highlightImages.length - 1 ? 0 : selectedIndex + 1);
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Gallery</h1>
        <div className={styles.grid}>
          {highlightImages.map((image, index) => (
            <button
              key={image.id || index}
              className={styles.item}
              onClick={() => setSelectedIndex(index)}
              type="button"
              aria-label={`View ${image.alt || `image ${index + 1}`}`}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={getImageUrl(image.src)}
                  alt={image.alt || `Gallery image ${index + 1}`}
                  width={600}
                  height={400}
                  className={styles.image}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            className={styles.lightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIndex(null)}
          >
            <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
              <button
                className={`${styles.navButton} ${styles.prevButton}`}
                onClick={handlePrevious}
                aria-label="Previous image"
              >
                ‹
              </button>

              <Image
                src={getImageUrl(highlightImages[selectedIndex].src)}
                alt={highlightImages[selectedIndex].alt || ""}
                width={1200}
                height={800}
                className={styles.lightboxImage}
              />

              <button
                className={`${styles.navButton} ${styles.nextButton}`}
                onClick={handleNext}
                aria-label="Next image"
              >
                ›
              </button>
            </div>

            <div className={styles.counter} onClick={(e) => e.stopPropagation()}>
              {selectedIndex + 1} / {highlightImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
