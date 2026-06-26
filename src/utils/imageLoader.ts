import { Project, Image } from "@/types";

export function flattenProjectsForGallery(projects: Project[]): Image[] {
  return projects.flatMap((project) =>
    project.images.map((image) => ({
      ...image,
      projectTitle: project.title,
      projectId: project.id,
    }))
  );
}

export function getImageUrl(imagePath: string): string {
  return `/images/${imagePath}`;
}
