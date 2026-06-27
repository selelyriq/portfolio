"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import styles from "./particleField.module.css";

interface Particle {
  id: number;
  left: number;
  top: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
}

export default function ParticleField() {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 39 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2,
      duration: Math.random() * 8 + 6, // 6-14 seconds
      size: Math.random() * 4 + 2, // 2-6px
      opacity: Math.random() * 0.6 + 0.3, // 0.3-0.9
    }));
  }, []);

  return (
    <div className={styles.particleField}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={styles.particle}
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
          }}
          initial={{ y: 0, x: 0, opacity: 0 }}
          animate={{
            y: [0, -30, 30, 0],
            x: [0, 20, -20, 0],
            opacity: [0, particle.opacity, particle.opacity, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
