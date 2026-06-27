"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { getImageUrl } from "@/utils/imageLoader";
import styles from "./thumbnailStrip.module.css";

interface ThumbnailStripProps {
  images: Array<{
    id: string;
    src: string;
    alt: string;
    width: number;
    height: number;
  }>;
  currentIndex: number;
  onThumbnailClick: (index: number) => void;
  totalImages: number;
}

export default function ThumbnailStrip({
  images,
  currentIndex,
  onThumbnailClick,
  totalImages,
}: ThumbnailStripProps) {
  // Show thumbnails for next 6 images
  const thumbnailIndices = Array.from({ length: 6 }, (_, i) =>
    (currentIndex + i + 1) % totalImages
  );

  return (
    <motion.div
      className={styles.strip}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      {thumbnailIndices.map((index) => {
        const image = images[index];
        const isNext = index === (currentIndex + 1) % totalImages;

        return (
          <motion.button
            key={image.id}
            className={`${styles.thumbnail} ${
              isNext ? styles.thumbnailNext : ""
            }`}
            onClick={() => onThumbnailClick(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={`Jump to image ${index + 1}`}
          >
            <Image
              src={getImageUrl(image.src)}
              alt={image.alt}
              width={60}
              height={60}
              className={styles.image}
              sizes="60px"
            />
            {isNext && <div className={styles.highlight} />}
          </motion.button>
        );
      })}
    </motion.div>
  );
}
