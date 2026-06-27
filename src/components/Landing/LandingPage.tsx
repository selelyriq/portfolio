"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { highlightImages } from "@/data/highlights";
import { getImageUrl } from "@/utils/imageLoader";
import ParticleField from "./ParticleField";
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
  const [mainGridImages, setMainGridImages] = useState<
    Map<string, CellImage>
  >(new Map());
  const [middleColumnImages, setMiddleColumnImages] = useState<
    Map<string, CellImage>
  >(new Map());
  const [blurColumnImages, setBlurColumnImages] = useState<
    Map<string, CellImage>
  >(new Map());

  // Initialize grid cells with fixed 45-degree rotation
  const gridCells: GridCell[] = Array.from({ length: 16 }, (_, i) => ({
    id: `cell-${i}`,
    rotation: 45, // Fixed 45-degree rotation
  }));

  const getRandomUniqueImage = (excludeSrcs: Set<string>) => {
    const available = highlightImages.filter(img => !excludeSrcs.has(img.src));
    if (available.length === 0) return highlightImages[Math.floor(Math.random() * highlightImages.length)];
    return available[Math.floor(Math.random() * available.length)];
  };

  const initializeLayerImages = (cellIndices: number[]) => {
    const images = new Map<string, CellImage>();
    const usedSrcs = new Set<string>();
    cellIndices.forEach((index) => {
      const cell = gridCells[index];
      const randomImage = getRandomUniqueImage(usedSrcs);
      usedSrcs.add(randomImage.src);
      images.set(cell.id, { current: randomImage.src, previous: null });
    });
    return images;
  };

  const cycleLayerImages = (
    prevImages: Map<string, CellImage>,
    cellIndices: number[]
  ) => {
    const updated = new Map(prevImages);
    const usedSrcs = new Set<string>();
    cellIndices.forEach((index) => {
      const cell = gridCells[index];
      const oldImage = prevImages.get(cell.id);
      const randomImage = getRandomUniqueImage(usedSrcs);
      usedSrcs.add(randomImage.src);
      updated.set(cell.id, {
        current: randomImage.src,
        previous: oldImage?.current || null,
      });
    });
    return updated;
  };

  // Initialize main grid images
  useEffect(() => {
    const allIndices = Array.from({ length: gridCells.length }, (_, i) => i);
    setMainGridImages(initializeLayerImages(allIndices));
  }, []);

  // Initialize middle column images
  useEffect(() => {
    setMiddleColumnImages(initializeLayerImages([1, 3, 5, 7, 9, 11, 13]));
  }, []);

  // Initialize blur column images
  useEffect(() => {
    const blurIndices = gridCells
      .map((_, i) => i)
      .filter((i) => i % 2 === 1);
    setBlurColumnImages(initializeLayerImages(blurIndices));
  }, []);

  // Cycle layers with randomized stagger per cell
  useEffect(() => {
    const baseInterval = 1200; // Base cycle interval in ms
    const staggerMap = new Map<string, number>();

    // Generate random stagger offsets for each cell (0-200ms)
    gridCells.forEach((cell) => {
      staggerMap.set(cell.id, Math.random() * 200);
    });

    const timers: NodeJS.Timeout[] = [];

    const cycleLayerWithStagger = (
      cellIndices: number[],
      setterFn: React.Dispatch<React.SetStateAction<Map<string, CellImage>>>
    ) => {
      cellIndices.forEach((index) => {
        const cell = gridCells[index];
        const stagger = staggerMap.get(cell.id) || 0;

        const timer = setTimeout(() => {
          const cycleTimer = setInterval(() => {
            setterFn((prev) => {
              const updated = new Map(prev);
              const oldImage = prev.get(cell.id);
              const usedInLayer = new Set(
                Array.from(prev.values()).map((img) => img.current)
              );
              const randomImage = getRandomUniqueImage(usedInLayer);
              updated.set(cell.id, {
                current: randomImage.src,
                previous: oldImage?.current || null,
              });
              return updated;
            });
          }, baseInterval);
          timers.push(cycleTimer);
        }, stagger);

        timers.push(timer);
      });
    };

    // Apply cycling with stagger to each layer
    const allIndices = Array.from({ length: gridCells.length }, (_, i) => i);
    cycleLayerWithStagger(allIndices, setMainGridImages);
    cycleLayerWithStagger([1, 3, 5, 7, 9, 11, 13], setMiddleColumnImages);
    const blurIndices = gridCells
      .map((_, i) => i)
      .filter((i) => i % 2 === 1);
    cycleLayerWithStagger(blurIndices, setBlurColumnImages);

    return () => timers.forEach((timer) => clearInterval(timer));
  }, [gridCells]);

  return (
    <div className={styles.landing}>
      <ParticleField />
      {/* Small middle layer - only right column */}
      <div className={styles.gridMiddle}>
        {gridCells.map((cell, index) => {
          // Only render every other right column cell (indices 1, 3, 5, 7, 9)
          if (![1, 3, 5, 7, 9, 11, 13].includes(index)) return null;

          const images = middleColumnImages.get(cell.id);
          if (!images) return null;

          return (
            <motion.div
              key={`middle-${cell.id}`}
              className={styles.cellMiddle}
              style={{ rotate: 45 }}
            >
              <AnimatePresence>
                {/* Previous image (underneath) */}
                {images.previous && (
                  <motion.div
                    key={`middle-prev-${images.previous}`}
                    className={styles.imageWrapperMiddle}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 3 }}
                  >
                    <Image
                      src={getImageUrl(images.previous)}
                      alt="Highlight middle"
                      width={68}
                      height={120}
                      className={styles.imageMiddle}
                      priority={false}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Current image (on top, fading in) */}
              <motion.div
                key={`middle-curr-${images.current}`}
                className={styles.imageWrapperMiddle}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 3 }}
              >
                <Image
                  src={getImageUrl(images.current)}
                  alt="Highlight middle"
                  width={68}
                  height={120}
                  className={styles.imageMiddle}
                  priority={false}
                />
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Blurred glow layer - only right column */}
      <div className={styles.gridBlur}>
        {gridCells.map((cell, index) => {
          // Render odd indices for blur column (1, 3, 5, 7, 9, 11, 13, 15)
          if (index % 2 === 0) return null;

          const images = blurColumnImages.get(cell.id);
          if (!images) return null;

          return (
            <motion.div
              key={`blur-${cell.id}`}
              className={styles.cellBlur}
              style={{ rotate: 45 }}
            >
              <AnimatePresence>
                {/* Previous image (underneath) */}
                {images.previous && (
                  <motion.div
                    key={`blur-prev-${images.previous}`}
                    className={styles.imageWrapperBlur}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 3 }}
                  >
                    <Image
                      src={getImageUrl(images.previous)}
                      alt="Highlight blur"
                      width={202}
                      height={360}
                      className={styles.imageBlur}
                      priority={false}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Current image (on top, fading in) */}
              <motion.div
                key={`blur-curr-${images.current}`}
                className={styles.imageWrapperBlur}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 3 }}
              >
                <Image
                  src={getImageUrl(images.current)}
                  alt="Highlight blur"
                  width={202}
                  height={360}
                  className={styles.imageBlur}
                  priority={false}
                />
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Main grid */}
      <div className={styles.grid}>
        {gridCells.map((cell) => {
          const images = mainGridImages.get(cell.id);
          if (!images) return null;

          return (
            <motion.div
              key={cell.id}
              className={styles.cell}
              style={{ rotate: 45 }}
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
                      width={135}
                      height={240}
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
                  width={135}
                  height={240}
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
