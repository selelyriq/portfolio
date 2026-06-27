import ProjectsCatalog from "@/components/Projects/ProjectsCatalog";

export const metadata = {
  title: "Albums | Portfolio",
  description: "Browse all photo series and projects",
};

export default function ProjectsPage() {
  return (
    <main>
      <ProjectsCatalog />
    </main>
  );
}
