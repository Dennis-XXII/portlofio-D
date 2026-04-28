import ProjectForm from "@/components/admin/ProjectForm";
import { getProject } from "@/app/actions";
import { notFound } from "next/navigation";

export default async function EditProjectPage({ params }) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  return (
    <div>
      <h1 className="h1">Edit Project</h1>
      <ProjectForm project={project} />
    </div>
  );
}
