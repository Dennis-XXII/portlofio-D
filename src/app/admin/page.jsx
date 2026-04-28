import { getProjects, getExperiences, getSkills } from "../actions";

export default async function AdminDashboard() {
  const [projects, experiences, skills] = await Promise.all([
    getProjects(),
    getExperiences(),
    getSkills(),
  ]);

  return (
    <div>
      <h1 className='h1' style={{ marginBottom: "20px" }}>Dashboard Summary</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
        <div className="summary-card">
          <h3>Projects</h3>
          <p style={{ fontSize: "32px", fontWeight: "700" }}>{projects.length}</p>
        </div>
        <div className="summary-card">
          <h3>Experiences</h3>
          <p style={{ fontSize: "32px", fontWeight: "700" }}>{experiences.length}</p>
        </div>
        <div className="summary-card">
          <h3>Skills</h3>
          <p style={{ fontSize: "32px", fontWeight: "700" }}>
            {skills.technical.length + skills.soft.length}
          </p>
        </div>
      </div>

      <div style={{ marginTop: "40px" }}>
        <h2>Welcome, Admin!</h2>
        <p>Select a section from the sidebar to start editing your portfolio content.</p>
      </div>
    </div>
  );
}
