import { getProjects, getExperiences, getSkills } from "../actions";

export default async function AdminDashboard() {
  const [projects, experiences, skills] = await Promise.all([
    getProjects(),
    getExperiences(),
    getSkills(),
  ]);

  const totalSkills = skills.technical.length + skills.soft.length;

  return (
    <div>
      <h1 className='h1'>Dashboard Overview</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px", marginBottom: "60px" }}>
        <div className="summary-card">
          <h3 style={{ color: "#666", fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}>Projects</h3>
          <p style={{ fontSize: "48px", fontWeight: "600", color: "#000" }}>{projects.length}</p>
        </div>
        <div className="summary-card">
          <h3 style={{ color: "#666", fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}>Experiences</h3>
          <p style={{ fontSize: "48px", fontWeight: "600", color: "#000" }}>{experiences.length}</p>
        </div>
        <div className="summary-card">
          <h3 style={{ color: "#666", fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}>Skills</h3>
          <p style={{ fontSize: "48px", fontWeight: "600", color: "#000" }}>{totalSkills}</p>
        </div>
      </div>

      <div style={{ background: "white", padding: "60px", borderRadius: "24px", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "var(--admin-shadow)" }}>
        <h2 style={{ fontSize: "32px", marginBottom: "20px" }}>Welcome back, Kyaw Swar Hein!</h2>
        <p style={{ color: "#555", fontSize: "18px", lineHeight: "1.7", maxWidth: "800px" }}>
          This is your personal command center. Use the sidebar to manage your professional identity. 
          You can now drag and drop items in any list to reorder them exactly how you want them to appear on your portfolio.
        </p>
      </div>
    </div>
  );
}
