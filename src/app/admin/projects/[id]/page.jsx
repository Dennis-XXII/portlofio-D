import ProjectForm from "@/components/admin/ProjectForm";
import ProjectSectionManager from "@/components/admin/ProjectSectionManager";
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
      
      <div style={{ marginTop: "60px", borderTop: "2px solid #eee", paddingTop: "40px" }}>
        <ProjectSectionManager projectId={project.id} sections={project.sections} />
      </div>
    </div>
  );
}
