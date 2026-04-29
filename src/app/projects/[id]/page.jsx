import { getProject } from "@/app/actions";
import { notFound } from "next/navigation";
import ProjectClient from "./ProjectClient";

export default async function ProjectDetailPage({ params }) {
  const { id } = await params;
  
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  return <ProjectClient project={project} />;
}
