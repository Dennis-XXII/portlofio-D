import { getSkills } from "../../actions";
import SkillForm from "@/components/admin/SkillForm";
import SkillList from "@/components/admin/SkillList";

export default async function AdminSkills() {
  const skills = await getSkills();

  return (
    <div>
      <h1 className='h1' style={{ marginBottom: "32px" }}>Manage Skills</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
        <section>
          <h2 className='h3' style={{ marginBottom: "20px" }}>Add New Skill</h2>
          <SkillForm />
        </section>

        <section>
          <h2 className='h3' style={{ marginBottom: "20px" }}>Technical Skills</h2>
          <SkillList skills={skills.technical} title="Technical" />
          
          <h2 className='h3' style={{ marginBottom: "20px", marginTop: "40px" }}>Soft Skills</h2>
          <SkillList skills={skills.soft} title="Soft" />
        </section>
      </div>
    </div>
  );
}
