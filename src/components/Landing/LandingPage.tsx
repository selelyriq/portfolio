"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { highlightImages } from "@/data/highlights";
import { getImageUrl } from "@/utils/imageLoader";
import styles from "./landingPage.module.css";

interface GridCell {
  id: string;
  rotation: number;
}

export default function LandingPage() {
  const [displayedImages, setDisplayedImages] = useState<
    Map<string, string>
  >(new Map());

  // Initialize grid cells with fixed 45-degree rotation
  const gridCells: GridCell[] = Array.from({ length: 12 }, (_, i) => ({
    id: `cell-${i}`,
    rotation: 45, // Fixed 45-degree rotation
  }));

  // Initialize with random images for each cell
  useEffect(() => {
    const initialImages = new Map<string, string>();
    gridCells.forEach((cell) => {
      const randomImage =
        highlightImages[Math.floor(Math.random() * highlightImages.length)];
      initialImages.set(cell.id, randomImage.src);
    });
    setDisplayedImages(initialImages);
  }, []);

  // Cycle images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayedImages((prev) => {
        const updated = new Map(prev);
        gridCells.forEach((cell) => {
          const randomImage =
            highlightImages[Math.floor(Math.random() * highlightImages.length)];
          updated.set(cell.id, randomImage.src);
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
          const imageSrc = displayedImages.get(cell.id);
          if (!imageSrc) return null;

          return (
            <motion.div
              key={cell.id}
              className={styles.cell}
              style={{ rotate: cell.rotation }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className={styles.imageWrapper}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                key={imageSrc}
              >
                <Image
                  src={getImageUrl(imageSrc)}
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
