"use client";

import { useState, useEffect } from "react";
import { portfolioData } from "@/data/projects";
import ProjectSection from "./ProjectSection";
import styles from "./gallery.module.css";

export default function Gallery() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={styles.gallery}>
      {portfolioData.projects.map((project) => (
        <ProjectSection key={project.id} project={project} />
      ))}
    </div>
  );
}
