import { getProjects } from "../../actions";
import ProjectList from "@/components/admin/ProjectList";
import Link from "next/link";

export default async function AdminProjects() {
  const projects = await getProjects();

  return (
    <div>
      <div className="admin-header">
        <h1 className='h1'>Manage Projects</h1>
        <Link href="/admin/projects/new" className="primary-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Project
        </Link>
      </div>
      
      <div className="summary-card">
        <h2 className="h2" style={{ fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px", color: "#666" }}>Existing Projects</h2>
        <p style={{ marginBottom: "20px", fontSize: "14px", color: "#888" }}>Drag items to reorder them on your portfolio.</p>
        <ProjectList projects={projects} />
      </div>
    </div>
  );
}
