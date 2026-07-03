"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { galleryFeed } from "@/data/galleryFeed";
import { getImageUrl } from "@/utils/imageLoader";
import ImageLightbox from "@/components/Gallery/ImageLightbox";
import styles from "./gallery.module.css";

const BATCH_SIZE = 24;

export default function Gallery() {
  const [count, setCount] = useState(BATCH_SIZE);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const visible = galleryFeed.slice(0, count);
  const hasMore = count < galleryFeed.length;

  const loadMore = useCallback(() => {
    setCount((prev) => Math.min(prev + BATCH_SIZE, galleryFeed.length));
  }, []);

  useEffect(() => {
    if (!hasMore) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "600px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  const handleClose = () => setSelectedIndex(null);

  const handleNext = () => {
    setSelectedIndex((prev) =>
      prev === null ? null : (prev + 1) % visible.length
    );
  };

  const handlePrev = () => {
    setSelectedIndex((prev) =>
      prev === null ? null : (prev - 1 + visible.length) % visible.length
    );
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Gallery</h1>
        <p className={styles.subtitle}>{galleryFeed.length} PHOTOGRAPHS</p>
      </header>

      <div className={styles.masonry}>
        {visible.map((image, index) => (
          <button
            key={image.id}
            type="button"
            className={styles.item}
            onClick={() => setSelectedIndex(index)}
            aria-label={`View photograph ${index + 1}`}
          >
            <Image
              src={getImageUrl(image.src)}
              alt={image.alt || `Gallery photograph ${index + 1}`}
              width={image.width}
              height={image.height}
              className={styles.image}
              loading="lazy"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </button>
        ))}
      </div>

      {hasMore && (
        <div ref={sentinelRef} className={styles.sentinel}>
          <span className={styles.spinner} aria-hidden="true" />
          <span className={styles.loadingText}>Loading…</span>
        </div>
      )}

      <ImageLightbox
        isOpen={selectedIndex !== null}
        image={selectedIndex !== null ? visible[selectedIndex] : null}
        onClose={handleClose}
        onNext={handleNext}
        onPrev={handlePrev}
        disablePrev={selectedIndex === 0}
        currentIndex={selectedIndex ?? 0}
        totalImages={visible.length}
      />
    </main>
  );
}
