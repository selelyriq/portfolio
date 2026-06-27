import Image from "next/image";
import Link from "next/link";
import { portfolioData } from "@/data/projects";
import { getImageUrl } from "@/utils/imageLoader";
import styles from "./projectsCatalog.module.css";

export default function ProjectsCatalog() {
  const { projects } = portfolioData;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Albums</h1>
        <p className={styles.subtitle}>{projects.length} series</p>
      </header>

      <div className={styles.grid}>
        {projects.map((project) => {
          const thumbnail = project.images[0];

          return (
            <Link
              key={project.id}
              href={`/album/${project.id}`}
              className={styles.card}
            >
              <div className={styles.thumbnail}>
                {thumbnail && (
                  <Image
                    src={getImageUrl(thumbnail.src)}
                    alt={thumbnail.alt}
                    width={thumbnail.width}
                    height={thumbnail.height}
                    className={styles.thumbnailImage}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                )}
              </div>

              <div className={styles.meta}>
                <p className={styles.projectTitle}>{project.title}</p>
                {project.description && (
                  <p className={styles.description}>{project.description}</p>
                )}
                {project.year && (
                  <span className={styles.year}>{project.year}</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
