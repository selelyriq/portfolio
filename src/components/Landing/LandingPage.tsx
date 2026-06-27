"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { landingImages } from "@/data/landingImages";
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

const imgSrc = (src: string) => `/images/${src}`;
const blurSrc = (src: string) => `/images/landing-blur/${src.split('/').pop()}`;

export default function LandingPage() {
  const [ready, setReady] = useState(false);
  const [mainGridImages, setMainGridImages] = useState<Map<string, CellImage>>(new Map());
  const [middleColumnImages, setMiddleColumnImages] = useState<Map<string, CellImage>>(new Map());
  const [blurColumnImages, setBlurColumnImages] = useState<Map<string, CellImage>>(new Map());

  const gridCells: GridCell[] = Array.from({ length: 20 }, (_, i) => ({
    id: `cell-${i}`,
    rotation: 45,
  }));

  // Preload all landing images before starting cycles
  useEffect(() => {
    let loaded = 0;
    const total = landingImages.length * 2; // main + blur per image

    const onLoad = () => {
      loaded++;
      if (loaded >= total) setReady(true);
    };

    landingImages.forEach(img => {
      const main = new window.Image();
      main.onload = onLoad;
      main.onerror = onLoad;
      main.src = imgSrc(img.src);

      const blur = new window.Image();
      blur.onload = onLoad;
      blur.onerror = onLoad;
      blur.src = blurSrc(img.src);
    });
  }, []);

  const getRandomUniqueImage = (excludeSrcs: Set<string>) => {
    const available = landingImages.filter(img => !excludeSrcs.has(img.src));
    if (available.length === 0) return landingImages[Math.floor(Math.random() * landingImages.length)];
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

  // Initialize all layers on mount
  useEffect(() => {
    setMainGridImages(initializeLayerImages([0,1,2,3,4,5,6,7,8,9]));
    setMiddleColumnImages(initializeLayerImages([1, 3, 5, 7]));
    setBlurColumnImages(initializeLayerImages([1,3,5,7,9,11,13,15,17,19]));
  }, []);

  // Cycle layers — only after preload is ready
  useEffect(() => {
    if (!ready) return;

    const baseInterval = 4500;
    const staggerMap = new Map<string, number>();
    gridCells.forEach(cell => {
      staggerMap.set(cell.id, Math.random() * baseInterval);
    });

    const timers: ReturnType<typeof setTimeout>[] = [];

    const cycleLayerWithStagger = (
      cellIndices: number[],
      setterFn: React.Dispatch<React.SetStateAction<Map<string, CellImage>>>
    ) => {
      cellIndices.forEach((index) => {
        const cell = gridCells[index];
        const stagger = staggerMap.get(cell.id) || 0;

        const timer = setTimeout(() => {
          const cycleTimer = setInterval(() => {
            setterFn(prev => {
              const updated = new Map(prev);
              const oldImage = prev.get(cell.id);
              const usedInLayer = new Set(Array.from(prev.values()).map(img => img.current));
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

    cycleLayerWithStagger([0,1,2,3,4,5,6,7,8,9], setMainGridImages);
    cycleLayerWithStagger([1, 3, 5, 7], setMiddleColumnImages);
    cycleLayerWithStagger([1,3,5,7,9,11,13,15,17,19], setBlurColumnImages);

    return () => timers.forEach(timer => clearInterval(timer));
  }, [ready]);

  return (
    <div className={styles.landing}>
      <ParticleField />

      {/* Small middle layer */}
      <div className={styles.gridMiddle}>
        {gridCells.map((cell, index) => {
          if (![1, 3, 5, 7].includes(index)) return null;
          const images = middleColumnImages.get(cell.id);
          if (!images) return null;

          return (
            <motion.div
              key={`middle-${cell.id}`}
              className={styles.cellMiddle}
              style={{ rotate: 45 }}
            >
              <AnimatePresence>
                {images.previous && (
                  <motion.div
                    key={`middle-prev-${images.previous}`}
                    className={styles.imageWrapperMiddle}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2 }}
                  >
                    <img
                      src={imgSrc(images.previous)}
                      alt=""
                      decoding="sync"
                      className={styles.imageMiddle}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.div
                key={`middle-curr-${images.current}`}
                className={styles.imageWrapperMiddle}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2 }}
              >
                <img
                  src={imgSrc(images.current)}
                  alt=""
                  decoding="sync"
                  className={styles.imageMiddle}
                />
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Blurred glow layer */}
      <div className={styles.gridBlur}>
        {gridCells.map((cell, index) => {
          if (![1,3,5,7,9,11,13,15,17,19].includes(index)) return null;
          const images = blurColumnImages.get(cell.id);
          if (!images) return null;

          return (
            <motion.div
              key={`blur-${cell.id}`}
              className={styles.cellBlur}
              style={{ rotate: 45 }}
            >
              <AnimatePresence>
                {images.previous && (
                  <motion.div
                    key={`blur-prev-${images.previous}`}
                    className={styles.imageWrapperBlur}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2 }}
                  >
                    <img
                      src={blurSrc(images.previous)}
                      alt=""
                      decoding="sync"
                      className={styles.imageBlur}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.div
                key={`blur-curr-${images.current}`}
                className={styles.imageWrapperBlur}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2 }}
              >
                <img
                  src={blurSrc(images.current)}
                  alt=""
                  decoding="sync"
                  className={styles.imageBlur}
                />
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Main grid */}
      <div className={styles.grid}>
        {gridCells.slice(0, 10).map((cell) => {
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
                {images.previous && (
                  <motion.div
                    key={`prev-${images.previous}`}
                    className={styles.imageWrapper}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2 }}
                  >
                    <img
                      src={imgSrc(images.previous)}
                      alt=""
                      decoding="sync"
                      className={styles.image}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.div
                key={`curr-${images.current}`}
                className={styles.imageWrapper}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2 }}
              >
                <img
                  src={imgSrc(images.current)}
                  alt=""
                  decoding="sync"
                  className={styles.image}
                />
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
