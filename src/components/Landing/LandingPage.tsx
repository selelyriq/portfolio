"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { highlightImages } from "@/data/highlights";
import { getImageUrl } from "@/utils/imageLoader";
import styles from "./landingPage.module.css";

interface GridCell {
  id: string;
  rotation: number;
}

interface CellImage {
  current: string;
  previous: string | null;
}

export default function LandingPage() {
  const [displayedImages, setDisplayedImages] = useState<
    Map<string, CellImage>
  >(new Map());

  // Initialize grid cells with fixed 45-degree rotation
  const gridCells: GridCell[] = Array.from({ length: 12 }, (_, i) => ({
    id: `cell-${i}`,
    rotation: 45, // Fixed 45-degree rotation
  }));

  // Initialize with random images for each cell
  useEffect(() => {
    const initialImages = new Map<string, CellImage>();
    gridCells.forEach((cell) => {
      const randomImage =
        highlightImages[Math.floor(Math.random() * highlightImages.length)];
      initialImages.set(cell.id, { current: randomImage.src, previous: null });
    });
    setDisplayedImages(initialImages);
  }, []);

  // Cycle images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayedImages((prev) => {
        const updated = new Map(prev);
        gridCells.forEach((cell) => {
          const oldImage = prev.get(cell.id);
          const randomImage =
            highlightImages[Math.floor(Math.random() * highlightImages.length)];
          updated.set(cell.id, {
            current: randomImage.src,
            previous: oldImage?.current || null,
          });
        });
        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [gridCells]);

  return (
    <div className={styles.landing}>
      <div className={styles.grid}>
        {gridCells.map((cell) => {
          const images = displayedImages.get(cell.id);
          if (!images) return null;

          return (
            <motion.div
              key={cell.id}
              className={styles.cell}
              style={{ rotate: cell.rotation }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <AnimatePresence>
                {/* Previous image (underneath) */}
                {images.previous && (
                  <motion.div
                    key={`prev-${images.previous}`}
                    className={styles.imageWrapper}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 3 }}
                  >
                    <Image
                      src={getImageUrl(images.previous)}
                      alt="Highlight"
                      width={250}
                      height={350}
                      className={styles.image}
                      priority={false}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Current image (on top, fading in) */}
              <motion.div
                key={`curr-${images.current}`}
                className={styles.imageWrapper}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 3 }}
              >
                <Image
                  src={getImageUrl(images.current)}
                  alt="Highlight"
                  width={250}
                  height={350}
                  className={styles.image}
                  priority={false}
                />
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
