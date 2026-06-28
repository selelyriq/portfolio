"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { landingImages } from "@/data/landingImages";
import ParticleField from "./ParticleField";
import styles from "./landingPage.module.css";

const gridCells = Array.from({ length: 20 }, (_, i) => ({ id: `cell-${i}` }));

const imgSrc = (src: string) => `/images/${src}`;
const blurSrc = (src: string) => `/images/landing-blur/${src.split('/').pop()}`;

// Material-standard easing for soft, symmetric fades.
const EASE = [0.4, 0, 0.2, 1] as const;
const FADE_IN_DURATION = 2;
const FADE_OUT_DURATION = 1.2;
const MIN_HOLD = 3500;
const MAX_HOLD = 7000;

// Module-level — tracks srcs currently on screen across all cells
const displayedSrcs = new Set<string>();

function getRandomExcluding(excludeSrcs: Set<string>): string {
  const available = landingImages.filter(img => !excludeSrcs.has(img.src));
  const pool = available.length > 0 ? available : landingImages;
  return pool[Math.floor(Math.random() * pool.length)].src;
}

function pickInitial(count: number): string[] {
  const used = new Set<string>();
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    const src = getRandomExcluding(used);
    used.add(src);
    result.push(src);
  }
  return result;
}

type Phase = 'in' | 'out';

interface CyclingCellProps {
  initialSrc: string;
  wrapperClassName: string;
  imgClassName: string;
  resolveSrc: (src: string) => string;
  maxOpacity: number;
  ready: boolean;
}

function CyclingCell({ initialSrc, wrapperClassName, imgClassName, resolveSrc, maxOpacity, ready }: CyclingCellProps) {
  const [src, setSrc] = useState(initialSrc);
  const [phase, setPhase] = useState<Phase>('in');
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentSrcRef = useRef(initialSrc);

  useEffect(() => {
    displayedSrcs.add(initialSrc);
    currentSrcRef.current = initialSrc;
    return () => {
      displayedSrcs.delete(currentSrcRef.current);
      if (holdTimer.current) clearTimeout(holdTimer.current);
    };
  }, [initialSrc]);

  const handleAnimationComplete = () => {
    if (!ready) return;
    if (phase === 'in') {
      const hold = MIN_HOLD + Math.random() * (MAX_HOLD - MIN_HOLD);
      holdTimer.current = setTimeout(() => setPhase('out'), hold);
    } else {
      setSrc(() => {
        displayedSrcs.delete(currentSrcRef.current);
        const next = getRandomExcluding(displayedSrcs);
        displayedSrcs.add(next);
        currentSrcRef.current = next;
        return next;
      });
      setPhase('in');
    }
  };

  return (
    <motion.div
      className={wrapperClassName}
      initial={{ opacity: 0 }}
      animate={{ opacity: ready && phase === 'in' ? maxOpacity : 0 }}
      transition={{ duration: phase === 'in' ? FADE_IN_DURATION : FADE_OUT_DURATION, ease: EASE }}
      onAnimationComplete={handleAnimationComplete}
    >
      <img src={resolveSrc(src)} alt="" decoding="async" className={imgClassName} />
    </motion.div>
  );
}

export default function LandingPage() {
  const [ready, setReady] = useState(false);
  const [mainInit] = useState(() => pickInitial(10));
  const [middleInit] = useState(() => pickInitial(4));
  const [blurInit] = useState(() => pickInitial(10));

  // Two-phase preload: gate cycling on the 24 initially-rendered images,
  // then background-load the rest of the pool with no gate.
  useEffect(() => {
    // The 24 URLs shown on screen immediately (main + middle use imgSrc, blur layer uses blurSrc)
    const priorityUrls = [
      ...mainInit.map(imgSrc),
      ...middleInit.map(imgSrc),
      ...blurInit.map(blurSrc),
    ];
    const prioritySet = new Set(priorityUrls);

    let loaded = 0;
    let isReady = false;
    const onPriorityLoad = () => {
      if (!isReady && ++loaded >= priorityUrls.length) {
        isReady = true;
        setReady(true);
      }
    };

    // Phase 1 — gate ready on the 24 rendered images
    priorityUrls.forEach(url => {
      const img = new window.Image();
      img.onload = img.onerror = onPriorityLoad;
      img.src = url;
    });

    // Phase 2 — fire-and-forget the rest of the pool into cache, no gate
    landingImages.forEach(img => {
      const mainUrl = imgSrc(img.src);
      const blurUrl = blurSrc(img.src);
      if (!prioritySet.has(mainUrl)) { new window.Image().src = mainUrl; }
      if (!prioritySet.has(blurUrl)) { new window.Image().src = blurUrl; }
    });
  }, []);

  const middleIndices = [1, 3, 5, 7];
  const blurIndices = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];

  return (
    <div className={styles.landing}>
      <ParticleField />

      {/* Small middle layer */}
      <div className={styles.gridMiddle}>
        {middleIndices.map((index, i) => (
          <div key={`middle-${gridCells[index].id}`} className={styles.cellMiddle} style={{ rotate: '45deg' }}>
            <CyclingCell
              initialSrc={middleInit[i]}
              wrapperClassName={styles.imageWrapperMiddle}
              imgClassName={styles.imageMiddle}
              resolveSrc={imgSrc}
              maxOpacity={1}
              ready={ready}
            />
          </div>
        ))}
      </div>

      {/* Blurred glow layer */}
      <div className={styles.gridBlur}>
        {blurIndices.map((index, i) => (
          <div key={`blur-${gridCells[index].id}`} className={styles.cellBlur} style={{ rotate: '45deg' }}>
            <CyclingCell
              initialSrc={blurInit[i]}
              wrapperClassName={styles.imageWrapperBlur}
              imgClassName={styles.imageBlur}
              resolveSrc={blurSrc}
              maxOpacity={0.55}
              ready={ready}
            />
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className={styles.grid}>
        {gridCells.slice(0, 10).map((cell, i) => (
          <div key={cell.id} className={styles.cell} style={{ rotate: '45deg' }}>
            <CyclingCell
              initialSrc={mainInit[i]}
              wrapperClassName={styles.imageWrapper}
              imgClassName={styles.image}
              resolveSrc={imgSrc}
              maxOpacity={1}
              ready={ready}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
