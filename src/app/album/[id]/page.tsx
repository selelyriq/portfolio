import { portfolioData } from "@/data/projects";
import AlbumView from "@/components/Gallery/AlbumView";
import { notFound } from "next/navigation";

interface AlbumPageProps {
  params: Promise<{ id: string }>;
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const { id } = await params;
  const project = portfolioData.projects.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  return (
    <main>
      <AlbumView project={project!} />
    </main>
  );
}
