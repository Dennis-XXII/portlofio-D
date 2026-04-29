import { getSkills } from "../../actions";
import SkillList from "@/components/admin/SkillList";
import Link from "next/link";

export default async function AdminSkills() {
  const skills = await getSkills();

  return (
    <div>
      <div className="admin-header">
        <h1 className='h1'>Manage Skills</h1>
        <Link href="/admin/skills/new" className="primary-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Skill
        </Link>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
        <section className="summary-card">
          <h2 className="h2" style={{ fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px", color: "#666" }}>Technical Skills</h2>
          <SkillList skills={skills.technical} />
        </section>

        <section className="summary-card">
          <h2 className="h2" style={{ fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px", color: "#666" }}>Soft Skills</h2>
          <SkillList skills={skills.soft} />
        </section>
      </div>
    </div>
  );
}
