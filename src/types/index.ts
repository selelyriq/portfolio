export interface Image {
  id: string;
  src: string; // relative path from /public/images/
  alt: string;
  width: number; // actual image dimensions
  height: number;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description?: string;
  year?: string;
  images: Image[];
}

export interface PortfolioData {
  projects: Project[];
}
