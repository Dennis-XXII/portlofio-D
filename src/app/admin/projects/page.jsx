import { getProjects } from "../../actions";
import ProjectForm from "@/components/admin/ProjectForm";
import ProjectList from "@/components/admin/ProjectList";

export default async function AdminProjects() {
  const projects = await getProjects();

  return (
    <div>
      <h1 className='h1' style={{ marginBottom: "32px" }}>Manage Projects</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
        <section>
          <h2 className='h3' style={{ marginBottom: "20px" }}>Add New Project</h2>
          <ProjectForm />
        </section>

        <section>
          <h2 className='h3' style={{ marginBottom: "20px" }}>Existing Projects</h2>
          <ProjectList projects={projects} />
        </section>
      </div>
    </div>
  );
}
