import { getExperiences } from "../../actions";
import ExperienceForm from "@/components/admin/ExperienceForm";
import ExperienceList from "@/components/admin/ExperienceList";

export default async function AdminExperience() {
  const experiences = await getExperiences();

  return (
    <div>
      <h1 className='h1' style={{ marginBottom: "32px" }}>Manage Experience</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
        <section>
          <h2 className='h3' style={{ marginBottom: "20px" }}>Add New Experience</h2>
          <ExperienceForm />
        </section>

        <section>
          <h2 className='h3' style={{ marginBottom: "20px" }}>Existing Experiences</h2>
          <ExperienceList experiences={experiences} />
        </section>
      </div>
    </div>
  );
}
