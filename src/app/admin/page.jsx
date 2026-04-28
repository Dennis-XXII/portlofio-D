import { getProjects, getExperiences, getSkills } from "../actions";

export default async function AdminDashboard() {
  const [projects, experiences, skills] = await Promise.all([
    getProjects(),
    getExperiences(),
    getSkills(),
  ]);

  return (
    <div>
      <h1 className='h1'>Dashboard Overview</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px", marginBottom: "40px" }}>
        <div className="summary-card">
          <h3 style={{ color: "#666", fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Projects</h3>
          <p style={{ fontSize: "36px", fontWeight: "800", color: "var(--admin-accent)" }}>{projects.length}</p>
        </div>
        <div className="summary-card">
          <h3 style={{ color: "#666", fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Experiences</h3>
          <p style={{ fontSize: "36px", fontWeight: "800", color: "var(--admin-accent)" }}>{experiences.length}</p>
        </div>
        <div className="summary-card">
          <h3 style={{ color: "#666", fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Skills</h3>
          <p style={{ fontSize: "36px", fontWeight: "800", color: "var(--admin-accent)" }}>
            {skills.technical.length + skills.soft.length}
          </p>
        </div>
      </div>

      <div style={{ background: "white", padding: "40px", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.05)" }}>
        <h2>Welcome back, Admin!</h2>
        <p style={{ color: "#666", fontSize: "16px", lineHeight: "1.6" }}>
          This is your central command center. Use the sidebar to navigate through your portfolio sections. 
          You can add, update, or remove content in real-time. Changes will be immediately reflected on your public portfolio.
        </p>
      </div>
    </div>
  );
}
