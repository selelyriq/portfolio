import { PortfolioData } from "@/types";

export const portfolioData: PortfolioData = {
  projects: [
    {
      id: "1",
      title: "Urban Landscape Series",
      slug: "urban-landscape",
      description: "Exploration of light in urban environments",
      year: "2024",
      images: [
        {
          id: "urban-1",
          src: "series-1/image-1.jpg",
          alt: "Urban landscape 1",
          width: 1920,
          height: 1280,
        },
        {
          id: "urban-2",
          src: "series-1/image-2.jpg",
          alt: "Urban landscape 2",
          width: 1920,
          height: 1280,
        },
      ],
    },
    {
      id: "2",
      title: "Natural Forms",
      slug: "natural-forms",
      description: "Close-ups of natural textures and patterns",
      year: "2023",
      images: [
        {
          id: "nature-1",
          src: "series-2/image-1.jpg",
          alt: "Natural form 1",
          width: 1920,
          height: 1280,
        },
      ],
    },
  ],
};
